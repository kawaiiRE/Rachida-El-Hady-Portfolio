import { computed, defineComponent, ref } from 'vue'
import { PROJECTS, type ProjectLink } from '~/constants/projects'

export default defineComponent({
  name: 'ProjectsPage',
  props: {},
  emits: [],
  setup() {
    // -------------------- Composables --------------------
    const runtimeConfig = useRuntimeConfig()
    const siteUrl = String(runtimeConfig.public.siteUrl || 'https://rachida.dev').replace(/\/$/, '')

    usePageSeo({
      title: 'Web and Mobile Development Projects',
      description:
        'Explore production web and mobile projects by Rachida El Hady, including Nuxt, Vue, React Native, Expo, TypeScript, WebGL, and full-stack applications.',
      path: '/projects',
      image: PROJECTS[0]?.bgImg,
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Web and Mobile Development Projects',
        url: `${siteUrl}/projects`,
        description:
          'Selected web and mobile software projects designed and engineered by Rachida El Hady.',
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

    return {
      projects,
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
