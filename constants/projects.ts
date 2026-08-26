export interface PortfolioProject {
  id: string
  title: string
  category: string
  summary: string
  description: string
  path: string
  platform?: 'Web' | 'Mobile'
  stack?: string[]
  imageAlt?: string
  logo?: string
  logoAlt?: string
  images?: string[]
  bgImg?: string
  background?: string
  metrics?: Array<{ value: string; label: string }>
  links?: Array<{ id: string; label: string; url: string }>
  platforms?: PortfolioProject[]
  separatePlatformsInCarousel?: boolean
}

export const AURAFLOW_PROJECT: PortfolioProject = {
  id: 'auraflow',
  title: 'Auraflow',
  category: 'Creative Web App',
  summary:
    'An interactive WebGL wallpaper studio for creating fluid art, marbled ink, silk trails, auroras, nebulae, and organic blooms in the browser.',
  description:
    'Auraflow is a Nuxt and Vue creative tool for making interactive WebGL wallpapers. It ships with fluid ink, ink marbling, reaction bloom, neon silk, aurora field, and nebula forge modes, with mode-specific controls, local preset storage, responsive wallpaper sizing, and direct PNG exports for the screen you use.',
  stack: ['Nuxt', 'Vue', 'TypeScript', 'Pinia', 'WebGL', 'Canvas', 'SCSS', 'Vitest'],
  imageAlt: 'Auraflow interactive fluid wallpaper preview.',
  logo: '/images/projects/auraflow/auraflow-logo.png',
  logoAlt: 'Auraflow swirl logo.',
  images: [
    '/images/projects/auraflow/auraflow-prev-1-fluid-ink.png',
    '/images/projects/auraflow/auraflow-prev-2-ink-marbling.png',
    '/images/projects/auraflow/auraflow-prev-3-reaction-bloom.png',
    '/images/projects/auraflow/auraflow-prev-4-neon-silk.png',
    '/images/projects/auraflow/auraflow-prev-5-aurora-field.png',
    '/images/projects/auraflow/auraflow-prev-6-nebula-forge.png',
  ],
  bgImg: '/images/projects/auraflow/auraflow-bg.png',
  background: 'linear-gradient(90deg, #ff8fbd, #83e6ff, #b69cff, #ffd59e, #ff8fbd)',
  metrics: [
    {
      value: '6',
      label: 'Interactive wallpaper modes',
    },
    {
      value: 'PNG',
      label: 'Custom wallpaper exports',
    },
  ],
  links: [
    {
      id: 'website',
      label: 'Visit Website',
      url: 'https://auraflow.rachida.dev/',
    },
  ],
  path: '/projects/auraflow',
}

export const CRAZY_SUDOKU_PROJECT: PortfolioProject = {
  id: 'crazy-sudoku',
  title: 'Crazy Sudoku',
  category: 'Mobile App + Marketing Website',
  summary:
    'A colorful Sudoku app and playful demo site for puzzle modes, rules, mini games, and a clear Google Play path.',
  description:
    'Crazy Sudoku combines a React Native and Expo mobile puzzle app with a responsive Nuxt marketing and demo site. The app includes classic Sudoku, greater-than clues, division twists, circles mode, achievements, coins, mini games, ads, and in-app payments, while the website supports discovery with animated bubbles, mini game previews, rule explanations, SEO metadata, and a direct Google Play path.',
  stack: [
    'React Native',
    'Expo',
    'Nuxt',
    'Vue',
    'TypeScript',
    'Pinia',
    'Vuestic UI',
    'React Native Paper',
    'Google Mobile Ads',
    'RevenueCat',
    'SEO',
  ],
  imageAlt: 'Crazy Sudoku app and demo site preview.',
  logo: '/images/projects/crazy-sudoku/crazy-sudoku-logo.png',
  logoAlt: 'Crazy Sudoku logo.',
  images: [
    '/images/projects/crazy-sudoku/crazy-sudoku-prev-1.jpg',
    '/images/projects/crazy-sudoku/crazy-sudoku-prev-2.png',
    '/images/projects/crazy-sudoku/crazy-sudoku-prev-3.png',
    '/images/projects/crazy-sudoku/crazy-sudoku-prev-4.jpg',
    '/images/projects/crazy-sudoku/crazy-sudoku-prev-5.png',
    '/images/projects/crazy-sudoku-web/crazy-sudoku-web-prev-1.png',
    '/images/projects/crazy-sudoku-web/crazy-sudoku-web-prev-2.png',
    '/images/projects/crazy-sudoku-web/crazy-sudoku-web-prev-3.png',
    '/images/projects/crazy-sudoku-web/crazy-sudoku-web-prev-4.png',
    '/images/projects/crazy-sudoku-web/crazy-sudoku-web-prev-5.png',
  ],
  bgImg: '/images/projects/crazy-sudoku/crazy-sudoku-bg.png',
  background: 'linear-gradient(90deg, #61c5ff, #61c5ff, #ff78a5, #ff78a5, #61c5ff)',
  metrics: [
    {
      value: '900+',
      label: 'Downloads',
    },
    {
      value: 'Live',
      label: 'Demo and marketing site',
    },
  ],
  links: [
    {
      id: 'website',
      label: 'Visit Website',
      url: 'https://crazysudoku.rachida.dev',
    },
    {
      id: 'google-play',
      label: 'View on Google Play',
      url: 'https://play.google.com/store/apps/details?id=com.kawaiire.crazysudoku',
    },
  ],
  path: '/projects/crazy-sudoku',
}

export const TRACKPAL_PROJECT = {
  id: 'trackpal',
  title: 'TrackPal',
  category: 'Web + Mobile App',
  summary:
    'A connected personal finance system for planning on the web and keeping up with money on the go.',
  description:
    'TrackPal brings a Nuxt web workspace and an Expo mobile app into one finance product. Both platforms share the same Fastify, Drizzle, and Postgres foundation for transactions, recurring schedules, forecasts, insights, receipts, and subscriptions, while each interface is shaped for its own context.',
  path: '/projects/trackpal',
  platforms: [
    {
      id: 'trackpal-web',
      platform: 'Web',
      title: 'TrackPal Web',
      category: 'Web App',
      summary:
        'A personal finance dashboard for tracking cash flow, forecasting balances, and turning daily spending into a clearer plan.',
      description:
        'TrackPal Web is a Nuxt and Vue finance workspace with transaction management, recurring schedules, receipt uploads, forecast charts, insights, exports, and subscription-aware Pro areas. It connects to a Fastify API backed by Drizzle and Postgres, with Pinia for app state, Vuestic UI for the interface, Chart.js for analytics, and RevenueCat for subscriptions.',
      path: '/projects/trackpal',
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
        { value: 'Nuxt', label: 'Responsive finance dashboard' },
        { value: 'API', label: 'Forecasts, exports, receipts' },
      ],
      links: [
        {
          id: 'website',
          label: 'Visit Website',
          url: 'https://trackpal.rachida.dev',
        },
      ],
    },
    {
      id: 'trackpal-mobile',
      platform: 'Mobile',
      title: 'TrackPal Mobile',
      category: 'Mobile App',
      summary:
        'A companion finance app built for quick transaction capture, planning, and spending awareness on the go.',
      description:
        'TrackPal Mobile is an Expo and React Native app for tracking transactions, reviewing forecasts, checking insights, planning recurring payments, and syncing receipt images with the TrackPal API. It uses Expo Router, MobX, React Native Paper, local storage, image picking, RevenueCat purchases, and the same finance data model as the web app.',
      path: '/projects/trackpal',
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
        { value: 'Expo', label: 'Native mobile experience' },
        { value: 'Sync', label: 'Offline capture and receipts' },
      ],
      links: [
        {
          id: 'google-play',
          label: 'View on Google Play',
          url: 'https://play.google.com/store/apps/details?id=dev.rachida.trackpal',
        },
      ],
    },
  ],
  separatePlatformsInCarousel: true,
} satisfies PortfolioProject

export const NOTIFY_PROJECT: PortfolioProject = {
  id: 'notify',
  title: 'Notify',
  category: 'Mobile App + Marketing Website',
  summary:
    'A calm reminder app for everyday tasks, routines, follow-ups, and important alerts, paired with a focused Nuxt marketing site.',
  description:
    'Notify is an Expo and React Native reminder app built around reliable device-first alerts, quick repeat setup, snooze options, pinned and sticky reminders, categories, priorities, history, backup import/export, and Android notification setup checks. Its Nuxt marketing site presents the reminder workflow, privacy policy, SEO metadata, robots, sitemap, and a clean download path for the app listing.',
  stack: [
    'Expo',
    'React Native',
    'TypeScript',
    'Expo Notifications',
    'React Native Paper',
    'Day.js',
    'Nuxt',
    'Vue',
    'Pinia',
    'Vuestic UI',
  ],
  imageAlt: 'Notify smart reminders app store feature graphic.',
  logo: '/images/projects/notify/notify-logo.png',
  logoAlt: 'Notify bell logo.',
  images: [
    '/images/projects/notify/notify-prev-1-upcoming-reminders.png',
    '/images/projects/notify/notify-prev-2-new-reminder.png',
    '/images/projects/notify/notify-prev-3-history-export.png',
  ],
  bgImg: '/images/projects/notify/notify-bg.png',
  background: 'linear-gradient(90deg, #2f7d56, #5d8d6a, #ffba45, #f3efe4, #2f7d56)',
  metrics: [
    {
      value: 'Expo',
      label: 'Device-first reminder alerts',
    },
    {
      value: 'Nuxt',
      label: 'Marketing and privacy site',
    },
  ],
  links: [
    {
      id: 'website',
      label: 'Visit Website',
      url: 'https://notify.rachida.dev/',
    },
  ],
  path: '/projects/notify',
}

export const WHISPER_PROJECT: PortfolioProject = {
  id: 'whisper',
  title: 'Whisper',
  category: 'Website',
  summary:
    'A secure encrypted chat website for private conversations, friend codes, calls, and shared listening moments.',
  description:
    'Whisper is a secure encrypted chat website with email or username sign-in, friend-code discovery, chat threads, unread and typing states, media attachments, voice notes, call history, voice and video calling, listen-together sessions, and privacy-focused account settings backed by Firebase.',
  stack: [
    'Nuxt',
    'Vue',
    'TypeScript',
    'Pinia',
    'Vuestic UI',
    'Firebase',
    'Firestore',
    'WebRTC',
    'CryptoJS',
  ],
  imageAlt: 'Whisper secure encrypted chat website icon preview.',
  logo: '/images/projects/whisper/whisper-logo.png',
  logoAlt: 'Whisper W logo.',
  images: ['/images/projects/whisper/whisper-prev-1.png'],
  bgImg: '/images/projects/whisper/whisper-bg.png',
  background: 'linear-gradient(90deg, #5b20f3, #8b5cf6, #ffc52a, #5b20f3)',
  metrics: [
    {
      value: 'Secure',
      label: 'Encrypted private chat',
    },
    {
      value: 'Live',
      label: 'Chat, calls, and friends site',
    },
  ],
  links: [
    {
      id: 'website',
      label: 'Visit Website',
      url: 'https://whisper.rachida.dev',
    },
  ],
  path: '/projects/whisper',
}

export const PLAYQUEST_PROJECT: PortfolioProject = {
  id: 'playquest',
  title: 'PlayQuest',
  category: 'Browser Puzzle Arcade',
  summary:
    'A growing browser arcade for number codes, word guesses, Hangman, equation puzzles, ciphers, memory rounds, and pattern solving.',
  description:
    'PlayQuest is a Nuxt and Vue puzzle arcade with standalone pages for Numbers, Words, Hangman, Bulls & Cows, Math Wordle, Anagram Rush, Memory Keys, Sequence Solver, Cipher Decode, Higher/Lower Code, and Operator Guess. It uses reusable game boards, keyboards, settings panels, round history, Pinia-backed stats, SEO metadata, robots and sitemap routes, and the wordlist-english dictionary for word-based games.',
  stack: [
    'Nuxt',
    'Vue',
    'TypeScript',
    'Pinia',
    'Vuestic UI',
    'wordlist-english',
    'SCSS',
    'Vitest',
    'SEO',
  ],
  imageAlt: 'PlayQuest browser puzzle arcade preview.',
  logo: '/images/projects/playquest/playquest-logo.svg',
  logoAlt: 'PlayQuest Q-shaped play logo.',
  images: [
    '/images/projects/playquest/playquest-prev-1-arcade.png',
    '/images/projects/playquest/playquest-prev-2-numbers.png',
    '/images/projects/playquest/playquest-prev-3-words.png',
    '/images/projects/playquest/playquest-prev-4-hangman.png',
    '/images/projects/playquest/playquest-prev-5-math-wordle.png',
    '/images/projects/playquest/playquest-prev-6-sequence-solver.png',
  ],
  bgImg: '/images/projects/playquest/playquest-bg.svg',
  background: 'linear-gradient(90deg, #f2b134, #ef4f63, #7c55d8, #176bff, #f2b134)',
  metrics: [
    {
      value: '11',
      label: 'Playable puzzle modes',
    },
    {
      value: 'Nuxt',
      label: 'Responsive browser arcade',
    },
  ],
  links: [
    {
      id: 'website',
      label: 'Visit Website',
      url: 'https://playquest.rachida.dev',
    },
  ],
  path: '/projects/playquest',
}

export const PROJECTS: PortfolioProject[] = [
  TRACKPAL_PROJECT,
  CRAZY_SUDOKU_PROJECT,
  AURAFLOW_PROJECT,
  NOTIFY_PROJECT,
  PLAYQUEST_PROJECT,
  // WHISPER_PROJECT,
]
