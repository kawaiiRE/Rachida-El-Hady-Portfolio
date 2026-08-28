import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import { PROJECTS } from '~/constants/projects'

type RevertibleMatchMedia = {
  revert: () => void
}

export default defineComponent({
  name: 'HomePage',
  props: {},
  emits: [],
  setup() {
    // -------------------- Composables --------------------
    const runtimeConfig = useRuntimeConfig()
    const siteUrl = String(runtimeConfig.public.siteUrl || 'https://rachida.dev').replace(/\/$/, '')
    const personId = `${siteUrl}/#person`

    usePageSeo({
      title: 'Rachida El Hady | Frontend Engineer',
      description:
        'Frontend engineer Rachida El Hady builds production React, Vue, Nuxt, TypeScript, and React Native products with scalable architecture, polished interfaces, and reliable delivery.',
      path: '/',
      type: 'profile',
      structuredData: [
        {
          '@context': 'https://schema.org',
          '@type': 'ProfilePage',
          url: siteUrl,
          name: 'Rachida El Hady — Frontend Engineer',
          mainEntity: {
            '@type': 'Person',
            '@id': personId,
            name: 'Rachida El Hady',
            url: siteUrl,
            jobTitle: 'Front-End Developer',
            description:
              'Frontend engineer building production web and mobile products with React, Vue, Nuxt, React Native, and TypeScript.',
            knowsAbout: [
              'Frontend engineering',
              'React.js',
              'Next.js',
              'Nuxt',
              'Vue.js',
              'React Native',
              'Expo',
              'TypeScript',
              'WebGL',
              'Frontend architecture',
              'Technical leadership',
              'Code reviews',
              'Developer mentorship',
              'Mobile application development',
            ],
            alumniOf: {
              '@type': 'CollegeOrUniversity',
              name: 'Lebanese University',
            },
          },
          hasPart: {
            '@type': 'ItemList',
            name: 'Selected software projects',
            itemListElement: PROJECTS.map((project, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: project.title,
              url: `${siteUrl}${project.path}`,
            })),
          },
        },
      ],
    })

    // -------------------- State --------------------
    const homePageRef = ref<HTMLElement | null>(null)
    let motionMatchMedia: RevertibleMatchMedia | null = null

    // -------------------- Computed --------------------
    // -------------------- Methods --------------------
    const createSectionMotion = async (): Promise<void> => {
      if (!homePageRef.value) {
        return
      }

      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])

      if (!homePageRef.value) {
        return
      }

      const homePageElement = homePageRef.value

      gsap.registerPlugin(ScrollTrigger)
      const matchMedia = gsap.matchMedia()
      motionMatchMedia = matchMedia

      matchMedia.add('(prefers-reduced-motion: no-preference)', () => {
        const context = gsap.context(() => {
          const motionElements = gsap.utils.toArray<HTMLElement>('[data-motion]', homePageElement)

          motionElements.forEach((element) => {
            const isLargeMedia = element.classList.contains('visual')

            gsap.from(element, {
              opacity: 0,
              y: isLargeMedia ? 0 : 24,
              scale: isLargeMedia ? 1.025 : 1,
              clipPath: isLargeMedia ? 'inset(7% 0 7% 0)' : 'inset(0 0 0 0)',
              duration: isLargeMedia ? 1.05 : 0.76,
              ease: 'power3.out',
              clearProps: 'opacity,transform,clipPath',
              scrollTrigger: {
                trigger: element,
                start: 'top 88%',
                once: true,
              },
            })
          })
        }, homePageElement)

        return () => context.revert()
      })
    }

    const destroySectionMotion = (): void => {
      motionMatchMedia?.revert()
      motionMatchMedia = null
    }

    // -------------------- Lifecycle --------------------
    onMounted(() => {
      void createSectionMotion()
    })

    onBeforeUnmount(() => {
      destroySectionMotion()
    })

    return {
      homePageRef,
    }
  },
})
