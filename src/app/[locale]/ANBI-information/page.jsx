import Hero from '../../../components/system/Hero';
import ContentSection from '../../../components/system/ContentSection';
import { anbiHero, anbiSections } from '../../../data/page-sections';
import { pageMetadata } from '../../../lib/site';

export async function generateMetadata({ params }) {
  return pageMetadata((await params).locale, 'ANBI-information');
}

export default function Page() {
  return (
    <div className="page ANBI-Information">
      <Hero {...anbiHero} />
      {anbiSections.map((section) => (
        <ContentSection key={section.title?.id || section.description.id} {...section} />
      ))}
    </div>
  );
}
