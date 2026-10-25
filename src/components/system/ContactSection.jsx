'use client';

import { useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { contactEmail } from '../../data/contact';

const emptyForm = { name: '', email: '', subject: '', message: '', website: '' };

export default function ContactSection() {
  const { formatMessage } = useIntl();
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const submitting = useRef(false);
  const t = (id) => formatMessage({ id });

  function change(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (status === 'success') setStatus('idle');
  }

  async function submit(event) {
    event.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    setStatus('submitting');
    setError('');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        signal: AbortSignal.timeout(35_000)
      });
      if (!response.ok) {
        setError(response.status === 429 ? 'contactRateLimited' : response.status === 400 ? 'contactInvalid' : 'contactSendFailed');
        setStatus('error');
        return;
      }
      const result = await response.json();
      if (result.success !== true) throw new Error('Delivery not confirmed');
      setForm(emptyForm);
      setStatus('success');
    } catch {
      setError('contactSendFailed');
      setStatus('error');
    } finally {
      submitting.current = false;
    }
  }

  return (
    <section className="primary contact-section" aria-labelledby="contact-form-title">
      <div className="page-content">
        <div className="text-block">
          <h2 id="contact-form-title">{t('contactFormTitle')}</h2>
          <p>{t('contactDirectEmail')}</p>
          <p><a className="contact-email" href={`mailto:${contactEmail}`} dir="ltr">{contactEmail}</a></p>
        </div>
        <form className="form-block contact-form" action="/api/contact" method="post" onSubmit={submit} aria-busy={status === 'submitting'}>
          <p>{t('contactRequiredFields')}</p>
          <fieldset disabled={status === 'submitting'} aria-label={t('contactFormTitle')}>
            <div className="form-grid">
              <label htmlFor="contact-name">
                <span className="title">{t('contactName')}</span>
                <input id="contact-name" name="name" autoComplete="name" maxLength={120} required value={form.name} onChange={change} />
              </label>
              <label htmlFor="contact-email">
                <span className="title">{t('email')}</span>
                <input id="contact-email" name="email" type="email" dir="ltr" autoComplete="email" maxLength={254} required value={form.email} onChange={change} />
              </label>
            </div>
            <label htmlFor="contact-subject">
              <span className="title">{t('contactSubject')}</span>
              <input id="contact-subject" name="subject" maxLength={160} required value={form.subject} onChange={change} />
            </label>
            <label htmlFor="contact-message">
              <span className="title">{t('message')}</span>
              <textarea id="contact-message" name="message" rows={7} maxLength={4000} required value={form.message} onChange={change} />
            </label>
            <label className="form-honeypot" aria-hidden="true">
              Website
              <input name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={change} />
            </label>
          </fieldset>
          <div role="status" aria-live="polite">
            {status === 'success' && <p className="form-status form-status-success">{t('contactSuccess')}</p>}
          </div>
          {error && <p className="form-status form-status-error" role="alert">{t(error)}</p>}
          <button type="submit" disabled={status === 'submitting'}>
            {t(status === 'submitting' ? 'sending' : 'contactSubmit')}
          </button>
        </form>
      </div>
    </section>
  );
}
