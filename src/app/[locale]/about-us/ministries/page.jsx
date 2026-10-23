import Hero from '../../../../components/system/Hero';
import ContentSection from '../../../../components/system/ContentSection';
import ChurchNavigation from '../../../../components/system/ChurchNavigation';
import { churchMinistriesHero, churchMinistrySections } from '../../../../data/about-sections';
import { pageMetadata } from '../../../../lib/site';

export async function generateMetadata({ params }) {
  return pageMetadata((await params).locale, 'about-us/ministries');
}

export default async function Page({ params }) {
  const { locale } = await params;

  return (
    <div className="page ministries">
      <Hero {...churchMinistriesHero} />
      <ChurchNavigation locale={locale} currentRoute="about-us/ministries" />
      {churchMinistrySections.map((section) => (
        <ContentSection key={section.title.id} {...section} />
      ))}
    </div>
  );
}
