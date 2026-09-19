import { onBeforeUnmount, onMounted, type Ref } from 'vue'
import { MOTION } from '~/constants/motion'

/** Owns the section headline entrance; content remains visible before hydration. */
export function useHeadlineMotion(root: Ref<HTMLElement | null>): void {
  let media: ReturnType<(typeof import('gsap'))['gsap']['matchMedia']> | undefined
  let revealed = false
  let disposed = false

  onMounted(async () => {
    const [{ gsap }, { ScrollTrigger }] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ])
    if (disposed || !root.value) return

    gsap.registerPlugin(ScrollTrigger)
    const heading = root.value.querySelector('h2')
    if (!heading) return

    media = gsap.matchMedia()
    media.add(MOTION.enabled, () => {
      if (revealed) return
      gsap.from(heading.querySelectorAll('.reveal'), {
        yPercent: 110,
        duration: MOTION.headline,
        stagger: MOTION.stagger,
        ease: MOTION.ease,
        clearProps: 'transform',
        onStart: () => {
          revealed = true
        },
        scrollTrigger: { trigger: heading, start: 'top 88%', once: true },
      })
    })
  })

  onBeforeUnmount(() => {
    disposed = true
    media?.revert()
  })
}
