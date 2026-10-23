import Hero from '../../../components/system/Hero';
import ContentSection from '../../../components/system/ContentSection';
import ChurchNavigation from '../../../components/system/ChurchNavigation';
import { aboutChurchHero, aboutOverviewSections } from '../../../data/about-sections';
import { pageMetadata } from '../../../lib/site';

export async function generateMetadata({ params }) {
  return pageMetadata((await params).locale, 'about-us');
}

export default async function Page({ params }) {
  const { locale } = await params;
  return (
    <div className="page about-us">
      <Hero {...aboutChurchHero} />
      <ChurchNavigation locale={locale} currentRoute="about-us" />
      {aboutOverviewSections.map((section) => (
        <ContentSection key={section.title.id} {...section} />
      ))}
    </div>
  );
}
