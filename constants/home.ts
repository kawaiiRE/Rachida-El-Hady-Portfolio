export interface ExperienceChapter {
  id: string
  index: string
  title: string
  description: string
  detail: string
}

export interface EngineeringPrinciple {
  id: string
  title: string
  description: string
  signal: string
}

export const EXPERIENCE_CHAPTERS: ExperienceChapter[] = [
  {
    id: 'product-delivery',
    index: '01',
    title: 'Product delivery',
    description: 'Taking ambitious interfaces from a loose brief to a production-ready release.',
    detail: 'Web · Mobile · Responsive systems',
  },
  {
    id: 'technical-direction',
    index: '02',
    title: 'Technical direction',
    description:
      'Turning product requirements into clear architecture, reusable patterns, and focused work.',
    detail: 'Architecture · Planning · Reviews',
  },
  {
    id: 'team-enablement',
    index: '03',
    title: 'Team enablement',
    description:
      'Helping developers understand the system, make confident decisions, and ship independently.',
    detail: 'Mentorship · Standards · Documentation',
  },
]

export const ENGINEERING_PRINCIPLES: EngineeringPrinciple[] = [
  {
    id: 'clarity',
    title: 'Clarity before complexity',
    description:
      'A strong interface begins with an understandable system, not an impressive dependency list.',
    signal: '01 / Structure',
  },
  {
    id: 'motion',
    title: 'Motion with a job',
    description:
      'Animation should explain hierarchy, preserve context, or reward intent—not delay the user.',
    signal: '02 / Direction',
  },
  {
    id: 'resilience',
    title: 'Built for real conditions',
    description:
      'Responsive layouts, accessible controls, reliable states, and graceful fallbacks are core design work.',
    signal: '03 / Reliability',
  },
]
