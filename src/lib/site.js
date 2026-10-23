import en from '../../messages/en.json';
import fa from '../../messages/fa.json';
import nl from '../../messages/nl.json';

export const messages = { en, fa, nl };
export const locales = Object.keys(messages);
export const defaultLocale = 'nl';
const supportedRoutes = [
  '', 'about-us', 'about-us/ministries', 'about-us/leadership',
  'sermons', 'ANBI-information', 'event', 'contact'
];
export const routes = supportedRoutes;
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://lichtwereld.com').replace(
  /\/$/,
  ''
);

export const pathFor = (locale, slug = '') => `/${locale}${slug ? `/${slug}` : ''}`;

export const alternatesFor = (slug = '') => ({
  en: pathFor('en', slug),
  fa: pathFor('fa', slug),
  nl: pathFor('nl', slug),
  'x-default': pathFor(defaultLocale, slug)
});

const pageLabels = {
  '': 'home',
  'about-us': 'aboutChurchHeading',
  'about-us/ministries': 'churchMinistriesTitle',
  'about-us/leadership': 'churchLeadershipTitle',
  sermons: 'sermons',
  'ANBI-information': 'ANBIinformation',
  event: 'event',
  contact: 'contactPageTitle'
};

const descriptions = {
  '': 'ourMissionText',
  'about-us': 'aboutIdentity1',
  'about-us/ministries': 'aboutCommunity1',
  'about-us/leadership': 'aboutUsSectionText',
  sermons: 'sermonsIntro',
  'ANBI-information': 'introText',
  event: 'eventsIntro',
  contact: 'contactIntro'
};

const images = {
  '': '/images/home-banner.jpeg',
  'about-us': '/images/about-us-banner.jpg',
  'about-us/ministries': '/images/about-us-banner.jpg',
  'about-us/leadership': '/images/about-us-banner.jpg',
  sermons: '/images/home-banner.jpeg',
  'ANBI-information': '/images/ANBI-banner.jpg',
  event: '/images/home-banner.jpeg',
  contact: '/images/about-us-banner.jpg'
};

const homeTitles = {
  en: 'Iranian Church Light of the World | Almere',
  fa: 'کلیسای ایرانی نور جهان | آلمیره',
  nl: 'Iraanse Kerk Licht van de Wereld | Almere'
};

const openGraphLocales = { en: 'en_GB', fa: 'fa_IR', nl: 'nl_NL' };

export function pageMetadata(locale, route = '') {
  if (!locales.includes(locale) || !supportedRoutes.includes(route)) return {};

  const label = messages[locale][pageLabels[route]] || 'Licht van de Wereld';
  const title = route ? `${label} | Licht van de Wereld` : homeTitles[locale];
  const description = String(messages[locale][descriptions[route]] || '').slice(0, 180);
  const path = pathFor(locale, route);

  return {
    title,
    description,
    alternates: { canonical: path, languages: alternatesFor(route) },
    openGraph: {
      title,
      description,
      url: path,
      siteName: 'Kerk Licht van de Wereld',
      locale: openGraphLocales[locale],
      type: 'website',
      images: [{ url: images[route] }]
    },
    twitter: { card: 'summary_large_image', title, description, images: [images[route]] }
  };
}
