import Hero from '../../../components/system/Hero';
import TeamIntro from '../../../components/system/TeamIntro';
import { aboutHero, teamIntro } from '../../../data/page-sections';
import { pageMetadata } from '../../../lib/site';

export async function generateMetadata({ params }) {
  return pageMetadata((await params).locale, 'about-us');
}

export default function Page() {
  return (
    <div className="page about-us">
      <Hero {...aboutHero} />
      <TeamIntro {...teamIntro} />
    </div>
  );
}
