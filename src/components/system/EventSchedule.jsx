'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useIntl } from 'react-intl';
import {
  FaBible,
  FaCalendarAlt,
  FaClock,
  FaExternalLinkAlt,
  FaMapMarkerAlt,
  FaUser,
  FaVideo
} from 'react-icons/fa';
import {
  eventTimeZone,
  getEventDate,
  getEventSchedule,
  getNextEventDayDelay
} from '../../lib/events';

function subscribeToEventDate(onChange) {
  let timer;
  const update = () => {
    clearTimeout(timer);
    onChange();
    timer = setTimeout(update, getNextEventDayDelay());
  };
  timer = setTimeout(update, getNextEventDayDelay());
  window.addEventListener('focus', update);
  document.addEventListener('visibilitychange', update);
  return () => {
    clearTimeout(timer);
    window.removeEventListener('focus', update);
    document.removeEventListener('visibilitychange', update);
  };
}

const categories = [
  { type: 'sermon', title: 'eventsSermons', intro: 'eventsSermonsIntro', icon: FaBible },
  { type: 'friday-class', title: 'eventsClasses', intro: 'eventsClassesIntro', icon: FaVideo }
];

export default function EventSchedule({
  events: datedEvents,
  weeklyEvents,
  rotation,
  initialDate
}) {
  // Hydration uses the server's date; a cached page or a tab crossing midnight then updates locally.
  const today = useSyncExternalStore(subscribeToEventDate, getEventDate, () => initialDate);
  const { upcoming, past } = getEventSchedule(
    datedEvents,
    new Date(`${today}T12:00:00Z`),
    weeklyEvents,
    rotation
  );
  const { formatMessage, locale } = useIntl();
  // Past meetings are temporarily disabled. Restore this state and the controls below to re-enable them.
  // const [period, setPeriod] = useState('upcoming');
  const period = 'upcoming';
  const t = (id) => formatMessage({ id });
  const content = (value) =>
    typeof value === 'string' ? value : value?.[locale] || value?.fa || value?.nl || value?.en;
  const events = period === 'upcoming' ? upcoming : past;
  const dateFormatter = (options) =>
    new Intl.DateTimeFormat(locale, { timeZone: eventTimeZone, ...options });
  const formatTime = (time) =>
    time
      .split(':')
      .map((part) =>
        new Intl.NumberFormat(locale, { minimumIntegerDigits: 2, useGrouping: false }).format(
          Number(part)
        )
      )
      .join(':');
  const renderPoster = (event, status) => {
    const date = new Date(`${event.date}T12:00:00Z`);
    const title =
      content(event.title) || t(event.type === 'sermon' ? 'eventsSermons' : 'eventsClasses');
    const dateLabel = dateFormatter({ year: 'numeric', month: 'long', day: 'numeric' }).format(
      date
    );

    return (
      <figure className="event-poster">
        <a href={event.poster} target="_blank" rel="noopener noreferrer">
          <Image
            src={event.poster}
            alt={`${title} — ${dateLabel}`}
            width={1122}
            height={1402}
            unoptimized
          />
        </a>
        <figcaption>
          {status && <strong>{t(status)}</strong>}
          <span dir="auto">{title}</span>
          <time dateTime={event.date}>{dateLabel}</time>
        </figcaption>
      </figure>
    );
  };

  return (
    <section className="event-schedule" id="event-schedule" aria-labelledby="schedule-title">
      <div className="page-content">
        <div className="events-heading">
          <div>
            <p className="events-eyebrow">{t('eventsTogether')}</p>
            <h2 id="schedule-title">{t('eventsSchedule')}</h2>
            <p className="events-timezone">
              <FaClock aria-hidden="true" />
              {t('eventsTimezone')}
            </p>
          </div>
          {/* Past meetings are temporarily disabled.
          <div className="events-period" role="group" aria-label={t('eventsPeriod')}>
            {['upcoming', 'past'].map((value) => (
              <button key={value} type="button" aria-pressed={period === value} onClick={() => setPeriod(value)}>
                {t(value === 'upcoming' ? 'eventsUpcoming' : 'eventsPast')}
              </button>
            ))}
          </div>
          */}
        </div>

        <div className="events-columns" aria-live="polite" aria-atomic="true">
          {categories.map(({ type, title, intro, icon: Icon }) => {
            const entries = events.filter((event) => event.type === type);
            const posterEvent = [...upcoming, ...past].find(
              (event) => event.type === type && event.poster
            );
            return (
              <section
                className={`events-category events-category-${type}`}
                key={type}
                aria-labelledby={`events-${type}`}
              >
                <div className="events-category-heading">
                  <span className="events-category-icon">
                    <Icon aria-hidden="true" />
                  </span>
                  <div>
                    <h3 id={`events-${type}`}>{t(title)}</h3>
                    <span className="events-friday">
                      {t(type === 'friday-class' ? 'eventsFridays' : 'eventsSundays')}
                    </span>
                  </div>
                </div>
                <p className="events-category-intro">{t(intro)}</p>
                {entries.length ? (
                  <ul className="events-list">
                    {entries.map((event) => {
                      const date = new Date(`${event.date}T12:00:00Z`);
                      return (
                        <li key={event.id}>
                          {period === 'past' && event.poster && renderPoster(event)}
                          <article className="event-card">
                            <div className="event-date-badge" aria-hidden="true">
                              <span>{dateFormatter({ month: 'short' }).format(date)}</span>
                              <strong>{dateFormatter({ day: 'numeric' }).format(date)}</strong>
                            </div>
                            <div className="event-card-content">
                              <h4 dir="auto">{content(event.title) || t(title)}</h4>
                              <time dateTime={event.date}>
                                {dateFormatter({
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                }).format(date)}
                              </time>
                              <p className="event-detail">
                                <FaClock aria-hidden="true" />
                                {event.time ? (
                                  <bdi>{formatTime(event.time)}</bdi>
                                ) : (
                                  t('eventsTimePending')
                                )}
                              </p>
                              {event.speaker && (
                                <p className="event-detail">
                                  <FaUser aria-hidden="true" />
                                  <span>
                                    {t('eventsSpeaker')}: <bdi>{content(event.speaker)}</bdi>
                                  </span>
                                </p>
                              )}
                              {event.location && (
                                <p className="event-detail">
                                  <FaMapMarkerAlt aria-hidden="true" />
                                  <bdi>{content(event.location)}</bdi>
                                </p>
                              )}
                              {event.description && (
                                <p className="event-description" dir="auto">
                                  {content(event.description)}
                                </p>
                              )}
                              {event.url && period === 'upcoming' && (
                                <a
                                  className="event-join"
                                  href={event.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {t(type === 'friday-class' ? 'eventsJoin' : 'eventsDetails')}
                                  <FaExternalLinkAlt aria-hidden="true" />
                                </a>
                              )}
                            </div>
                          </article>
                        </li>
                      );
                    })}
                  </ul>
                ) : period === 'past' && posterEvent ? (
                  renderPoster(
                    posterEvent,
                    upcoming.includes(posterEvent) ? 'eventsUpcoming' : 'eventsPast'
                  )
                ) : (
                  <div className="events-empty">
                    <FaCalendarAlt aria-hidden="true" />
                    <h4>{t(period === 'upcoming' ? 'eventsDatesPending' : 'eventsNoPast')}</h4>
                    <p>
                      {t(period === 'upcoming' ? 'eventsDatesPendingText' : 'eventsNoPastText')}
                    </p>
                  </div>
                )}
              </section>
            );
          })}
        </div>

        <aside className="events-recordings">
          <FaBible aria-hidden="true" />
          <div>
            <h3>{t('eventsRecordings')}</h3>
            <p>{t('eventsRecordingsText')}</p>
          </div>
          <Link href={`/${locale}/sermons`}>{t('eventsWatch')}</Link>
        </aside>
      </div>
    </section>
  );
}
