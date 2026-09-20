export interface PortfolioProject {
  id: string
  title: string
  category: string
  summary: string
  description: string
  path: string
  stack?: string[]
  imageAlt?: string
  logo?: string
  logoAlt?: string
  images?: string[]
  bgImg?: string
  background?: string
  metrics?: Array<{ value: string; label: string }>
  links?: Array<{ id: string; label: string; url: string }>
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

export const NEXT_TEMPLATE_PROJECT: PortfolioProject = {
  id: 'next-template',
  title: 'Next Template',
  category: 'Next.js + PocketBase Starter',
  summary:
    'A polished, production-minded full-stack foundation with independent frontend and backend repositories, typed boundaries, and recovery-ready deployment.',
  description:
    'Next Template pairs a responsive Next.js and React dashboard shell with a private PocketBase backend through a small versioned HTTP contract. The two templates keep separate histories, dependencies, tests, and deployment rules while working together through same-origin server routes. The reference release includes strict TypeScript, Zod validation, SCSS Modules, accessible desktop and mobile navigation, container isolation, health checks, forward migrations, and verified backup tooling.',
  stack: [
    'Next.js',
    'React',
    'TypeScript',
    'PocketBase',
    'Zod',
    'SCSS Modules',
    'Vitest',
    'Docker',
    'Yarn',
  ],
  imageAlt: 'Next Template responsive Next.js dashboard and PocketBase architecture preview.',
  logo: '/images/projects/next-template/next-template-logo.svg',
  logoAlt: 'Next Template letter N logo.',
  images: ['/images/projects/next-template/next-template-dashboard-e1f6b640.png'],
  bgImg: '/images/projects/next-template/next-template-dashboard-e1f6b640.png',
  background: 'linear-gradient(90deg, #11182b, #5a55e7, #1b9aaa, #11182b)',
  metrics: [
    {
      value: '2 repos',
      label: 'Independent clean codebases',
    },
    {
      value: 'API v1',
      label: 'Typed integration contract',
    },
  ],
  links: [
    {
      id: 'website',
      label: 'Visit Live Demo',
      url: 'https://next-template.rachida.dev',
    },
  ],
  path: '/projects/next-template',
}

export const DESIGN_KERNEL_PROJECT: PortfolioProject = {
  id: 'design-kernel',
  title: 'Design Kernel',
  category: 'Local-first Design System Studio',
  summary:
    'A design-system workbench for shaping coordinated light and dark themes, validating contrast, refining tokens, and exporting production-ready CSS.',
  description:
    'Design Kernel turns a small set of creative foundations into a complete, portable design system. Designers can explore distinct visual presets, tune color, typography, density, roundness, contrast, and elevation, inspect every generated token, preview both themes in a realistic product dashboard, save local snapshots, share versioned configurations, and export deterministic CSS with WCAG AA contrast enforcement.',
  stack: [
    'Nuxt',
    'Vue',
    'TypeScript',
    'Pinia',
    'Vuestic UI',
    'SCSS',
    'LocalStorage',
    'WCAG',
    'Vitest',
  ],
  imageAlt: 'Design Kernel workbench showing live tokens and a product dashboard preview.',
  logo: '/images/projects/design-kernel/design-kernel-logo.svg',
  logoAlt: 'Design Kernel modular frame logo.',
  images: [
    '/images/projects/design-kernel/design-kernel-prev-1-clean-product.png',
    '/images/projects/design-kernel/design-kernel-prev-2-warm-organic.png',
    '/images/projects/design-kernel/design-kernel-prev-3-bold-dark.png',
    '/images/projects/design-kernel/design-kernel-prev-4-css-tokens.png',
  ],
  bgImg: '/images/projects/design-kernel/design-kernel-prev-3-bold-dark.png',
  background: 'linear-gradient(90deg, #2563eb, #6d28d9, #8c88ff, #1b1d22, #2563eb)',
  metrics: [
    {
      value: 'AA',
      label: 'Live contrast enforcement',
    },
    {
      value: 'CSS',
      label: 'Portable design-token exports',
    },
  ],
  links: [
    {
      id: 'website',
      label: 'Visit Website',
      url: 'https://design-kernel.rachida.dev',
    },
  ],
  path: '/projects/design-kernel',
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
      value: '1k+',
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

export const EVERMATH_PROJECT: PortfolioProject = {
  id: 'evermath',
  title: 'Evermath',
  category: 'Adaptive Math Learning Platform',
  summary:
    'An all-ages mathematics platform that turns placement, personal lessons, and daily practice into a learning path that grows with each learner.',
  description:
    'Evermath brings a Nuxt web experience, an offline-capable Expo mobile app, and a versioned Fastify API into one mathematics platform. Learners move through age-aware foundations, school mastery, and adult refreshers with adaptive lessons, daily check-ins, progress tracking, household profiles, competitions, and English, French, and Arabic support.',
  stack: [
    'Nuxt',
    'Vue',
    'TypeScript',
    'Pinia',
    'KaTeX',
    'Expo',
    'React Native',
    'Fastify',
    'Drizzle',
    'Postgres',
  ],
  imageAlt: 'Evermath adaptive mathematics lesson and learning path preview.',
  logo: '/images/projects/evermath/evermath-logo.svg',
  logoAlt: 'Evermath sigma logo.',
  images: [
    '/images/projects/evermath/evermath-prev-1-lesson-hero.png',
    '/images/projects/evermath/evermath-prev-2-learning-paths.png',
    '/images/projects/evermath/evermath-prev-3-daily-practice.png',
  ],
  bgImg: '/images/projects/evermath/evermath-prev-1-lesson-hero.png',
  background: 'linear-gradient(90deg, #5046e5, #d64b68, #d18b16, #078574, #5046e5)',
  metrics: [
    {
      value: 'K–12+',
      label: 'Learning paths for every age',
    },
    {
      value: '3',
      label: 'Supported learning languages',
    },
  ],
  links: [
    {
      id: 'website',
      label: 'Visit Website',
      url: 'https://evermath.rachida.dev',
    },
  ],
  path: '/projects/evermath',
}

export const VERSE_PROJECT: PortfolioProject = {
  id: 'verse',
  title: 'Verse',
  category: 'Local-first Lyrics Rehearsal App',
  summary:
    'A private rehearsal studio for learning lyrics through synced entrances, focused loops, flexible recall modes, and honest memory tracking.',
  description:
    'Verse turns a browser into a private rehearsal room for singers. Musicians can import local audio or use the official YouTube player, synchronize every lyric entrance, isolate difficult sections with precise A/B loops, switch between full, hidden, first-letter, and cloze recall, and build memory through self-rated practice—all without an account or backend.',
  stack: [
    'Nuxt',
    'Vue',
    'TypeScript',
    'Pinia',
    'Vuestic UI',
    'IndexedDB',
    'Web Audio',
    'YouTube IFrame API',
  ],
  imageAlt: 'Verse lyric rehearsal workspace with local audio, timing, and recall practice.',
  logo: '/images/projects/verse/verse-logo.png',
  logoAlt: 'Verse ribbon V logo.',
  images: [
    '/images/projects/verse/verse-prev-1-workspace.png',
    '/images/projects/verse/verse-prev-2-lyric-sync.png',
    '/images/projects/verse/verse-prev-3-recall-practice.png',
    '/images/projects/verse/verse-prev-4-song-library.png',
  ],
  bgImg: '/images/projects/verse/verse-prev-1-workspace.png',
  background: 'linear-gradient(90deg, #0b0a09, #8f5931, #e4a155, #f2eadf, #0b0a09)',
  metrics: [
    {
      value: 'A/B',
      label: 'Precision rehearsal loops',
    },
    {
      value: 'Local',
      label: 'Private, account-free library',
    },
  ],
  links: [
    {
      id: 'website',
      label: 'Visit Website',
      url: 'https://verse.rachida.dev',
    },
  ],
  path: '/projects/verse',
}

export const TRACKPAL_PROJECT = {
  id: 'trackpal',
  title: 'TrackPal',
  category: 'Web + Mobile App',
  summary:
    'A connected personal finance system for planning on the web and keeping up with money on the go.',
  description:
    'TrackPal brings a Nuxt web workspace and an Expo mobile app into one finance product. Both platforms share the same Fastify, Drizzle, and Postgres foundation for transactions, recurring schedules, forecasts, insights, receipts, and subscriptions, while each interface is shaped for its own context.',
  stack: [
    'Nuxt',
    'Vue',
    'TypeScript',
    'Pinia',
    'Vuestic UI',
    'Chart.js',
    'Expo',
    'React Native',
    'Expo Router',
    'MobX',
    'React Native Paper',
    'Fastify',
    'Drizzle',
    'Postgres',
    'RevenueCat',
    'AsyncStorage',
  ],
  imageAlt: 'TrackPal personal finance dashboard across web and mobile.',
  logo: '/images/projects/trackpal-web/trackpal-web-logo.png',
  logoAlt: 'TrackPal logo.',
  images: [
    '/images/projects/trackpal-web/trackpal-web-prev-1-dashboard-forecast.png',
    '/images/projects/trackpal-mobile/trackpal-mobile-prev-1-dashboard-cash-flow.png',
    '/images/projects/trackpal-web/trackpal-web-prev-2-dashboard-analytics.png',
    '/images/projects/trackpal-mobile/trackpal-mobile-prev-2-dashboard-category-spend.png',
    '/images/projects/trackpal-web/trackpal-web-prev-3-transactions.png',
    '/images/projects/trackpal-mobile/trackpal-mobile-prev-3-transactions.png',
    '/images/projects/trackpal-web/trackpal-web-prev-4-recurring-payments.png',
    '/images/projects/trackpal-mobile/trackpal-mobile-prev-4-insights-overview.png',
    '/images/projects/trackpal-web/trackpal-web-prev-5-forecast-patterns.png',
    '/images/projects/trackpal-mobile/trackpal-mobile-prev-5-insights-highlights.png',
    '/images/projects/trackpal-web/trackpal-web-prev-6-spending-history.png',
  ],
  bgImg: '/images/projects/trackpal-web/trackpal-web-bg.png',
  background: 'linear-gradient(90deg, #00d4a6, #55b7ff, #7c5cff, #ffd166, #00d4a6)',
  metrics: [
    { value: 'Web + App', label: 'One connected finance system' },
    { value: 'Sync', label: 'Forecasts, receipts, and insights' },
  ],
  links: [
    {
      id: 'website',
      label: 'Visit Website',
      url: 'https://trackpal.rachida.dev',
    },
    {
      id: 'google-play',
      label: 'View on Google Play',
      url: 'https://play.google.com/store/apps/details?id=dev.rachida.trackpal',
    },
  ],
  path: '/projects/trackpal',
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
  // EVERMATH_PROJECT,
  VERSE_PROJECT,
  AURAFLOW_PROJECT,
  NEXT_TEMPLATE_PROJECT,
  DESIGN_KERNEL_PROJECT,
  NOTIFY_PROJECT,
  PLAYQUEST_PROJECT,
  // WHISPER_PROJECT,
]
