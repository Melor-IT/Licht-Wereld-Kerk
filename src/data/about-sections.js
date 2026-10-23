// Shared structure for the church introduction in all three languages.
const message = (id) => ({ id });
const paragraphs = (prefix, count) =>
  Array.from({ length: count }, (_, index) => message(`${prefix}${index + 1}`));
const labelledItems = (prefix, names) =>
  names.map((name) => ({
    title: message(`${prefix}${name}Title`),
    description: message(`${prefix}${name}Text`)
  }));

export const aboutChurchHero = {
  titleId: 'about-church-title',
  backgroundImage: '/images/about-us-banner.jpg',
  backgroundClassName: 'aboutus',
  title: message('aboutChurchHeading'),
  eyebrow: message('aboutChurchLocation'),
  intro: message('aboutChurchVerse'),
  reference: message('aboutChurchVerseReference')
};

export const aboutChurchSections = [
  {
    kind: 'identity',
    title: message('aboutIdentityTitle'),
    description: [message('aboutIdentity1'), message('aboutIdentityFamily')]
  },
  {
    kind: 'history',
    title: message('aboutHistoryTitle'),
    description: paragraphs('aboutHistory', 2),
    quote: {
      text: message('aboutHistoryQuote'),
      reference: message('aboutHistoryReference')
    },
    after: [message('aboutHistory3')]
  },
  {
    kind: 'vision',
    title: message('aboutVisionTitle'),
    description: paragraphs('aboutVision', 3)
  },
  {
    kind: 'mission',
    title: message('aboutMissionTitle'),
    description: paragraphs('aboutMission', 2),
    items: labelledItems('aboutMission', [
      'Gospel',
      'Bible',
      'Worship',
      'Discipleship',
      'Unity',
      'Service'
    ])
  },
  {
    kind: 'values',
    title: message('aboutValuesTitle'),
    items: labelledItems('aboutValue', [
      'Faith',
      'Love',
      'Transformation',
      'Prayer',
      'Family',
      'Responsibility'
    ])
  },
  {
    kind: 'activities',
    title: message('aboutActivitiesTitle'),
    subsections: [
      ['Sunday', 2],
      ['Children', 1],
      ['Groups', 1],
      ['Courses', 1],
      ['Refugees', 3],
      ['Media', 1]
    ].map(([name, count]) => ({
      title: message(`aboutActivity${name}Title`),
      description: paragraphs(`aboutActivity${name}`, count)
    }))
  },
  {
    kind: 'community',
    title: message('aboutCommunityTitle'),
    description: paragraphs('aboutCommunity', 2),
    ordered: true,
    items: paragraphs('aboutCommunitySphere', 7),
    after: [message('aboutCommunity3')]
  },
  {
    kind: 'welcome',
    title: message('aboutWelcomeTitle'),
    description: [message('aboutWelcome1')],
    quote: { text: message('aboutWelcomeTagline') }
  }
].map((section, index) => ({
  ...section,
  variant: index % 2 === 0 ? 'primary' : 'secondary'
}));

export const churchPages = [
  { slug: 'about-us', title: message('aboutUs') },
  { slug: 'about-us/ministries', title: message('churchMinistriesTitle') },
  { slug: 'about-us/leadership', title: message('churchLeadershipTitle') }
];

const selectSections = (kinds) => kinds.map((kind, index) => ({
  ...aboutChurchSections.find((section) => section.kind === kind),
  variant: index % 2 === 0 ? 'primary' : 'secondary'
}));

export const aboutOverviewSections = [
  ...selectSections(['identity', 'history', 'vision', 'mission', 'values']).map((section) => {
    if (section.kind === 'vision') return { ...section, after: [message('aboutVisionCalling')] };
    if (section.kind === 'mission') return { ...section, after: [message('aboutWorshipPractice')] };
    if (section.kind === 'values') return {
      ...section,
      quote: { text: message('aboutValuesVerse'), reference: message('aboutValuesVerseReference') }
    };
    return section;
  }),
  {
    title: message('godsTempleTitle'),
    description: message('godsTempleText'),
    variant: 'secondary'
  },
  {
    ...aboutChurchSections.find((section) => section.kind === 'welcome'),
    variant: 'primary',
    action: { slug: 'contact', message: message('aboutContactButton') }
  }
];

export const churchMinistrySections = selectSections(['activities', 'community']);

export const churchMinistriesHero = {
  ...aboutChurchHero,
  titleId: 'church-ministries-title',
  title: message('churchMinistriesTitle')
};

export const churchLeadershipHero = {
  ...aboutChurchHero,
  titleId: 'church-leadership-title',
  title: message('churchLeadershipTitle')
};
