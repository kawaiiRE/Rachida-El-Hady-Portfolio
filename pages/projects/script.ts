import { defineComponent, ref, onMounted, nextTick } from 'vue'
import { PROJECTS } from '~/constants/projects'

export default defineComponent({
  name: 'ProjectsPage',
  setup() {
    const projects = PROJECTS

    // Store refs to the gallery containers
    const galleryRefs = ref<Record<string, HTMLElement | null>>({})

    // Track scroll state for each gallery
    const scrollState = ref<Record<string, { start: boolean; end: boolean }>>({})

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

    onMounted(async () => {
      await nextTick()
      // Initialize scroll states
      projects.forEach((p) => {
        // Default assuming they can scroll right if content overflow
        scrollState.value[p.id] = { start: true, end: false }
        checkScrollState(p.id)
      })

      window.addEventListener('resize', () => {
        projects.forEach((p) => checkScrollState(p.id))
      })
    })

    return {
      projects,
      setGalleryRef,
      handleScroll,
      scrollGallery,
      canScrollLeft,
      canScrollRight,
    }
  },
})
