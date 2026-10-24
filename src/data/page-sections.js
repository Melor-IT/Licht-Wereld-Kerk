// Message descriptors and content for the sections composed by locale routes.
export const homeHero = {
  className: 'banner',
  backgroundImage: '/images/home-banner.jpeg',
  eyebrow: {
    id: 'welcomeTo',
    defaultMessage: 'Welcome to'
  },
  title: {
    id: 'lightWorld',
    defaultMessage: 'Light of the World Church'
  }
};

export const homeMission = {
  id: 'ourMissionText',
  defaultMessage:
    'Inspired by the gospel of Jesus Christ, we come together and grow in a community of love, hope and service to one another. We warmly invite you to join us as we seek to be a blessing to the wider community.'
};

export const homeServices = [
  {
    title: {
      id: 'firstService',
      defaultMessage: 'Our faith grows as we come together.'
    },
    description: {
      id: 'firstServiceText',
      defaultMessage:
        'We put our faith, hope and love into practice by helping those in need, fighting poverty and supporting refugees.'
    },
    image: '/images/firstService.jpg',
    imageAlt: { id: 'firstServiceImageAlt' },
    imageClassName: 'sw'
  },
  {
    title: {
      id: 'secondService',
      defaultMessage: 'Rooted in the past, looking to the future.'
    },
    description: {
      id: 'secondServiceText',
      defaultMessage:
        'We preserve the church’s valued traditions while welcoming fresh, creative ways to share in fellowship and worship, responding to the needs of today and tomorrow.'
    },
    image: '/images/secondService.jpg',
    imageAlt: { id: 'secondServiceImageAlt' },
    imageClassName: ''
  },
  {
    title: {
      id: 'thirdService',
      defaultMessage: 'God’s love inspires us to serve.'
    },
    description: {
      id: 'thirdServiceText',
      defaultMessage:
        'We support one another with love, compassion and hope. Motivated by God’s love and welcoming everyone, we do all we can to be a blessing to our city and community.'
    },
    image: '/images/thirdService.jpg',
    imageAlt: { id: 'thirdServiceImageAlt' },
    imageClassName: 'ne'
  }
];

export const homeAbout = {
  title: {
    id: 'aboutUs',
    defaultMessage: 'About us'
  },
  description: {
    id: 'aboutUsSectionText',
    defaultMessage:
      'The leadership team at Light of the World Church consists of caring, dedicated pastors and ministry workers. Through prayer and spiritual guidance, they support members as they grow in faith and serve others. Our goal is to create a warm, encouraging environment where everyone can deepen their relationship with God and bear fruit in life and ministry.'
  },
  button: {
    id: 'more',
    defaultMessage: 'Learn more'
  }
};

export const aboutHero = {
  backgroundImage: '/images/about-us-banner.jpg',
  backgroundClassName: 'aboutus',
  title: {
    id: 'aboutUs',
    defaultMessage: 'About us'
  },
  intro: {
    id: 'aboutUsTitle',
    defaultMessage:
      'Let your light shine before others, so they may see your good deeds and glorify your Father in heaven.'
  },
  reference: {
    id: 'aboutUsondertext',
    defaultMessage: 'Matthew 5:16'
  }
};

export const teamIntro = {
  title: { id: 'KazemTeamTitle' },
  role: { id: 'KazemTeamRole' },
  description: [
    { id: 'KazemFaithJourney' },
    { id: 'KazemFormation' },
    { id: 'KazemMinistry' },
    { id: 'KazemMission' },
    { id: 'KazemFamilyMinistry' }
  ],
  image: '/images/kazem.jpg',
  imageAlt: { id: 'KazemFaribaImageAlt' }
};

export const hamidTeamIntro = {
  variant: 'primary',
  reverse: true,
  title: { id: 'HamidTeamTitle' },
  role: { id: 'HamidTeamRole' },
  description: [
    { id: 'HamidFaithJourney' },
    { id: 'HamidCommitment' },
    { id: 'HamidBaptism' },
    { id: 'HamidMinistry' }
  ],
  image: '/images/HamidandSima.jpg',
  imageAlt: { id: 'HamidSimaImageAlt' },
  imageWidth: 4080,
  imageHeight: 3072
};

export const shahramTeamIntro = {
  title: { id: 'ShahramTeamTitle' },
  role: { id: 'ShahramTeamRole' },
  description: [
    { id: 'ShahramTestimonyDream' },
    { id: 'ShahramTestimonyReading' },
    { id: 'ShahramTestimonyFaith' },
    { id: 'ShahramTestimonyInvitation' }
  ],
  image: '/images/shahram.png',
  imageAlt: { id: 'ShahramImageAlt' },
  imageWidth: 1086,
  imageHeight: 1448
};

export const anbiHero = {
  backgroundImage: '/images/ANBI-banner.jpg',
  backgroundClassName: 'ANBIinformation',
  title: {
    id: 'beleidsplanTitle',
    defaultMessage: 'Church policy plan'
  }
};

export const anbiSections = [
  {
    description: {
      id: 'introText',
      defaultMessage:
        'Light of the World is a young, vibrant Christian church whose members come from a range of nationalities, cultures and Christian traditions. We help those exploring faith become committed followers of Jesus Christ and support believers as they grow in fellowship with one another and in a living relationship with him.'
    },
    descriptionClassName: 'anbi-intro',
    variant: 'primary'
  },
  {
    title: {
      id: 'goalsTitle',
      defaultMessage: 'Goals'
    },
    items: [
      {
        id: 'goal1',
        defaultMessage:
          'Helping Farsi speakers in the Netherlands and abroad learn about the Christian faith and take part in church life.'
      },
      {
        id: 'goal2',
        defaultMessage:
          'Supporting believers as they grow in their personal relationship with Jesus Christ.'
      },
      {
        id: 'goal3',
        defaultMessage:
          'Offering spiritual, educational and social activities for children, young people and adults.'
      },
      {
        id: 'goal4',
        defaultMessage:
          'Helping people with practical challenges in daily life, including support for refugees and asylum seekers.'
      },
      {
        id: 'goal5',
        defaultMessage: 'Sharing the gospel through events, media and personal conversations.'
      }
    ],
    variant: 'secondary'
  },
  {
    title: {
      id: 'activitiesTitle',
      defaultMessage: 'Activities'
    },
    items: [
      {
        id: 'activity1',
        defaultMessage:
          'Services: Weekly worship services in Almere and online, with clear biblical teaching and opportunities for fellowship.'
      },
      {
        id: 'activity2',
        defaultMessage:
          'Children’s programmes: Helping children follow Jesus and grow in faith in a loving environment.'
      },
      {
        id: 'activity3',
        defaultMessage:
          'Small groups: Meeting during the week to get to know Jesus better and follow him in daily life.'
      },
      {
        id: 'activity4',
        defaultMessage:
          'Courses: Practical Bible study courses to deepen our understanding of God’s Word.'
      },
      {
        id: 'activity5',
        defaultMessage:
          'Support for refugees and asylum seekers: Helping Farsi speakers in the Netherlands take part in society, with guidance on culture, integration and naturalisation.'
      }
    ],
    variant: 'primary',
    textBlock: false
  },
  {
    title: {
      id: 'structureTitle',
      defaultMessage: 'Organisational structure'
    },
    items: [
      [
        {
          id: 'Voorganger',
          defaultMessage: 'Pastor'
        },
        {
          id: 'Kazem',
          defaultMessage: 'Kazem Dehghani'
        }
      ],
      [
        {
          id: 'Secretariaat',
          defaultMessage: 'Secretary'
        },
        {
          id: 'Hamid',
          defaultMessage: 'Hamid Ghanbari'
        }
      ],
      [
        {
          id: 'Penningmeester',
          defaultMessage: 'Treasurer'
        },
        {
          id: 'Fariba',
          defaultMessage: 'Fariba Dehghani'
        }
      ],
      [
        {
          id: 'Vertegenwoordiger',
          defaultMessage: 'Representative'
        },
        {
          id: 'Sima',
          defaultMessage: 'Sima Sasanfar'
        }
      ],
      {
        id: 'organisatiestructuu',
        defaultMessage:
          'Volunteers: Supporting church activities and providing a safe, welcoming environment for members.'
      }
    ],
    variant: 'secondary',
    textBlock: false
  },
  {
    title: {
      id: 'financeTitle',
      defaultMessage: 'Financial policy'
    },
    items: [
      {
        id: 'finance1',
        defaultMessage:
          'The church is funded through gifts, voluntary contributions and other lawful sources.'
      },
      {
        id: 'finance2',
        defaultMessage: 'Funds are used solely to further the church’s purposes.'
      },
      {
        id: 'finance3',
        defaultMessage:
          'The church provides an annual financial report and maintains transparent accounts in accordance with ANBI guidelines.'
      }
    ],
    variant: 'primary',
    textBlock: false
  },
  {
    title: {
      id: 'futureTitle',
      defaultMessage: 'Evaluation and future plans'
    },
    description: {
      id: 'futureText',
      defaultMessage:
        'The policy plan is reviewed annually and updated as needed. The church seeks to develop its spiritual and social ministry sustainably, helping Farsi speakers experience how knowing and following God can transform their lives.'
    },
    variant: 'secondary',
    textBlock: false
  }
];

export const eventHero = {
  backgroundImage: '/images/home-banner.jpeg',
  className: 'events-hero',
  titleId: 'events-title',
  eyebrow: { id: 'eventsEyebrow' },
  title: {
    id: 'event',
    defaultMessage: 'Events'
  },
  intro: {
    id: 'eventsIntro'
  },
  action: {
    message: { id: 'eventsBrowse' },
    href: '#event-schedule'
  }
};

export const sermonsHero = {
  className: 'sermons-hero',
  backgroundImage: '/images/home-banner.jpeg',
  title: {
    id: 'sermons'
  },
  titleId: 'sermons-title',
  eyebrow: {
    id: 'sermonsEyebrow'
  },
  intro: {
    id: 'sermonsIntro'
  },
  action: {
    message: {
      id: 'sermonsBrowse'
    },
    href: '#sermon-library'
  }
};
