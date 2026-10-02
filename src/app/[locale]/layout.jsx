import { notFound } from 'next/navigation';
import '../../components-CSS/globals.css';
import SiteShell from '../../components/SiteShell';
import { locales, messages, siteUrl } from '../../lib/site';

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Church',
  name: 'Kerk Licht van de Wereld',
  url: siteUrl,
  logo: `${siteUrl}/images/licht-wereld-logo.png`,
  email: 'lichtwereldkerk2022@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Hildo Kropstraat 8',
    postalCode: '1328 BC',
    addressLocality: 'Almere',
    addressCountry: 'NL'
  },
  sameAs: [
    'https://www.youtube.com/@LichtWereldKerk',
    'https://www.instagram.com/noorejahan_farsi_church'
  ]
};

export const metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: 'Licht van de Wereld',
  robots: { index: true, follow: true }
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  if (!locales.includes(locale)) notFound();
  const direction = locale === 'fa' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={direction}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema).replace(/</g, '\\u003c')
          }}
        />
        <SiteShell locale={locale} messages={messages[locale]}>
          {children}
        </SiteShell>
      </body>
    </html>
  );
}
