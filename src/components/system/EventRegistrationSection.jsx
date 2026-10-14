'use client';

import { useIntl } from 'react-intl';
import EventRegistrationForm from './EventRegistrationForm';

export default function EventRegistrationSection({ enabled }) {
  const { formatMessage } = useIntl();

  return (
    <section className={enabled ? 'form' : 'closed-event'}>
      <div className="page-content">
        {enabled ? (
          <EventRegistrationForm />
        ) : (
          <h2>
            {formatMessage({ id: 'closed', defaultMessage: 'Registration is currently closed.' })}
          </h2>
        )}
      </div>
    </section>
  );
}
