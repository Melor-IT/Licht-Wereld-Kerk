import assert from 'node:assert/strict';
import test from 'node:test';
import { createAppsScriptHarness, testSecret } from './helpers/apps-script.mjs';
import { contactEmail } from '../src/data/contact.js';

const valid = {
  secret: testSecret,
  name: 'Church visitor',
  email: 'visitor@example.com',
  subject: 'A question',
  message: 'Hello\nThank you'
};

test('the deployable script sends plain text only to the church and sets visitor reply-to', () => {
  const app = createAppsScriptHarness();
  assert.deepEqual(app.post({ ...valid, to: 'attacker@example.com' }), { success: true });
  assert.equal(app.sent.length, 1);
  assert.equal(app.sent[0].to, contactEmail);
  assert.equal(app.sent[0].replyTo, valid.email);
  assert.ok(app.sent[0].body.includes(valid.message));
  assert.equal(app.sent[0].htmlBody, undefined);
});

test('Google Apps Script refuses missing or incorrect server secrets before sending', () => {
  const app = createAppsScriptHarness();
  for (const secret of [undefined, '', 'wrong', {}]) {
    assert.deepEqual(app.post({ ...valid, secret }), { success: false, error: 'forbidden' });
  }
  assert.equal(app.sent.length, 0);
  assert.deepEqual(createAppsScriptHarness({ secret: '' }).post(valid), {
    success: false,
    error: 'unavailable'
  });
});

test('the script independently rejects malformed payloads, invalid email and header injection', () => {
  const app = createAppsScriptHarness();
  for (const body of [
    '{',
    null,
    [],
    { ...valid, name: '' },
    { ...valid, message: 12 },
    { ...valid, message: 'x'.repeat(4001) },
    { ...valid, email: 'one@example.com,two@example.com' },
    { ...valid, name: 'Visitor\nBcc: attacker@example.com' },
    { ...valid, subject: 'Question\r\nBcc: attacker@example.com' }
  ])
    assert.deepEqual(app.post(body), { success: false, error: 'invalid' });
  assert.deepEqual(app.post(valid, { contentLength: 15001 }), { success: false, error: 'invalid' });
  assert.deepEqual(app.post(valid, { postData: null }), { success: false, error: 'invalid' });
  assert.equal(app.sent.length, 0);
});

test('quota exhaustion, mail failures and GET requests never claim delivery', () => {
  const emptyQuota = createAppsScriptHarness({ quota: 0 });
  assert.deepEqual(emptyQuota.post(valid), { success: false, error: 'quota-exceeded' });
  assert.equal(emptyQuota.sent.length, 0);
  const failed = createAppsScriptHarness({ failDelivery: true });
  assert.deepEqual(failed.post(valid), { success: false, error: 'send-failed' });
  assert.equal(failed.sent.length, 0);
  assert.deepEqual(failed.get(), { success: false, error: 'method-not-allowed' });
});
