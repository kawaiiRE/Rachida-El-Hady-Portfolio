import { defineComponent, ref, onBeforeUnmount, onMounted, nextTick } from 'vue'
import { PROJECTS } from '~/constants/projects'
import type { PortfolioProject } from '~/constants/projects'

export default defineComponent({
  name: 'ProjectsPage',
  setup() {
    const projects = PROJECTS

    // Store refs to the gallery containers
    const galleryRefs = ref<Record<string, HTMLElement | null>>({})

    // Track scroll state for each gallery
    const scrollState = ref<Record<string, { start: boolean; end: boolean }>>({})
    let hashScrollFrameId: number | null = null
    let hashScrollTimeoutId: number | null = null

    const setGalleryRef = (el: any, id: string) => {
      if (el) {
        galleryRefs.value[id] = el as HTMLElement
      }
    }

    const checkScrollState = (id: string) => {
      const el = galleryRefs.value[id]
      if (!el) return

      const { scrollLeft, scrollWidth, clientWidth } = el
      scrollState.value[id] = {
        start: scrollLeft <= 0,
        end: Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 1, // -1 for pixel rounding safety
      }
    }

    const handleScroll = (id: string) => {
      checkScrollState(id)
    }

    const scrollGallery = (id: string, direction: -1 | 1) => {
      const el = galleryRefs.value[id]
      if (!el) return

      const scrollAmount = el.clientWidth * 0.8 // Scroll 80% of container width
      el.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' })
    }

    const canScrollLeft = (id: string) => {
      return scrollState.value[id] ? !scrollState.value[id].start : false
    }

    const canScrollRight = (id: string) => {
      return scrollState.value[id] ? !scrollState.value[id].end : true
    }

    const getProjectLinks = (project: PortfolioProject) => {
      return project.links.filter((link) => link.url)
    }

    const initializeScrollStates = () => {
      projects.forEach((project) => {
        scrollState.value[project.id] = { start: true, end: false }
        checkScrollState(project.id)
      })
    }

    const getCurrentHashId = () => {
      if (typeof window === 'undefined') {
        return ''
      }

      return decodeURIComponent(window.location.hash.replace(/^#/, ''))
    }

    const getHashProjectElement = () => {
      const id = getCurrentHashId()

      if (!id || !projects.some((project) => project.id === id)) {
        return null
      }

      return document.getElementById(id)
    }

    const scrollToHashProject = async (behavior: ScrollBehavior = 'auto') => {
      await nextTick()

      const target = getHashProjectElement()

      if (!target) {
        return
      }

      target.scrollIntoView({ block: 'start', behavior })
      checkScrollState(target.id)
    }

    const waitForHashProjectImages = async () => {
      const target = getHashProjectElement()

      if (!target) {
        return
      }

      const images = Array.from(target.querySelectorAll<HTMLImageElement>('img'))
      const pendingImages = images.filter((image) => !image.complete)

      if (!pendingImages.length) {
        return
      }

      await Promise.all(
        pendingImages.map(
          (image) =>
            new Promise<void>((resolve) => {
              image.addEventListener('load', () => resolve(), { once: true })
              image.addEventListener('error', () => resolve(), { once: true })
            }),
        ),
      )
    }

    const clearHashScrollWork = () => {
      if (hashScrollFrameId !== null) {
        window.cancelAnimationFrame(hashScrollFrameId)
        hashScrollFrameId = null
      }

      if (hashScrollTimeoutId !== null) {
        window.clearTimeout(hashScrollTimeoutId)
        hashScrollTimeoutId = null
      }
    }

    const stabilizeHashScroll = async (behavior: ScrollBehavior = 'auto') => {
      if (!getCurrentHashId()) {
        return
      }

      clearHashScrollWork()
      await scrollToHashProject(behavior)

      hashScrollFrameId = window.requestAnimationFrame(() => {
        void scrollToHashProject()
      })

      hashScrollTimeoutId = window.setTimeout(() => {
        void waitForHashProjectImages().then(() => {
          void scrollToHashProject()
        })
      }, 250)
    }

    const handleResize = () => {
      projects.forEach((project) => checkScrollState(project.id))
    }

    const handleHashChange = () => {
      void stabilizeHashScroll('smooth')
    }

    onMounted(async () => {
      await nextTick()
      initializeScrollStates()
      await stabilizeHashScroll()

      window.addEventListener('resize', handleResize)
      window.addEventListener('hashchange', handleHashChange)
    })

    onBeforeUnmount(() => {
      if (typeof window === 'undefined') {
        return
      }

      clearHashScrollWork()
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('hashchange', handleHashChange)
    })

    return {
      projects,
      setGalleryRef,
      handleScroll,
      scrollGallery,
      canScrollLeft,
      canScrollRight,
      getProjectLinks,
    }
  },
})
