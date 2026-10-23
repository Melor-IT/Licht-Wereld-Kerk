import Hero from '../../../components/system/Hero';
import ContactSection from '../../../components/system/ContactSection';
import { pageMetadata } from '../../../lib/site';

export async function generateMetadata({ params }) {
  return pageMetadata((await params).locale, 'contact');
}

export default function Page() {
  return (
    <div className="page contact-page">
      <Hero backgroundImage="/images/about-us-banner.jpg" titleId="contact-page-title"
        title={{ id: 'contactPageTitle' }} intro={{ id: 'contactIntro' }} />
      <ContactSection />
    </div>
  );
}
