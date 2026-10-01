'use client';

import { useState } from 'react';
import { useIntl } from 'react-intl';

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  totalOfadults: 0,
  kidsgirls6: 0,
  kidsgirls12: 0,
  kidsboys6: 0,
  kidsboys12: 0,
  message: '',
  website: ''
};

const attendeeFields = [
  'totalOfadults',
  'kidsgirls6',
  'kidsgirls12',
  'kidsboys6',
  'kidsboys12'
];

export default function EventRegistrationForm() {
  const { formatMessage } = useIntl();
  const [formData, setFormData] = useState(initialState);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  function handleChange(event) {
    const { name, value, type } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === 'number' ? Number(value) : value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus('submitting');
    setError('');

    try {
      const response = await fetch('/api/send-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Registration failed');
      setFormData(initialState);
      setStatus('success');
    } catch {
      setError(formatMessage({ id: 'error.submit', defaultMessage: 'Sending failed. Please try again.' }));
      setStatus('error');
    }
  }

  if (status === 'success') {
    return <p className="form-status form-status-success">{formatMessage({ id: 'success', defaultMessage: 'Your registration was received.' })}</p>;
  }

  return (
    <form className="form-block" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        {['firstName', 'lastName', 'email', 'phone'].map((field) => (
          <label key={field}>
            <span className="title">{formatMessage({ id: field, defaultMessage: field })}</span>
            <input
              type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required={field !== 'phone'}
              maxLength={120}
              autoComplete={field === 'email' ? 'email' : field === 'phone' ? 'tel' : field === 'firstName' ? 'given-name' : 'family-name'}
            />
          </label>
        ))}
      </div>

      <div className="form-grid form-grid-counts">
        {attendeeFields.map((field) => (
          <label key={field}>
            <span className="title">{formatMessage({ id: field, defaultMessage: field })}</span>
            <input type="number" name={field} min="0" max="100" value={formData[field]} onChange={handleChange} />
          </label>
        ))}
      </div>

      <label>
        <span className="title">{formatMessage({ id: 'message', defaultMessage: 'Message' })}</span>
        <textarea name="message" rows="5" maxLength="2000" value={formData.message} onChange={handleChange} />
      </label>

      <label className="form-honeypot" aria-hidden="true">
        Website
        <input name="website" value={formData.website} onChange={handleChange} tabIndex="-1" autoComplete="off" />
      </label>

      {error && <p className="form-status form-status-error" role="alert">{error}</p>}
      <button type="submit" disabled={status === 'submitting'}>
        {status === 'submitting'
          ? formatMessage({ id: 'sending', defaultMessage: 'Sending…' })
          : formatMessage({ id: 'send', defaultMessage: 'Send' })}
      </button>
    </form>
  );
}
