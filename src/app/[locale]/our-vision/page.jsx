import Hero from '../../../components/system/Hero';
import ContentSection from '../../../components/system/ContentSection';
import { visionHero, visionSections } from '../../../data/page-sections';
import { pageMetadata } from '../../../lib/site';

export async function generateMetadata({ params }) {
  return pageMetadata((await params).locale, 'our-vision');
}

export default function Page() {
  return (
    <div className="page our-vision">
      <Hero {...visionHero} />
      {visionSections.map((section) => (
        <ContentSection key={section.title.id} {...section} />
      ))}
    </div>
  );
}
