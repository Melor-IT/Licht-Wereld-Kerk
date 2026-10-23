import { NextResponse } from 'next/server.js';
import {
  createRegistrationRateLimiter as createContactRateLimiter,
  readRegistrationBody as readContactBody,
  RequestBodyError
} from '../../../lib/registration-security.mjs';

export const runtime = 'nodejs';

const isRateLimited = createContactRateLimiter();
const emailPattern = /^[^\s@<>(),;:\\"[\]]+@[^\s@<>(),;:\\"[\]]+\.[^\s@<>(),;:\\"[\]]+$/;
const hasHeaderControls = (value) => Array.from(value).some((character) => {
  const code = character.codePointAt(0);
  return code < 32 || code === 127;
});

function json(data, status, headers = {}) {
  return NextResponse.json(data, {
    status,
    headers: { 'Cache-Control': 'no-store', ...headers }
  });
}

function text(value, limit) {
  if (typeof value !== 'string') return null;
  const cleaned = value.trim();
  return cleaned.length > 0 && cleaned.length <= limit ? cleaned : null;
}

function appsScriptUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === 'script.google.com' &&
      !url.port && !url.username && !url.password && !url.search && !url.hash &&
      /^\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(url.pathname) ? url.href : null;
  } catch {
    return null;
  }
}

export async function POST(request) {
  if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') {
    return json({ error: 'invalid' }, 415);
  }

  const allowedOrigin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || request.nextUrl.origin;
  if (request.headers.get('origin') !== allowedOrigin) return json({ error: 'forbidden' }, 403);

  const ip = (
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') || 'unknown'
  ).slice(0, 128);
  if (isRateLimited(ip)) return json({ error: 'rate-limited' }, 429, { 'Retry-After': '900' });

  try {
    const body = await readContactBody(request);
    if (!body || typeof body !== 'object' || Array.isArray(body)) return json({ error: 'invalid' }, 400);
    if (body.website) return json({ success: true }, 200);

    const name = text(body.name, 120);
    const email = text(body.email, 254);
    const subject = text(body.subject, 160);
    const message = text(body.message, 4000);
    if (!name || !email || !subject || !message || !emailPattern.test(email) ||
        hasHeaderControls(name) || hasHeaderControls(subject) || message.includes('\u0000')) {
      return json({ error: 'invalid' }, 400);
    }

    const url = appsScriptUrl(process.env.CONTACT_APPS_SCRIPT_URL);
    const secret = process.env.CONTACT_APPS_SCRIPT_SECRET;
    if (!url || !secret || secret.length < 32 || secret.length > 256) {
      return json({ error: 'unavailable' }, 503);
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, name, email, subject, message }),
      cache: 'no-store',
      redirect: 'follow',
      signal: AbortSignal.timeout(20_000)
    });
    if (!response.ok) return json({ error: 'send-failed' }, 502);
    const result = await response.json();
    if (result?.success !== true) {
      const status = ['quota-exceeded', 'unavailable'].includes(result?.error) ? 503 : 502;
      return json({ error: status === 503 ? 'unavailable' : 'send-failed' }, status);
    }
    return json({ success: true }, 200);
  } catch (error) {
    if (error instanceof RequestBodyError) return json({ error: 'invalid' }, error.status);
    console.error('Contact Apps Script delivery failed');
    return json({ error: 'send-failed' }, 502);
  }
}
