import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';

const MAX_BODY_BYTES = 15_000;
const MAX_TEXT_LENGTH = 120;
const MAX_MESSAGE_LENGTH = 2_000;
const MAX_ATTENDEES_PER_GROUP = 100;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const attempts = new Map();

function json(data, status, extraHeaders = {}) {
  return NextResponse.json(data, {
    status,
    headers: { 'Cache-Control': 'no-store', ...extraHeaders }
  });
}

function cleanText(value, maxLength = MAX_TEXT_LENGTH, required = true) {
  if (typeof value !== 'string') return required ? null : '';
  const cleaned = value.trim();
  if ((required && !cleaned) || cleaned.length > maxLength) return null;
  return cleaned;
}

function attendeeCount(value) {
  const count = Number(value);
  return Number.isSafeInteger(count) && count >= 0 && count <= MAX_ATTENDEES_PER_GROUP ? count : null;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function clientIp(request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'unknown';
}

function isRateLimited(ip) {
  const now = Date.now();
  const recent = (attempts.get(ip) || []).filter((time) => now - time < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  attempts.set(ip, recent);

  if (attempts.size > 5_000) {
    for (const [key, times] of attempts) {
      if (!times.some((time) => now - time < RATE_LIMIT_WINDOW_MS)) attempts.delete(key);
    }
  }

  return recent.length > RATE_LIMIT_MAX;
}

export async function POST(request) {
  if (process.env.EVENT_REGISTRATION_ENABLED !== 'true') return json({ error: 'Not found' }, 404);

  const contentType = request.headers.get('content-type') || '';
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (!contentType.startsWith('application/json') || contentLength > MAX_BODY_BYTES) {
    return json({ error: 'Invalid request' }, 415);
  }

  const origin = request.headers.get('origin');
  const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  const allowedOrigins = new Set([request.nextUrl.origin, configuredOrigin].filter(Boolean));
  if (!origin || !allowedOrigins.has(origin)) return json({ error: 'Forbidden' }, 403);

  const ip = clientIp(request);
  if (isRateLimited(ip)) return json({ error: 'Too many requests' }, 429, { 'Retry-After': '900' });

  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) return json({ error: 'Request too large' }, 413);
    const body = JSON.parse(raw);
    if (!body || typeof body !== 'object' || Array.isArray(body)) return json({ error: 'Invalid request' }, 400);
    if (body.website) return json({ success: true }, 200);

    const firstName = cleanText(body.firstName);
    const lastName = cleanText(body.lastName);
    const email = cleanText(body.email);
    const phone = cleanText(body.phone, MAX_TEXT_LENGTH, false);
    const message = cleanText(body.message, MAX_MESSAGE_LENGTH, false);
    const counts = ['totalOfadults', 'kidsgirls6', 'kidsgirls12', 'kidsboys6', 'kidsboys12'].map((key) => attendeeCount(body[key] ?? 0));

    if (!firstName || !lastName || !email || !emailPattern.test(email) || phone === null || message === null || counts.includes(null)) {
      return json({ error: 'Invalid registration data' }, 400);
    }

    const { EMAIL_USER, EMAIL_PASS, THIRD_PERSON_EMAIL } = process.env;
    if (!EMAIL_USER || !EMAIL_PASS || !THIRD_PERSON_EMAIL || !emailPattern.test(THIRD_PERSON_EMAIL)) {
      console.error('Registration email service is not configured');
      return json({ error: 'Service unavailable' }, 503);
    }

    const [adults, girls6, girls12, boys6, boys12] = counts;
    const total = counts.reduce((sum, count) => sum + count, 0);
    const safe = Object.fromEntries(
      Object.entries({ firstName, lastName, email, phone, message }).map(([key, value]) => [key, escapeHtml(value)])
    );
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 15_000,
      disableFileAccess: true,
      disableUrlAccess: true,
      auth: { user: EMAIL_USER, pass: EMAIL_PASS }
    });

    await transporter.sendMail({
      from: `"Licht van de Wereld" <${EMAIL_USER}>`,
      to: THIRD_PERSON_EMAIL,
      replyTo: email,
      subject: 'Nieuwe evenementregistratie',
      html: `<h2>Nieuwe registratie</h2><p><b>Naam:</b> ${safe.firstName} ${safe.lastName}</p><p><b>E-mail:</b> ${safe.email}</p><p><b>Telefoon:</b> ${safe.phone}</p><p><b>Volwassenen:</b> ${adults}</p><p><b>Meisjes t/m 6:</b> ${girls6}</p><p><b>Meisjes t/m 12:</b> ${girls12}</p><p><b>Jongens t/m 6:</b> ${boys6}</p><p><b>Jongens t/m 12:</b> ${boys12}</p><p><b>Totaal:</b> ${total}</p><p><b>Bericht:</b><br>${safe.message}</p>`
    });

    return json({ success: true }, 200);
  } catch (error) {
    console.error('Registration error:', error instanceof Error ? error.message : 'Unknown error');
    return json({ error: 'Server error' }, 500);
  }
}
