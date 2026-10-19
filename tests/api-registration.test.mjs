import assert from 'node:assert/strict';
import { afterEach, beforeEach, mock, test } from 'node:test';
import { NextRequest } from 'next/server.js';
import nodemailer from 'nodemailer';
import { POST } from '../src/app/api/send-registration/route.js';

const envKeys = ['EVENT_REGISTRATION_ENABLED', 'NEXT_PUBLIC_EVENT_REGISTRATION_ENABLED',
  'NEXT_PUBLIC_SITE_URL', 'EMAIL_USER', 'EMAIL_PASS', 'THIRD_PERSON_EMAIL'];
let savedEnv;
let messages;
let transportOptions;
let client = 0;
const validBody = { firstName: 'Test', lastName: 'Visitor', email: 'visitor@example.com', totalOfadults: 1 };

beforeEach(() => {
  savedEnv = Object.fromEntries(envKeys.map((key) => [key, process.env[key]]));
  Object.assign(process.env, {
    EVENT_REGISTRATION_ENABLED: 'true', NEXT_PUBLIC_EVENT_REGISTRATION_ENABLED: 'true',
    NEXT_PUBLIC_SITE_URL: 'https://example.com', EMAIL_USER: 'sender@example.com',
    EMAIL_PASS: 'test-only', THIRD_PERSON_EMAIL: 'organizer@example.com'
  });
  messages = [];
  mock.method(nodemailer, 'createTransport', (options) => {
    transportOptions = options;
    return { sendMail: async (message) => { messages.push(message); } };
  });
});

afterEach(() => {
  mock.restoreAll();
  for (const [key, value] of Object.entries(savedEnv)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

function request(body = validBody, headers = {}, url = 'https://example.com/api/send-registration') {
  return new NextRequest(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: 'https://example.com',
      'x-forwarded-for': `test-${++client}`, ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body)
  });
}

test('registration is disabled unless both flags are enabled', async () => {
  for (const key of ['EVENT_REGISTRATION_ENABLED', 'NEXT_PUBLIC_EVENT_REGISTRATION_ENABLED']) {
    process.env[key] = 'false';
    assert.equal((await POST(request())).status, 404);
    process.env[key] = 'true';
  }
  assert.equal(messages.length, 0);
});

test('rejects cross-origin requests, missing origins and host-derived origin bypasses', async () => {
  for (const origin of ['', 'https://attacker.example']) {
    assert.equal((await POST(request(validBody, { origin }, 'https://attacker.example/api/send-registration'))).status, 403);
  }
  assert.equal(messages.length, 0);
});

test('validates media type, malformed JSON and request size with appropriate status codes', async () => {
  assert.equal((await POST(request(validBody, { 'content-type': 'application/json-invalid' }))).status, 415);
  assert.equal((await POST(request('{'))).status, 400);
  assert.equal((await POST(request('x'.repeat(15001)))).status, 413);
  assert.equal((await POST(request(validBody, { 'content-length': '15001' }))).status, 413);
  for (const body of [null, [], { ...validBody, email: 'a@example.com,b@example.com' },
    { ...validBody, phone: {} }, { ...validBody, totalOfadults: true },
    { ...validBody, totalOfadults: 101 }, { ...validBody, totalOfadults: -1 }]) {
    assert.equal((await POST(request(body))).status, 400);
  }
  assert.equal(messages.length, 0);
});

test('honeypot submissions return success without sending email', async () => {
  assert.equal((await POST(request({ website: 'bot.example' }))).status, 200);
  assert.equal(messages.length, 0);
});

test('the sixth attempt is blocked and has a retry header', async () => {
  for (let i = 0; i < 5; i += 1) {
    assert.equal((await POST(request({ website: 'bot.example' }, { 'x-forwarded-for': 'repeat-client' }))).status, 200);
  }
  const response = await POST(request(validBody, { 'x-forwarded-for': 'repeat-client' }));
  assert.equal(response.status, 429);
  assert.equal(response.headers.get('retry-after'), '900');
  assert.equal(messages.length, 0);
});

test('valid registrations escape HTML and use TLS without remote attachment access', async () => {
  const response = await POST(request({ ...validBody, firstName: '<script>alert(1)</script>', message: '<img src=x onerror=alert(1)>' }));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal(messages.length, 1);
  assert.equal(messages[0].to, 'organizer@example.com');
  assert.equal(messages[0].replyTo, validBody.email);
  assert.ok(messages[0].html.includes('&lt;script&gt;'));
  assert.ok(!messages[0].html.includes('<script>'));
  assert.ok(!messages[0].html.includes('<img'));
  assert.equal(transportOptions.requireTLS, true);
  assert.equal(transportOptions.disableFileAccess, true);
  assert.equal(transportOptions.disableUrlAccess, true);
});
