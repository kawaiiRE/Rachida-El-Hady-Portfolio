export interface ProjectMetric {
  value: string
  label: string
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
  link: string
  path: string
  linkLabel: string
}

const CRAZY_SUDOKU_BG = '/images/projects/crazy-sudoku/crazy-sudoku-bg.png'
const CRAZY_SUDOKU_LOGO = '/images/projects/crazy-sudoku/crazy-sudoku-logo.png'

const CRAZY_SUDOKU_IMAGES = [
  '/images/projects/crazy-sudoku/crazy-sudoku-prev-1.jpg',
  '/images/projects/crazy-sudoku/crazy-sudoku-prev-2.png',
  '/images/projects/crazy-sudoku/crazy-sudoku-prev-3.png',
  '/images/projects/crazy-sudoku/crazy-sudoku-prev-4.jpg',
  '/images/projects/crazy-sudoku/crazy-sudoku-prev-5.png',
]

export const PROJECTS: PortfolioProject[] = [
  {
    id: 'crazy-sudoku',
    title: 'Crazy Sudoku',
    category: 'Mobile App',
    summary: 'A fun and challenging Sudoku experience built for mobile puzzle sessions.',
    description:
      'A mobile app developed using React Native, Expo, and Git. Integrated ads and in-app payments for a fun and challenging Sudoku experience.',
    stack: ['React Native', 'Expo', 'Git', 'Ads', 'In-app Payments'],
    imageAlt: 'Crazy Sudoku app preview.',
    logo: CRAZY_SUDOKU_LOGO,
    logoAlt: 'Crazy Sudoku logo.',
    images: CRAZY_SUDOKU_IMAGES,
    bgImg: CRAZY_SUDOKU_BG,
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
    link: 'https://play.google.com/store/apps/details?id=com.kawaiire.crazysudoku',
    path: '/projects/crazySudoku',
    linkLabel: 'View on Google Play',
  },
]
