import { computed, defineComponent, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { PROJECTS, type ProjectLink } from '~/constants/projects'

type RevertibleMatchMedia = {
  revert: () => void
}

export default defineComponent({
  name: 'ProjectsPage',
  props: {},
  emits: [],
  setup() {
    // -------------------- Composables --------------------
    const runtimeConfig = useRuntimeConfig()
    const siteUrl = String(runtimeConfig.public.siteUrl || 'https://rachida.dev').replace(/\/$/, '')

    usePageSeo({
      title: 'Independent Web and Mobile Products',
      description:
        'Explore independent web and mobile products by Rachida El Hady, including TrackPal, Crazy Sudoku, Nuxt, Vue, React Native, TypeScript, and WebGL work.',
      path: '/projects',
      image: PROJECTS[0]?.bgImg,
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Independent Web and Mobile Products',
        url: `${siteUrl}/projects`,
        description:
          'Selected independent web and mobile products designed and engineered by Rachida El Hady.',
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: PROJECTS.map((project, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: project.title,
            url: `${siteUrl}${project.path}`,
          })),
        },
      },
    })

    // -------------------- State --------------------
    const projects = PROJECTS
    const activeProjectIndex = ref(0)
    const projectsPageRef = ref<HTMLElement | null>(null)
    const isDesktopViewport = ref(false)
    let scrollMatchMedia: RevertibleMatchMedia | null = null
    let viewportQuery: MediaQueryList | null = null
    let mobileRevealObserver: IntersectionObserver | null = null
    let responsiveBehaviorId = 0

    // -------------------- Computed --------------------
    const activeProject = computed(() => projects[activeProjectIndex.value] ?? projects[0]!)
    const activeProjectIndexLabel = computed(() => formatProjectIndex(activeProjectIndex.value))
    const activeProjectLinks = computed<ProjectLink[]>(() =>
      activeProject.value.links.filter((link) => Boolean(link.url)),
    )
    const activeProjectStack = computed(() => activeProject.value.stack.slice(0, 4))
    const projectCountLabel = computed(() => String(projects.length).padStart(2, '0'))

    // -------------------- Methods --------------------
    function formatProjectIndex(index: number): string {
      return String(index + 1).padStart(2, '0')
    }

    function setActiveProject(index: number): void {
      if (index < 0 || index >= projects.length || index === activeProjectIndex.value) {
        return
      }

      activeProjectIndex.value = index
    }

    async function createScrollNavigation(): Promise<void> {
      if (!projectsPageRef.value || !isDesktopViewport.value) {
        return
      }

      const behaviorId = responsiveBehaviorId

      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])

      if (
        behaviorId !== responsiveBehaviorId ||
        !projectsPageRef.value ||
        !isDesktopViewport.value
      ) {
        return
      }

      gsap.registerPlugin(ScrollTrigger)
      const matchMedia = gsap.matchMedia()
      scrollMatchMedia = matchMedia

      matchMedia.add('(min-width: 56.0625rem)', () => {
        const projectItems = gsap.utils.toArray<HTMLElement>('.item', projectsPageRef.value)

        projectItems.forEach((projectItem, index) => {
          ScrollTrigger.create({
            trigger: projectItem,
            start: 'top 58%',
            end: 'bottom 42%',
            onEnter: () => setActiveProject(index),
            onEnterBack: () => setActiveProject(index),
          })
        })
      })
    }

    function destroyScrollNavigation(): void {
      scrollMatchMedia?.revert()
      scrollMatchMedia = null
    }

    function createMobileReveals(): void {
      if (!projectsPageRef.value || isDesktopViewport.value) {
        return
      }

      const projectItems = Array.from(projectsPageRef.value.querySelectorAll<HTMLElement>('.item'))

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        projectItems.forEach((projectItem) => projectItem.classList.add('item--visible'))
        return
      }

      mobileRevealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return
            }

            const projectItem = entry.target as HTMLElement
            projectItem.classList.add('item--visible')
            mobileRevealObserver?.unobserve(projectItem)
          })
        },
        { rootMargin: '0px 0px -12% 0px', threshold: 0.14 },
      )

      projectItems.forEach((projectItem) => {
        projectItem.classList.add('item--reveal')
        mobileRevealObserver?.observe(projectItem)
      })
    }

    function destroyMobileReveals(): void {
      mobileRevealObserver?.disconnect()
      mobileRevealObserver = null
      projectsPageRef.value?.querySelectorAll<HTMLElement>('.item').forEach((projectItem) => {
        projectItem.classList.remove('item--reveal', 'item--visible')
      })
    }

    function setupResponsiveBehavior(): void {
      responsiveBehaviorId += 1
      destroyScrollNavigation()
      destroyMobileReveals()
      isDesktopViewport.value = Boolean(viewportQuery?.matches)

      void nextTick(() => {
        if (isDesktopViewport.value) {
          void createScrollNavigation()
          return
        }

        createMobileReveals()
      })
    }

    // -------------------- Lifecycle --------------------
    onMounted(() => {
      viewportQuery = window.matchMedia('(min-width: 56.0625rem)')
      viewportQuery.addEventListener('change', setupResponsiveBehavior)
      setupResponsiveBehavior()
    })

    onBeforeUnmount(() => {
      responsiveBehaviorId += 1
      destroyScrollNavigation()
      destroyMobileReveals()
      viewportQuery?.removeEventListener('change', setupResponsiveBehavior)
    })

    return {
      projects,
      projectsPageRef,
      isDesktopViewport,
      activeProject,
      activeProjectIndex,
      activeProjectIndexLabel,
      activeProjectLinks,
      activeProjectStack,
      projectCountLabel,
      formatProjectIndex,
      setActiveProject,
    }
  },
})
