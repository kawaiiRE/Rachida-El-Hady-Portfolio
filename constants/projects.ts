export interface ProjectMetric {
  value: string
  label: string
}

export interface ProjectLink {
  id: string
  label: string
  url: string
}

export interface PortfolioProject {
  id: string
  title: string
  category: string
  summary: string
  description: string
  stack: string[]
  imageAlt: string
  logo: string
  logoAlt: string
  images: string[]
  bgImg: string
  background: string
  metrics: ProjectMetric[]
  links: ProjectLink[]
  path: string
}

export const PROJECTS: PortfolioProject[] = [
  {
    id: 'crazy-sudoku',
    title: 'Crazy Sudoku',
    category: 'Mobile App',
    summary: 'A fun and challenging Sudoku experience built for mobile puzzle sessions.',
    description:
      'A mobile app developed using React Native, Expo, and Git. Integrated ads and in-app payments for a colorful logic puzzle experience with classic Sudoku, greater-than clues, division twists, circles mode, achievements, coins, and mini games.',
    stack: ['React Native', 'Expo', 'Git', 'Ads', 'In-app Payments'],
    imageAlt: 'Crazy Sudoku app preview.',
    logo: '/images/projects/crazy-sudoku/crazy-sudoku-logo.png',
    logoAlt: 'Crazy Sudoku logo.',
    images: [
      '/images/projects/crazy-sudoku/crazy-sudoku-prev-1.jpg',
      '/images/projects/crazy-sudoku/crazy-sudoku-prev-2.png',
      '/images/projects/crazy-sudoku/crazy-sudoku-prev-3.png',
      '/images/projects/crazy-sudoku/crazy-sudoku-prev-4.jpg',
      '/images/projects/crazy-sudoku/crazy-sudoku-prev-5.png',
    ],
    bgImg: '/images/projects/crazy-sudoku/crazy-sudoku-bg.png',
    background: 'linear-gradient(90deg, #61c5ff, #61c5ff, #ff78a5, #ff78a5, #61c5ff)',
    metrics: [
      {
        value: '900+',
        label: 'Downloads',
      },
      {
        value: '5',
        label: 'App Rating',
      },
    ],
    links: [
      {
        id: 'google-play',
        label: 'View on Google Play',
        url: 'https://play.google.com/store/apps/details?id=com.kawaiire.crazysudoku',
      },
    ],
    path: '/projects#crazy-sudoku',
  },
  {
    id: 'crazy-sudoku-web',
    title: 'Crazy Sudoku Demo Site',
    category: 'Marketing Website',
    summary:
      'A playful marketing and demo site for Crazy Sudoku, with animated bubbles, mini game previews, rules, and a clear Google Play path.',
    description:
      'A responsive marketing website for Crazy Sudoku built around motion, bright game visuals, and quick product understanding. The site supports the main app with SEO metadata, a demo-style puzzle board, mini game previews, rule explanations, and a direct path to the Google Play listing.',
    stack: ['Nuxt', 'Vue', 'TypeScript', 'Vuestic UI', 'SEO', 'Cloudflare'],
    imageAlt: 'Crazy Sudoku demo site themed background.',
    logo: '/images/projects/crazy-sudoku-web/crazy-sudoku-web-logo.png',
    logoAlt: 'Crazy Sudoku demo site logo.',
    images: [
      '/images/projects/crazy-sudoku-web/crazy-sudoku-web-prev-1.png',
      '/images/projects/crazy-sudoku-web/crazy-sudoku-web-prev-2.png',
      '/images/projects/crazy-sudoku-web/crazy-sudoku-web-prev-3.png',
      '/images/projects/crazy-sudoku-web/crazy-sudoku-web-prev-4.png',
      '/images/projects/crazy-sudoku-web/crazy-sudoku-web-prev-5.png',
    ],
    bgImg: '/images/projects/crazy-sudoku-web/crazy-sudoku-web-bg.png',
    background: 'linear-gradient(90deg, #61c5ff, #61c5ff, #ff78a5, #ff78a5, #61c5ff)',
    metrics: [
      {
        value: 'Live',
        label: 'Marketing site',
      },
      {
        value: '3',
        label: 'Puzzle modes previewed',
      },
    ],
    links: [
      {
        id: 'website',
        label: 'Visit Website',
        url: 'https://crazysudoku.rachida.dev',
      },
    ],
    path: '/projects#crazy-sudoku-web',
  },
  // Keeping this combined Crazy Sudoku entry commented out while the website and app are
  // temporarily presented as separate projects. Uncomment it later if they should merge again.
  // {
  //   id: 'crazy-sudoku',
  //   title: 'Crazy Sudoku',
  //   category: 'Mobile App',
  //   summary: 'A fun and challenging Sudoku experience built for mobile puzzle sessions.',
  //   description:
  //     'A mobile app developed using React Native, Expo, and Git. Integrated ads and in-app payments for a fun and challenging Sudoku experience.',
  //   stack: ['React Native', 'Expo', 'Git', 'Ads', 'In-app Payments'],
  //   imageAlt: 'Crazy Sudoku app preview.',
  //   logo: '/images/projects/crazy-sudoku/crazy-sudoku-logo.png',
  //   logoAlt: 'Crazy Sudoku logo.',
  //   images: [
  //     '/images/projects/crazy-sudoku/crazy-sudoku-prev-1.jpg',
  //     '/images/projects/crazy-sudoku/crazy-sudoku-prev-2.png',
  //     '/images/projects/crazy-sudoku/crazy-sudoku-prev-3.png',
  //     '/images/projects/crazy-sudoku/crazy-sudoku-prev-4.jpg',
  //     '/images/projects/crazy-sudoku/crazy-sudoku-prev-5.png',
  //   ],
  //   bgImg: '/images/projects/crazy-sudoku/crazy-sudoku-bg.png',
  //   background: 'linear-gradient(90deg, #61c5ff, #61c5ff, #ff78a5, #ff78a5, #61c5ff)',
  //   metrics: [
  //     {
  //       value: '900+',
  //       label: 'Downloads',
  //     },
  //     {
  //       value: '5',
  //       label: 'App Rating',
  //     },
  //   ],
  //   links: [
  //     {
  //       id: 'website',
  //       label: 'Visit Website',
  //       url: 'https://crazysudoku.rachida.dev',
  //     },
  //     {
  //       id: 'google-play',
  //       label: 'View on Google Play',
  //       url: 'https://play.google.com/store/apps/details?id=com.kawaiire.crazysudoku',
  //     },
  //   ],
  //   path: '/projects#crazy-sudoku',
  // },
  {
    id: 'trackpal-web',
    title: 'TrackPal Web',
    category: 'Web App',
    summary:
      'A personal finance dashboard for tracking cash flow, forecasting balances, and turning daily spending into a clearer plan.',
    description:
      'TrackPal Web is a Nuxt and Vue finance workspace with transaction management, recurring schedules, receipt uploads, forecast charts, insights, exports, and subscription-aware Pro areas. It connects to a Fastify API backed by Drizzle and Postgres, with Pinia for app state, Vuestic UI for the interface, Chart.js for analytics, and RevenueCat for subscriptions.',
    stack: [
      'Nuxt',
      'Vue',
      'TypeScript',
      'Pinia',
      'Vuestic UI',
      'Chart.js',
      'Fastify',
      'Drizzle',
      'Postgres',
      'RevenueCat',
    ],
    imageAlt: 'TrackPal Web finance dashboard themed background.',
    logo: '/images/projects/trackpal-web/trackpal-web-logo.png',
    logoAlt: 'TrackPal Web logo.',
    images: [
      '/images/projects/trackpal-web/trackpal-web-prev-1-dashboard-forecast.png',
      '/images/projects/trackpal-web/trackpal-web-prev-2-dashboard-analytics.png',
      '/images/projects/trackpal-web/trackpal-web-prev-3-transactions.png',
      '/images/projects/trackpal-web/trackpal-web-prev-4-recurring-payments.png',
      '/images/projects/trackpal-web/trackpal-web-prev-5-forecast-patterns.png',
      '/images/projects/trackpal-web/trackpal-web-prev-6-spending-history.png',
    ],
    bgImg: '/images/projects/trackpal-web/trackpal-web-bg.png',
    background: 'linear-gradient(90deg, #00d4a6, #55b7ff, #7c5cff, #00d4a6)',
    metrics: [
      {
        value: 'Nuxt',
        label: 'Responsive finance dashboard',
      },
      {
        value: 'API',
        label: 'Forecasts, exports, receipts',
      },
    ],
    links: [
      {
        id: 'website',
        label: 'Visit Website',
        url: 'https://trackpal.rachida.dev',
      },
    ],
    path: '/projects#trackpal-web',
  },
  {
    id: 'trackpal-mobile',
    title: 'TrackPal Mobile',
    category: 'Mobile App',
    summary:
      'A companion finance app built for quick transaction capture, planning, and spending awareness on the go.',
    description:
      'TrackPal Mobile is an Expo and React Native app for tracking transactions, reviewing forecasts, checking insights, planning recurring payments, and syncing receipt images with the TrackPal API. It uses Expo Router, MobX, React Native Paper, local storage, image picking, RevenueCat purchases, and the same finance data model as the web app.',
    stack: [
      'Expo',
      'React Native',
      'TypeScript',
      'Expo Router',
      'MobX',
      'React Native Paper',
      'AsyncStorage',
      'RevenueCat',
    ],
    imageAlt: 'TrackPal Mobile finance app themed background.',
    logo: '/images/projects/trackpal-mobile/trackpal-mobile-logo.png',
    logoAlt: 'TrackPal Mobile logo.',
    images: [
      '/images/projects/trackpal-mobile/trackpal-mobile-prev-1-dashboard-cash-flow.png',
      '/images/projects/trackpal-mobile/trackpal-mobile-prev-2-dashboard-category-spend.png',
      '/images/projects/trackpal-mobile/trackpal-mobile-prev-3-transactions.png',
      '/images/projects/trackpal-mobile/trackpal-mobile-prev-4-insights-overview.png',
      '/images/projects/trackpal-mobile/trackpal-mobile-prev-5-insights-highlights.png',
    ],
    bgImg: '/images/projects/trackpal-mobile/trackpal-mobile-bg.png',
    background: 'linear-gradient(90deg, #55b7ff, #00d4a6, #ffd166, #55b7ff)',
    metrics: [
      {
        value: 'Expo',
        label: 'Native mobile experience',
      },
      {
        value: 'Sync',
        label: 'Offline capture and receipts',
      },
    ],
    links: [],
    path: '/projects#trackpal-mobile',
  },
]
