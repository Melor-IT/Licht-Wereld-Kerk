import HomePage from '../components/HomePage';

export const metadata = {
  title: 'Iranian Church of Light of the World | Almere',
  description:
    'The Iranian Church of Light of the World in Almere — a place for worship, prayer, and spiritual growth in the presence of Jesus Christ.',
  keywords: [
    'Iranian church',
    'Light of the World',
    'Christian church',
    'Almere',
    'worship',
    'prayer',
    'Jesus Christ',
  ],
  openGraph: {
    title: 'Iranian Church of Light of the World',
    description:
      'Welcome to the Iranian Church of Light of the World in Almere — a place for worship and service to the glory of Jesus Christ.',
    url: 'https://lichtwereld.nl',
    siteName: 'Iranian Church of Light of the World',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/home-banner.jpeg',
        width: 1200,
        height: 630,
        alt: 'Iranian Church of Light of the World in Almere',
      },
    ],
  },
};

export default function Page() {
  return <HomePage />;
}
