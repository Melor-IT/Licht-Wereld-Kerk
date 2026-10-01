'use client';

import { useIntl } from 'react-intl';
import BackgroundImage from './BackgroundImage';
import EventRegistrationForm from './EventRegistrationForm';

export default function EventPage() {
  const { formatMessage } = useIntl();
  const enabled = process.env.NEXT_PUBLIC_EVENT_REGISTRATION_ENABLED === 'true';

  return (
    <div className="page event">
      <section>
        <BackgroundImage url="/images/event-banner.jpg" className="event-banner" />
        <div className="page-content">
          <h1>{formatMessage({ id: 'eventText', defaultMessage: 'Event registration' })}</h1>
          <h4>{formatMessage({ id: 'eventOnder', defaultMessage: 'You are welcome' })}</h4>
        </div>
      </section>
      <section className={enabled ? 'form' : 'closed-event'}>
        <div className="page-content">
          {enabled ? (
            <EventRegistrationForm />
          ) : (
            <h2>{formatMessage({ id: 'closed', defaultMessage: 'Registration is currently closed.' })}</h2>
          )}
        </div>
      </section>
    </div>
  );
}
