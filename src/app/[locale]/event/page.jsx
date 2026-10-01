import EventPage from '../../../components/EventPage';
import { pageMetadata } from '../../../lib/site';

export async function generateMetadata({ params }) {
  const metadata = pageMetadata((await params).locale, 'event');
  const enabled = process.env.NEXT_PUBLIC_EVENT_REGISTRATION_ENABLED === 'true';
  return enabled ? metadata : { ...metadata, robots: { index: false, follow: false } };
}

export default function Page() {
  return <EventPage />;
}
