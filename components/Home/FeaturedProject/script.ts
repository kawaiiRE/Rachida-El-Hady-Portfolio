import { defineComponent, onBeforeUnmount, onMounted, shallowRef } from 'vue'
import { TRACKPAL_PROJECT } from '~/constants/projects'
import { MOTION } from '~/constants/motion'

export default defineComponent({
  name: 'FeaturedProject',
  setup() {
    // -------------------- Composables --------------------
    const sectionRef = shallowRef<HTMLElement | null>(null)
    useHeadlineMotion(sectionRef)
    // -------------------- State --------------------
    const project = TRACKPAL_PROJECT
    const images = [
      {
        src: project.images[0],
        width: 1894,
        height: 956,
        alt: 'TrackPal web dashboard with cash flow forecasts',
      },
      {
        src: project.images[1],
        width: 500,
        height: 1024,
        alt: 'TrackPal mobile dashboard with cash flow insights',
      },
    ]
    let media: ReturnType<(typeof import('gsap'))['gsap']['matchMedia']> | undefined
    let disposed = false
    let entered = false

    // -------------------- Computed --------------------
    const metrics = project.metrics.slice(0, 2)
    const technologies = project.stack.slice(0, 6)

    // -------------------- Methods --------------------
    // -------------------- Lifecycle --------------------
    onMounted(async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])
      if (disposed || !sectionRef.value) return
      gsap.registerPlugin(ScrollTrigger)
      const visual = sectionRef.value.querySelector('.visual')
      if (!visual) return

      media = gsap.matchMedia()
      media.add(
        { desktop: MOTION.desktop, enabled: MOTION.enabled, reduced: MOTION.reduced },
        (context) => {
          if (context.conditions?.reduced) return
          const desktop = context.conditions?.desktop
          if (!entered) {
            gsap.from(visual.querySelectorAll('.media'), {
              opacity: 0,
              y: desktop ? '2rem' : 0,
              rotation: desktop ? (index: number) => (index === 0 ? -2 : 2) : 0,
              scale: desktop ? 0.97 : 1,
              duration: MOTION.showcase,
              stagger: MOTION.stagger,
              ease: MOTION.ease,
              clearProps: 'opacity,transform',
              onStart: () => {
                entered = true
              },
              scrollTrigger: { trigger: visual, start: 'top 85%', once: true },
            })
          }
          if (desktop) {
            gsap.to(visual.querySelectorAll('.depth'), {
              y: (index: number) => (index === 0 ? '-0.75rem' : '-1.5rem'),
              ease: 'none',
              scrollTrigger: {
                trigger: visual,
                start: 'center center',
                end: 'bottom top',
                scrub: 0.6,
                invalidateOnRefresh: true,
              },
            })
          }
        },
      )
    })

    onBeforeUnmount(() => {
      disposed = true
      media?.revert()
    })

    return { sectionRef, project, images, metrics, technologies }
  },
})
