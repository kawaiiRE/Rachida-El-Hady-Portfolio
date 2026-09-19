export const MOTION = {
  feedback: 0.18,
  carousel: 0.4,
  headline: 0.7,
  stagger: 0.09,
  showcase: 1,
  ease: 'power3.out',
  reduced: '(prefers-reduced-motion: reduce)',
  enabled: '(prefers-reduced-motion: no-preference)',
  desktop: '(min-width: 56.001rem) and (hover: hover) and (pointer: fine)',
} as const

export const MOTION_STYLE = {
  '--motion-feedback': `${MOTION.feedback}s`,
  '--motion-carousel': `${MOTION.carousel}s`,
  '--motion-ease': 'cubic-bezier(0.16, 1, 0.3, 1)',
}
