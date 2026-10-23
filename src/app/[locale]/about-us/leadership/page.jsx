import Hero from '../../../../components/system/Hero';
import ContentSection from '../../../../components/system/ContentSection';
import TeamIntro from '../../../../components/system/TeamIntro';
import ChurchNavigation from '../../../../components/system/ChurchNavigation';
import { teamIntro, hamidTeamIntro } from '../../../../data/page-sections';
import { churchLeadershipHero } from '../../../../data/about-sections';
import { pageMetadata } from '../../../../lib/site';

export async function generateMetadata({ params }) {
  return pageMetadata((await params).locale, 'about-us/leadership');
}

export default async function Page({ params }) {
  const { locale } = await params;

  return (
    <div className="page leadership">
      <Hero {...churchLeadershipHero} />
      <ChurchNavigation locale={locale} currentRoute="about-us/leadership" />
      <ContentSection description={{ id: 'aboutUsSectionText' }} />
      <TeamIntro {...teamIntro} />
      <TeamIntro {...hamidTeamIntro} />
    </div>
  );
}
