import { existsSync } from 'node:fs';

if (existsSync('.env.local')) process.loadEnvFile('.env.local');
const value = process.env.CONTACT_APPS_SCRIPT_URL;
const secret = process.env.CONTACT_APPS_SCRIPT_SECRET;
let url;
try { url = new URL(value); } catch { throw new Error('Set CONTACT_APPS_SCRIPT_URL to the Google Web App /exec URL.'); }
if (url.protocol !== 'https:' || url.hostname !== 'script.google.com' || url.port || url.username || url.password ||
    url.search || url.hash || !/^\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(url.pathname)) throw new Error('Invalid Google Apps Script URL.');
if (!secret || secret.length < 32 || secret.length > 256) throw new Error('Set a shared secret of 32-256 characters.');

const signal = AbortSignal.timeout(20_000);
// All required mail fields are absent. This check never sends an email.
let response = await fetch(url, {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ secret }),
  redirect: 'manual', signal
});
if ([302, 303].includes(response.status)) {
  const location = response.headers.get('location');
  const redirect = new URL(location || '', url);
  if (!location || redirect.protocol !== 'https:' || redirect.hostname !== 'script.googleusercontent.com' ||
      redirect.pathname !== '/macros/echo' || redirect.port || redirect.username || redirect.password || redirect.hash) {
    throw new Error('Unexpected Google redirect; credentials were not forwarded.');
  }
  void response.body?.cancel().catch(() => {});
  response = await fetch(redirect, { method: 'GET', redirect: 'manual', signal });
}
let result;
try { result = await response.json(); } catch { throw new Error('Google returned an invalid response. Check Web App access: Anyone.'); }
if (response.ok && result?.success === false && result.error === 'invalid') {
  console.log('Google accepted the shared secret. No email was sent.');
} else {
  const reasons = {
    forbidden: 'The website secret does not match CONTACT_APPS_SCRIPT_SECRET in Google Script Properties.',
    unavailable: 'Google configuration is unavailable. Set CONTACT_APPS_SCRIPT_SECRET in Google Script Properties and publish the correct Code.gs.',
    'method-not-allowed': 'Google did not accept POST. Check the deployment and doPost function.'
  };
  console.error(reasons[result?.error] || 'Google did not confirm the expected authentication check.');
  process.exitCode = 1;
}
