import { computed, defineComponent } from 'vue'
import { PROJECTS } from '~/constants/projects'
import { APP_ROUTES } from '~/constants/routes'

export default defineComponent({
  name: 'ProjectDetailPage',
  setup() {
    const route = useRoute()
    const runtimeConfig = useRuntimeConfig()
    const siteUrl = String(runtimeConfig.public.siteUrl || 'https://rachida.dev').replace(/\/$/, '')
    const slug = String(route.params.slug || '')
    const projectIndex = PROJECTS.findIndex((candidate) => candidate.id === slug)
    const project = PROJECTS[projectIndex]

    if (!project) {
      throw createError({ statusCode: 404, statusMessage: 'Project not found' })
    }

    const formatIndex = (index: number) => String(index + 1).padStart(2, '0')
    const getGalleryItemSize = (index: number) => ['wide', 'compact', 'full'][index % 3]
    const projectLinks = computed(() => project.links.filter((link) => link.url))
    const relatedProjects = computed(() => {
      const followingProjects = [
        ...PROJECTS.slice(projectIndex + 1),
        ...PROJECTS.slice(0, projectIndex),
      ]

      return followingProjects.slice(0, 3)
    })
    const projectIndexLabel = formatIndex(projectIndex)
    const projectCountLabel = String(PROJECTS.length).padStart(2, '0')
    const technologyCountLabel = `${String(project.stack.length).padStart(2, '0')} tools`
    const galleryCountLabel = `${String(project.images.length).padStart(2, '0')} views`
    const canonicalUrl = `${siteUrl}${project.path}`
    const operatingSystem = project.stack.some((technology) =>
      ['Expo', 'React Native'].includes(technology),
    )
      ? 'Android, iOS'
      : 'Web Browser'

    usePageSeo({
      title: `${project.title} — ${project.category} Case Study`,
      description: project.summary,
      path: project.path,
      image: project.bgImg,
      structuredData: [
        {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: project.title,
          url: canonicalUrl,
          description: project.description,
          applicationCategory: project.category,
          operatingSystem,
          image: project.images.map((image) => `${siteUrl}${image}`),
          author: {
            '@type': 'Person',
            '@id': `${siteUrl}/#person`,
            name: 'Rachida El Hady',
            url: siteUrl,
          },
          keywords: project.stack.join(', '),
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Projects', item: `${siteUrl}/projects` },
            { '@type': 'ListItem', position: 3, name: project.title, item: canonicalUrl },
          ],
        },
      ],
    })

    return {
      APP_ROUTES,
      project,
      projectLinks,
      relatedProjects,
      projectIndexLabel,
      projectCountLabel,
      technologyCountLabel,
      galleryCountLabel,
      formatIndex,
      getGalleryItemSize,
    }
  },
})
