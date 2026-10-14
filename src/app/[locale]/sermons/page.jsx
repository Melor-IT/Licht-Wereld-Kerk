import Hero from '../../../components/system/Hero';
import SermonsLibrary from '../../../components/system/SermonsLibrary';
import { sermonsHero } from '../../../data/page-sections';
import { getSermons } from '../../../lib/sermons';
import { pageMetadata } from '../../../lib/site';

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  return pageMetadata((await params).locale, 'sermons');
}

export default async function Page() {
  const { sermons, unavailable } = await getSermons();

  return (
    <div className="page sermons-page">
      <Hero {...sermonsHero} />
      <SermonsLibrary sermons={sermons} unavailable={unavailable} />
    </div>
  );
}
