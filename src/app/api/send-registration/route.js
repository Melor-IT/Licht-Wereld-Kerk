import { NextResponse } from 'next/server.js';
import nodemailer from 'nodemailer';
import { createRegistrationRateLimiter, readRegistrationBody, RequestBodyError } from '../../../lib/registration-security.mjs';

export const runtime = 'nodejs';

const MAX_TEXT_LENGTH = 120;
const MAX_MESSAGE_LENGTH = 2_000;
const MAX_ATTENDEES_PER_GROUP = 100;
const emailPattern = /^[^\s@<>(),;:\\"[\]]+@[^\s@<>(),;:\\"[\]]+\.[^\s@<>(),;:\\"[\]]+$/;
const isRateLimited = createRegistrationRateLimiter();

function json(data, status, extraHeaders = {}) {
  return NextResponse.json(data, {
    status,
    headers: { 'Cache-Control': 'no-store', ...extraHeaders }
  });
}

function cleanText(value, maxLength = MAX_TEXT_LENGTH, required = true) {
  if (value === undefined && !required) return '';
  if (typeof value !== 'string') return null;
  const cleaned = value.trim();
  if ((required && !cleaned) || cleaned.length > maxLength) return null;
  return cleaned;
}

function attendeeCount(value) {
  if (typeof value !== 'number' && (typeof value !== 'string' || !/^\d+$/.test(value))) return null;
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
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'unknown';
  return ip.slice(0, 128);
}

export async function POST(request) {
  if (process.env.EVENT_REGISTRATION_ENABLED !== 'true'
    || process.env.NEXT_PUBLIC_EVENT_REGISTRATION_ENABLED !== 'true') return json({ error: 'Not found' }, 404);

  const contentType = request.headers.get('content-type') || '';
  if (contentType.split(';')[0].trim().toLowerCase() !== 'application/json') {
    return json({ error: 'Invalid request' }, 415);
  }

  const origin = request.headers.get('origin');
  const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  const allowedOrigins = new Set([configuredOrigin || request.nextUrl.origin]);
  if (!origin || !allowedOrigins.has(origin)) return json({ error: 'Forbidden' }, 403);

  const ip = clientIp(request);
  if (isRateLimited(ip)) return json({ error: 'Too many requests' }, 429, { 'Retry-After': '900' });

  try {
    const body = await readRegistrationBody(request);
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
    if (error instanceof RequestBodyError) return json({ error: error.message }, error.status);
    console.error('Registration error:', error instanceof Error ? error.message : 'Unknown error');
    return json({ error: 'Server error' }, 500);
  }
}
