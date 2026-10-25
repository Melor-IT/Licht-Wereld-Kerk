import assert from 'node:assert/strict';
import { afterEach, beforeEach, mock, test } from 'node:test';
import { NextRequest } from 'next/server.js';
import { POST } from '../src/app/api/contact/route.js';
import { contactEmail } from '../src/data/contact.js';
import { createAppsScriptHarness, testSecret } from './helpers/apps-script.mjs';

const envKeys = ['NEXT_PUBLIC_SITE_URL', 'CONTACT_APPS_SCRIPT_URL', 'CONTACT_APPS_SCRIPT_SECRET'];
const scriptUrl = 'https://script.google.com/macros/s/test-deployment/exec';
let savedEnv;
let calls;
let app;
let upstream;
let client = 0;
const validBody = {
  name: 'Test Visitor', email: 'visitor@example.com', subject: 'A question', message: 'Hello church'
};

beforeEach(() => {
  savedEnv = Object.fromEntries(envKeys.map(key => [key, process.env[key]]));
  Object.assign(process.env, {
    NEXT_PUBLIC_SITE_URL: 'https://example.com',
    CONTACT_APPS_SCRIPT_URL: scriptUrl,
    CONTACT_APPS_SCRIPT_SECRET: testSecret
  });
  calls = [];
  app = createAppsScriptHarness();
  upstream = (options) => Response.json(app.post(JSON.parse(options.body)));
  mock.method(console, 'error', () => {});
  mock.method(globalThis, 'fetch', async (url, options) => {
    calls.push({ url, options });
    return upstream(options);
  });
});

afterEach(() => {
  mock.restoreAll();
  for (const [key, value] of Object.entries(savedEnv)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

function request(body = validBody, headers = {}, url = 'https://example.com/api/contact') {
  return new NextRequest(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json', origin: 'https://example.com',
      'x-forwarded-for': `contact-test-${++client}`, ...headers
    },
    body: typeof body === 'string' ? body : JSON.stringify(body)
  });
}

test('contact forwards only validated fields and the server secret to the actual Apps Script code', async () => {
  const response = await POST(request({
    ...validBody, to: 'attacker@example.com', secret: 'attacker-secret', message: '<script>alert(1)</script>'
  }));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { success: true });
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, scriptUrl);
  const { options } = calls[0];
  assert.equal(options.method, 'POST');
  assert.equal(options.redirect, 'manual');
  assert.equal(options.cache, 'no-store');
  assert.ok(options.signal instanceof AbortSignal);
  const forwarded = JSON.parse(options.body);
  assert.deepEqual(Object.keys(forwarded).sort(), ['email', 'message', 'name', 'secret', 'subject']);
  assert.equal(forwarded.secret, testSecret);
  assert.equal(app.sent.length, 1);
  assert.equal(app.sent[0].to, contactEmail);
  assert.equal(app.sent[0].replyTo, validBody.email);
  assert.ok(app.sent[0].body.includes('<script>alert(1)</script>'));
  assert.equal(app.sent[0].htmlBody, undefined);
});

test('contact rejects invalid fields, multiple recipients and email header injection', async () => {
  for (const body of [
    null, [], {}, { ...validBody, name: ' ' }, { ...validBody, message: {} },
    { ...validBody, email: 'one@example.com,two@example.com' },
    { ...validBody, email: 'one@example.com\r\nBcc: two@example.com' },
    { ...validBody, name: 'Visitor\nBcc: attacker@example.com' },
    { ...validBody, subject: 'Question\r\nBcc: attacker@example.com' },
    { ...validBody, subject: 'x'.repeat(161) },
    { ...validBody, message: 'x'.repeat(4001) }
  ]) assert.equal((await POST(request(body))).status, 400);
  assert.equal(calls.length, 0);
});

test('contact rejects unsupported media, malformed JSON and oversized requests', async () => {
  assert.equal((await POST(request(validBody, { 'content-type': 'text/plain' }))).status, 415);
  assert.equal((await POST(request('{'))).status, 400);
  assert.equal((await POST(request('x'.repeat(15001)))).status, 413);
  assert.equal(calls.length, 0);
});

test('contact only accepts the configured site origin, including when the request host is forged', async () => {
  for (const origin of ['', 'https://attacker.example']) {
    assert.equal((await POST(request(validBody, { origin }, 'https://attacker.example/api/contact'))).status, 403);
  }
  assert.equal(calls.length, 0);
  delete process.env.NEXT_PUBLIC_SITE_URL;
  assert.equal((await POST(request())).status, 200);
});

test('contact honeypot is ignored and attempts are bounded with a retry header', async () => {
  const headers = { 'x-forwarded-for': 'contact-rate-client' };
  for (let i = 0; i < 5; i++) {
    assert.equal((await POST(request({ website: 'bot.example' }, headers))).status, 200);
  }
  const limited = await POST(request(validBody, headers));
  assert.equal(limited.status, 429);
  assert.equal(limited.headers.get('retry-after'), '900');
  assert.equal(calls.length, 0);
});

test('unconfigured or short Apps Script secrets fail without contacting Google', async () => {
  for (const key of ['CONTACT_APPS_SCRIPT_SECRET', 'CONTACT_APPS_SCRIPT_URL']) {
    const value = process.env[key];
    delete process.env[key];
    const response = await POST(request());
    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), { error: 'unavailable' });
    process.env[key] = value;
  }
  process.env.CONTACT_APPS_SCRIPT_SECRET = 'short';
  assert.equal((await POST(request())).status, 503);
  assert.equal(calls.length, 0);
});

test('Apps Script URL must be a canonical Google HTTPS deployment rather than an arbitrary URL', async () => {
  for (const url of [
    'http://script.google.com/macros/s/deployment/exec',
    'https://attacker.example/macros/s/deployment/exec',
    'https://script.google.com.attacker.example/macros/s/deployment/exec',
    'https://user:password@script.google.com/macros/s/deployment/exec',
    'https://script.google.com/macros/s/deployment/dev',
    scriptUrl + '?secret=leak', scriptUrl + '#fragment', 'not a URL'
  ]) {
    process.env.CONTACT_APPS_SCRIPT_URL = url;
    assert.equal((await POST(request())).status, 503, url);
  }
  assert.equal(calls.length, 0);
});

test('Google login HTML, non-success JSON and HTTP errors never report email success', async () => {
  for (const reply of [
    () => new Response('<html>Sign in</html>'),
    () => Response.json(null),
    () => Response.json({}),
    () => Response.json({ success: 'true' }),
    () => Response.json({ success: false, error: 'forbidden' }),
    () => new Response('Unavailable', { status: 503 })
  ]) {
    upstream = reply;
    const response = await POST(request());
    assert.equal(response.status, 502);
    assert.deepEqual(await response.json(), { error: 'send-failed' });
  }
  assert.equal(app.sent.length, 0);
});

test('Google quota and configuration failures are reported as unavailable', async () => {
  for (const error of ['quota-exceeded', 'unavailable']) {
    upstream = () => Response.json({ success: false, error });
    const response = await POST(request());
    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), { error: 'unavailable' });
  }
});

test('network errors and timeouts do not expose details or retry potentially delivered messages', async () => {
  for (const error of [new Error('Sensitive upstream details'), new DOMException('Timed out', 'TimeoutError')]) {
    upstream = () => { throw error; };
    const response = await POST(request());
    assert.equal(response.status, 502);
    assert.deepEqual(await response.json(), { error: 'send-failed' });
  }
  assert.equal(calls.length, 2);
});


test('Google redirects retrieve only the response with GET and never forward secrets', async () => {
  const googleReply = 'https://script.googleusercontent.com/macros/echo?probe=contact-test';
  mock.restoreAll();
  mock.method(console, 'error', () => {});
  mock.method(globalThis, 'fetch', async (url, options) => {
    calls.push({ url, options });
    if (url === scriptUrl) {
      assert.equal(app.post(JSON.parse(options.body)).success, true);
      return new Response(null, { status: 302, headers: { location: googleReply } });
    }
    return Response.json({ success: true });
  });
  assert.equal((await POST(request())).status, 200);
  assert.equal(app.sent.length, 1);
  assert.equal(calls.length, 2);
  assert.equal(calls[1].url, googleReply);
  assert.equal(calls[1].options.method, 'GET');
  assert.equal(calls[1].options.body, undefined);
  assert.equal(calls[1].options.headers, undefined);
  assert.equal(calls[1].options.redirect, 'manual');
});

test('unexpected redirects and redirect chains fail without leaking credentials', async () => {
  for (const location of [
    'https://attacker.example/collect',
    'http://script.googleusercontent.com/macros/echo',
    'https://accounts.google.com/login',
    'https://script.googleusercontent.com/other',
    'https://user:password@script.googleusercontent.com/macros/echo'
  ]) {
    calls.length = 0;
    upstream = () => new Response(null, { status: 302, headers: { location } });
    assert.equal((await POST(request())).status, 502);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].options.redirect, 'manual');
  }
  calls.length = 0;
  upstream = () => new Response(null, { status: 302, headers: { location: 'https://script.googleusercontent.com/macros/echo' } });
  assert.equal((await POST(request())).status, 502);
  assert.equal(calls.length, 2);
  assert.equal(calls[1].options.body, undefined);
  assert.equal(app.sent.length, 0);
});

test('oversized Google replies never report a successful submission', async () => {
  upstream = () => new Response(JSON.stringify({ success: true, padding: 'x'.repeat(15001) }));
  assert.equal((await POST(request())).status, 502);
  assert.equal(app.sent.length, 0);
});
