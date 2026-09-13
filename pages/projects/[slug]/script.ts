import { defineComponent, ref } from 'vue'
import { PROJECTS } from '~/constants/projects'
import { APP_ROUTES } from '~/constants/routes'

export default defineComponent({
  name: 'ProjectDetailPage',
  setup() {
    // -------------------- Composables --------------------
    const route = useRoute()
    const siteUrl = useRuntimeConfig().public.siteUrl

    // -------------------- State --------------------
    const slug = String(route.params.slug || '')
    const project = PROJECTS.find((candidate) => candidate.id === slug)

    if (!project) {
      throw createError({ statusCode: 404, statusMessage: 'Project not found' })
    }

    const projectIndex = PROJECTS.findIndex((candidate) => candidate.id === project.id)
    const followingProjects = [
      ...PROJECTS.slice(projectIndex + 1),
      ...PROJECTS.slice(0, projectIndex),
    ]
    const relatedProjects = followingProjects.slice(0, 3)
    const technologies = project.stack ?? []
    const galleryCount = project.images?.length ?? 0
    const hasProjectLinks = Boolean(project.links?.length)
    const galleryRef = ref<HTMLElement | null>(null)

    // -------------------- Computed --------------------
    const projectNumber = projectIndex + 1
    const projectCount = PROJECTS.length
    const canonicalUrl = `${siteUrl}${project.path}`

    usePageSeo({
      title: `${project.title} — ${project.category}`,
      description: project.summary,
      path: project.path,
      image: project.images?.[0] ?? '',
      structuredData: [
        {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: project.title,
          url: canonicalUrl,
          description: project.description,
          applicationCategory: project.category,
          author: {
            '@type': 'Person',
            '@id': `${siteUrl}/#person`,
            name: 'Rachida El Hady',
            url: siteUrl,
          },
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

    // -------------------- Methods --------------------
    function scrollGallery(direction: number): void {
      const gallery = galleryRef.value

      if (!gallery || gallery.children.length < 2) {
        return
      }

      const currentSlide = Math.round(gallery.scrollLeft / gallery.clientWidth)
      const nextSlide =
        (currentSlide + direction + gallery.children.length) % gallery.children.length

      gallery.scrollTo({ left: nextSlide * gallery.clientWidth })
    }

    // -------------------- Lifecycle --------------------

    return {
      APP_ROUTES,
      project,
      technologies,
      galleryRef,
      galleryCount,
      hasProjectLinks,
      relatedProjects,
      projectNumber,
      projectCount,
      scrollGallery,
    }
  },
})
