import { defineComponent, ref } from 'vue'
import { PROJECTS } from '~/constants/projects'
import { APP_ROUTES } from '~/constants/routes'
import { SITE_IDENTITY } from '~/constants/site'

export default defineComponent({
  name: 'ProjectDetailPage',
  setup() {
    // -------------------- Composables --------------------
    const route = useRoute()
    const siteUrl = String(useRuntimeConfig().public.siteUrl || SITE_IDENTITY.url).replace(
      /\/$/,
      '',
    )

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
          '@type': 'WebPage',
          '@id': `${canonicalUrl}#webpage`,
          name: `${project.title} — A project by ${SITE_IDENTITY.name}`,
          url: canonicalUrl,
          description: project.summary,
          inLanguage: 'en',
          isPartOf: { '@id': `${siteUrl}/#website` },
          about: { '@id': `${siteUrl}/#person` },
          mainEntity: { '@id': `${canonicalUrl}#application` },
          breadcrumb: { '@id': `${canonicalUrl}#breadcrumb` },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          '@id': `${canonicalUrl}#application`,
          name: project.title,
          url: canonicalUrl,
          description: project.description,
          applicationCategory: project.category,
          image: (project.images ?? []).map((image) => new URL(image, siteUrl).href),
          mainEntityOfPage: { '@id': `${canonicalUrl}#webpage` },
          author: {
            '@type': 'Person',
            '@id': `${siteUrl}/#person`,
            name: 'Rachida El Hady',
            alternateName: SITE_IDENTITY.shortName,
            sameAs: [...SITE_IDENTITY.profiles],
            url: siteUrl,
          },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          '@id': `${canonicalUrl}#breadcrumb`,
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
