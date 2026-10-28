// Paste this entire file into Code.gs in Google Apps Script.
// Set CONTACT_APPS_SCRIPT_SECRET in Project Settings > Script properties.
var CONTACT_RECIPIENT = 'lichtwereldkerk2022@gmail.com';

function doGet() {
  return contactJson_({ success: false, error: 'method-not-allowed' });
}

function doPost(e) {
  try {
    if (
      !e ||
      !e.postData ||
      typeof e.postData.contents !== 'string' ||
      e.contentLength > 15000 ||
      e.postData.contents.length > 15000 ||
      String(e.postData.type).split(';')[0].trim().toLowerCase() !== 'application/json'
    ) {
      return contactJson_({ success: false, error: 'invalid' });
    }

    var data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (error) {
      return contactJson_({ success: false, error: 'invalid' });
    }
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      return contactJson_({ success: false, error: 'invalid' });
    }

    var secret = PropertiesService.getScriptProperties().getProperty('CONTACT_APPS_SCRIPT_SECRET');
    if (!secret || secret.length < 32 || secret.length > 256) {
      return contactJson_({ success: false, error: 'unavailable' });
    }
    if (data.secret !== secret) return contactJson_({ success: false, error: 'forbidden' });

    var name = contactText_(data.name, 120);
    var email = contactText_(data.email, 254);
    var subject = contactText_(data.subject, 160);
    var message = contactText_(data.message, 4000);
    var emailPattern = /^[^\s@<>(),;:\\"[\]]+@[^\s@<>(),;:\\"[\]]+\.[^\s@<>(),;:\\"[\]]+$/;
    if (
      !name ||
      !email ||
      !subject ||
      !message ||
      !emailPattern.test(email) ||
      contactHeaderControls_(name) ||
      contactHeaderControls_(subject) ||
      message.indexOf('\u0000') !== -1
    ) {
      return contactJson_({ success: false, error: 'invalid' });
    }
    if (MailApp.getRemainingDailyQuota() < 1) {
      return contactJson_({ success: false, error: 'quota-exceeded' });
    }

    MailApp.sendEmail({
      to: CONTACT_RECIPIENT,
      name: 'Licht van de Wereld',
      replyTo: email,
      subject: 'Website contact: ' + subject,
      body: 'Name: ' + name + '\nEmail: ' + email + '\nSubject: ' + subject + '\n\n' + message
    });
    return contactJson_({ success: true });
  } catch (error) {
    // Return a failure without logging personal messages or the shared secret.
    return contactJson_({ success: false, error: 'send-failed' });
  }
}

function contactJson_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function contactText_(value, limit) {
  if (typeof value !== 'string') return null;
  var text = value.trim();
  return text.length > 0 && text.length <= limit ? text : null;
}

function contactHeaderControls_(value) {
  for (var index = 0; index < value.length; index++) {
    var code = value.charCodeAt(index);
    if (code < 32 || code === 127) return true;
  }
  return false;
}
