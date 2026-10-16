import Hero from '../../../components/system/Hero';
import EventRegistrationSection from '../../../components/system/EventRegistrationSection';
import EventSchedule from '../../../components/system/EventSchedule';
import { eventHero } from '../../../data/page-sections';
import events from '../../../data/events.json';
import weeklyEvents from '../../../data/weekly-events.json';
import { getEventSchedule } from '../../../lib/events';
import { pageMetadata } from '../../../lib/site';

const enabled = process.env.NEXT_PUBLIC_EVENT_REGISTRATION_ENABLED === 'true';
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  return pageMetadata((await params).locale, 'event');
}

export default function Page() {
  const schedule = getEventSchedule(events, new Date(), weeklyEvents);

  return (
    <div className="page events-page">
      <Hero {...eventHero} />
      <EventSchedule {...schedule} />
      {enabled && <EventRegistrationSection enabled />}
    </div>
  );
}
