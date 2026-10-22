import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createRegistrationRateLimiter,
  readRegistrationBody
} from '../src/lib/registration-security.mjs';

const requestWithBody = (body, headers = {}) =>
  new Request('https://example.com/api/send-registration', {
    method: 'POST',
    body,
    headers,
    ...(body instanceof ReadableStream ? { duplex: 'half' } : {})
  });

test('accepts a valid JSON body with Persian text', async () => {
  const body = { firstName: 'سلام', message: 'Welcome' };
  assert.deepEqual(await readRegistrationBody(requestWithBody(JSON.stringify(body))), body);
});

test('rejects malformed JSON and invalid UTF-8 as client errors', async () => {
  for (const body of ['{', new Uint8Array([0xff])]) {
    await assert.rejects(readRegistrationBody(requestWithBody(body)), { status: 400 });
  }
});

test('rejects an oversized declared body before reading it', async () => {
  let read = false;
  await assert.rejects(
    readRegistrationBody({
      headers: new Headers({ 'content-length': '15001' }),
      get body() {
        read = true;
        throw new Error('Must not read');
      }
    }),
    { status: 413 }
  );
  assert.equal(read, false);
});

test('accepts exactly 15000 bytes and rejects one byte more, including multibyte text', async () => {
  assert.equal(
    (await readRegistrationBody(requestWithBody(JSON.stringify('x'.repeat(14998))))).length,
    14998
  );
  for (const value of ['x'.repeat(14999), 'س'.repeat(7500)]) {
    await assert.rejects(readRegistrationBody(requestWithBody(JSON.stringify(value))), {
      status: 413
    });
  }
});

test('stops reading and cancels an oversized chunked body even with a false Content-Length', async () => {
  for (const headers of [{}, { 'content-length': '1' }]) {
    let reads = 0;
    let cancelled = false;
    const body = new ReadableStream(
      {
        pull(controller) {
          reads += 1;
          controller.enqueue(new Uint8Array(8000));
        },
        cancel() {
          cancelled = true;
        }
      },
      { highWaterMark: 0 }
    );
    await assert.rejects(readRegistrationBody(requestWithBody(body, headers)), { status: 413 });
    assert.equal(reads, 2);
    assert.equal(cancelled, true);
  }
});

test('limits repeated requests and resets at the end of the window', () => {
  let time = 0;
  const limited = createRegistrationRateLimiter({ now: () => time });
  for (let i = 0; i < 5; i += 1) assert.equal(limited('client'), false);
  for (let i = 0; i < 10000; i += 1) assert.equal(limited('client'), true);
  assert.equal(limited('another-client'), false);
  time = 15 * 60 * 1000;
  assert.equal(limited('client'), false);
});

test('bounds the number of tracked clients without evicting active limits', () => {
  let time = 0;
  const limited = createRegistrationRateLimiter({
    maxClients: 2,
    maxAttempts: 1,
    windowMs: 100,
    now: () => time
  });
  assert.equal(limited('first'), false);
  assert.equal(limited('second'), false);
  for (let i = 0; i < 1000; i += 1) assert.equal(limited(`extra-${i}`), true);
  assert.equal(limited('first'), true);
  time = 100;
  assert.equal(limited('third'), false);
  assert.equal(limited('fourth'), false);
});
