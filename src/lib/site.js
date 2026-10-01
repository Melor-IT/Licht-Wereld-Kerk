import en from '../../messages/en.json';
import fa from '../../messages/fa.json';
import nl from '../../messages/nl.json';

export const messages = { en, fa, nl };
export const locales = Object.keys(messages);
export const defaultLocale = 'nl';
const supportedRoutes = ['', 'about-us', 'our-vision', 'ANBI-information', 'event'];
export const routes = process.env.NEXT_PUBLIC_EVENT_REGISTRATION_ENABLED === 'true'
  ? supportedRoutes
  : supportedRoutes.filter((route) => route !== 'event');
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://lichtwereld.com').replace(/\/$/, '');

export const pathFor = (locale, slug = '') => `/${locale}${slug ? `/${slug}` : ''}`;

export const alternatesFor = (slug = '') => ({
  en: pathFor('en', slug),
  fa: pathFor('fa', slug),
  nl: pathFor('nl', slug),
  'x-default': pathFor(defaultLocale, slug)
});

const pageLabels = {
  '': 'home',
  'about-us': 'aboutUs',
  'our-vision': 'ourVision',
  'ANBI-information': 'ANBIinformation',
  event: 'event'
};

const descriptions = {
  '': 'ourMissionText',
  'about-us': 'aboutUsSectionText',
  'our-vision': 'ourVisionText',
  'ANBI-information': 'introText',
  event: 'eventText'
};

const images = {
  '': '/images/home-banner.jpeg',
  'about-us': '/images/about-us-banner.jpg',
  'our-vision': '/images/ourvision-banner.jpg',
  'ANBI-information': '/images/ANBI-banner.jpg',
  event: '/images/event-banner.jpg'
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
