import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

export const testSecret = 'test-contact-secret-'.repeat(3);

// Execute the deployable script with local Google service stand-ins.
export function createAppsScriptHarness({ secret = testSecret, quota = 100, failDelivery = false } = {}) {
  const sent = [];
  const context = {
    ContentService: {
      MimeType: { JSON: 'application/json' },
      createTextOutput(content) {
        return { setMimeType() { return this; }, getContent() { return content; } };
      }
    },
    PropertiesService: { getScriptProperties: () => ({ getProperty: () => secret }) },
    MailApp: {
      getRemainingDailyQuota: () => quota,
      sendEmail(message) {
        if (failDelivery) throw new Error('Mail service failed');
        sent.push(message);
      }
    }
  };
  runInNewContext(readFileSync(new URL('../../google-apps-script/Code.gs', import.meta.url), 'utf8'), context);
  return {
    sent,
    get: () => JSON.parse(context.doGet().getContent()),
    post(body, overrides = {}) {
      const contents = typeof body === 'string' ? body : JSON.stringify(body);
      const event = {
        contentLength: Buffer.byteLength(contents),
        postData: { type: 'application/json', contents },
        ...overrides
      };
      return JSON.parse(context.doPost(event).getContent());
    }
  };
}
