export interface EngineeringPrinciple {
  id: string
  title: string
  description: string
  signal: string
}

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
