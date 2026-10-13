import SermonsPage from '../../../components/SermonsPage';
import { getSermons } from '../../../lib/sermons';
import { pageMetadata } from '../../../lib/site';

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  return pageMetadata((await params).locale, 'sermons');
}

export default async function Page() {
  const { sermons, unavailable } = await getSermons();
  return <SermonsPage sermons={sermons} unavailable={unavailable} />;
}
