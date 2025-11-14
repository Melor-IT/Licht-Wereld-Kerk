import HomePage from '../components/HomePage';

const metadataByLang = {
  fa: {
    title: 'کلیسای ایرانی نور جهان | المیره',
    description:
      'کلیسای ایرانی نور جهان در المیره — مکانی برای عبادت، دعا و رشد روحانی در حضور عیسی مسیح.',
    keywords: [
      'کلیسای ایرانی',
      'نور جهان',
      'کلیسای مسیحی',
      'المیره',
      'پرستش',
      'دعا',
      'عیسی مسیح',
    ],
    openGraph: {
      title: 'کلیسای ایرانی نور جهان',
      description:
        'به کلیسای ایرانی نور جهان در المیره خوش آمدید — مکانی برای پرستش و خدمت به جلال نام عیسی مسیح.',
      url: 'https://lichtwereld.com',
      siteName: 'Iranian Church of Light of the World',
      locale: 'fa_IR',
      type: 'website',
      images: [
        {
          url: '/images/home-banner.jpeg',
          width: 1200,
          height: 630,
          alt: 'کلیسای ایرانی نور جهان در المیره',
        },
      ],
    },
  },

  en: {
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
      url: 'https://lichtwereld.com',
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
  },

  nl: {
    title: 'Iraanse Kerk Licht van de Wereld | Almere',
    description:
      'De Iraanse Kerk Licht van de Wereld in Almere — een plaats voor aanbidding, gebed en geestelijke groei in de aanwezigheid van Jezus Christus.',
    keywords: [
      'Iraanse kerk',
      'Licht van de Wereld',
      'Christelijke kerk',
      'Almere',
      'aanbidding',
      'gebed',
      'Jezus Christus',
    ],
    openGraph: {
      title: 'Iraanse Kerk Licht van de Wereld',
      description:
        'Welkom bij de Iraanse Kerk Licht van de Wereld in Almere — een plaats van aanbidding en dienst tot eer van Jezus Christus.',
      url: 'https://lichtwereld.com',
      siteName: 'Iraanse Kerk Licht van de Wereld',
      locale: 'nl_NL',
      type: 'website',
      images: [
        {
          url: '/images/home-banner.jpeg',
          width: 1200,
          height: 630,
          alt: 'Iraanse Kerk Licht van de Wereld in Almere',
        },
      ],
    },
  },
};

// ---- Next.js 13+ Metadata Dynamic Function ---- //
export function generateMetadata({ params }) {
  const lang = params.lang || 'en';
  return metadataByLang[lang] ?? metadataByLang.en;
}

export default function Page() {
  return <HomePage />;
}
