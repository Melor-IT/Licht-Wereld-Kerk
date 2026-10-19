import Hero from '../../../components/system/Hero';
import EventRegistrationSection from '../../../components/system/EventRegistrationSection';
import EventSchedule from '../../../components/system/EventSchedule';
import { eventHero } from '../../../data/page-sections';
import events from '../../../data/events.json';
import weeklyEvents from '../../../data/weekly-events.json';
import preacherRotation from '../../../data/preacher-rotation.json';
import { getEventDate } from '../../../lib/events';
import { pageMetadata } from '../../../lib/site';

const enabled = process.env.NEXT_PUBLIC_EVENT_REGISTRATION_ENABLED === 'true';
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  return pageMetadata((await params).locale, 'event');
}

export default function Page() {
  const initialDate = getEventDate();

  return (
    <div className="page events-page">
      <Hero {...eventHero} />
      <EventSchedule events={events} weeklyEvents={weeklyEvents} rotation={preacherRotation} initialDate={initialDate} />
      {enabled && <EventRegistrationSection enabled />}
    </div>
  );
}
