import Hero from '../../components/system/Hero';
import ServicesSection from '../../components/system/ServicesSection';
import AboutSection from '../../components/system/AboutSection';
import { homeHero, homeMission, homeServices, homeAbout } from '../../data/page-sections';
import { pageMetadata, pathFor } from '../../lib/site';

export async function generateMetadata({ params }) {
  return pageMetadata((await params).locale);
}

export default async function Page({ params }) {
  const { locale } = await params;

  return (
    <div className="page home">
      <Hero {...homeHero} />
      <ServicesSection description={homeMission} items={homeServices} />
      <AboutSection {...homeAbout} href={pathFor(locale, 'about-us')} />
    </div>
  );
}
