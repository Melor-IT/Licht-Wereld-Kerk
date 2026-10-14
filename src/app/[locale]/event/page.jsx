import Hero from '../../../components/system/Hero';
import EventRegistrationSection from '../../../components/system/EventRegistrationSection';
import { eventHero } from '../../../data/page-sections';
import { pageMetadata } from '../../../lib/site';

const enabled = process.env.NEXT_PUBLIC_EVENT_REGISTRATION_ENABLED === 'true';

export async function generateMetadata({ params }) {
  const metadata = pageMetadata((await params).locale, 'event');
  return enabled ? metadata : { ...metadata, robots: { index: false, follow: false } };
}

export default function Page() {
  return (
    <div className="page event">
      <Hero {...eventHero} />
      <EventRegistrationSection enabled={enabled} />
    </div>
  );
}
