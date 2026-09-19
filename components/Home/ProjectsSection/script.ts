import { computed, defineComponent, ref, shallowRef } from 'vue'
import { PROJECTS, type PortfolioProject } from '~/constants/projects'

type ProjectCardState =
  | 'is-active'
  | 'is-prev-1'
  | 'is-next-1'
  | 'is-prev-2'
  | 'is-next-2'
  | 'is-prev-3'
  | 'is-next-3'
  | 'is-hidden'

interface ProjectCarouselItem {
  project: PortfolioProject
  state: ProjectCardState
}

const CARD_STATE_BY_DIFF: Record<string, ProjectCardState> = {
  '-3': 'is-prev-3',
  '-2': 'is-prev-2',
  '-1': 'is-prev-1',
  '0': 'is-active',
  '1': 'is-next-1',
  '2': 'is-next-2',
  '3': 'is-next-3',
}

const PREVIEW_STACK_LIMIT = 4
const DRAG_CAPTURE_THRESHOLD = 6

export default defineComponent({
  name: 'ProjectsSection',
  props: {},
  emits: [],
  setup() {
    // -------------------- Composables --------------------
    const sectionRef = shallowRef<HTMLElement | null>(null)
    useHeadlineMotion(sectionRef)
    // -------------------- State --------------------
    const projects = PROJECTS
    const headingWords = 'Ideas I took all the way to working software.'.split(' ')
    const currentIndex = ref(0)
    const previousIndex = ref<number | null>(null)
    const travelDirection = ref(1)
    const carouselRef = ref<HTMLElement | null>(null)
    const dragStartX = ref<number | null>(null)
    let suppressClick = false
    const totalProjects = computed(() => projects.length)

    // -------------------- Computed --------------------
    const currentProject = computed<PortfolioProject | null>(() => {
      return projects[currentIndex.value] ?? null
    })
    const currentPosition = computed(() => String(currentIndex.value + 1).padStart(2, '0'))
    const panelStyle = computed(() => ({ '--panel-offset': `${travelDirection.value}rem` }))

    // -------------------- Methods --------------------
    const normalizeIndex = (index: number): number => {
      if (!totalProjects.value) {
        return 0
      }

      return (index + totalProjects.value) % totalProjects.value
    }

    const getRelativeIndex = (index: number): number => {
      const projectsLength = totalProjects.value

      if (!projectsLength) {
        return 0
      }

      const diff = (index - currentIndex.value + projectsLength) % projectsLength

      return diff > projectsLength / 2 ? diff - projectsLength : diff
    }

    const getCardState = (index: number): ProjectCardState => {
      return CARD_STATE_BY_DIFF[String(getRelativeIndex(index))] ?? 'is-hidden'
    }

    const carouselProjects = computed<ProjectCarouselItem[]>(() => {
      return projects.map((project, index) => ({
        project,
        state: getCardState(index),
      }))
    })

    const updateProject = (index: number, direction: number): void => {
      const nextIndex = normalizeIndex(index)
      if (nextIndex === currentIndex.value) return
      // Keep focus on a stable control before hiding the current card or panel.
      const focused = document.activeElement
      if (
        focused instanceof HTMLElement &&
        (focused.closest('.carousel-card') || focused.closest('.panel')) &&
        sectionRef.value?.contains(focused)
      ) {
        carouselRef.value?.focus({ preventScroll: true })
      }
      previousIndex.value = currentIndex.value
      travelDirection.value = direction < 0 ? -1 : 1
      currentIndex.value = nextIndex
    }

    const selectProject = (index: number): void => {
      const normalizedIndex = normalizeIndex(index)

      if (normalizedIndex === currentIndex.value) {
        const selectedProject = projects[normalizedIndex]

        if (selectedProject) {
          void navigateTo(selectedProject.path)
        }

        return
      }

      updateProject(normalizedIndex, getRelativeIndex(normalizedIndex))
    }

    const shiftProject = (direction: number): void => {
      if (!totalProjects.value) {
        return
      }

      updateProject(currentIndex.value + direction, direction)
    }

    const startDrag = (event: PointerEvent): void => {
      if (!event.isPrimary || event.button !== 0) return
      suppressClick = false
      dragStartX.value = event.clientX
    }

    const trackDrag = (event: PointerEvent): void => {
      if (
        dragStartX.value === null ||
        Math.abs(event.clientX - dragStartX.value) < DRAG_CAPTURE_THRESHOLD
      ) {
        return
      }

      if (!carouselRef.value?.hasPointerCapture(event.pointerId)) {
        carouselRef.value?.setPointerCapture(event.pointerId)
      }
      suppressClick = true
    }

    const cancelDrag = (): void => {
      dragStartX.value = null
      suppressClick = false
    }

    const finishDrag = (event: PointerEvent): void => {
      if (dragStartX.value === null) return
      const distance = event.clientX - dragStartX.value
      dragStartX.value = null
      if (Math.abs(distance) < 42) return
      shiftProject(distance > 0 ? -1 : 1)
    }

    const preventDragClick = (event: MouseEvent): void => {
      if (!suppressClick || event.detail === 0) return
      event.preventDefault()
      event.stopPropagation()
      suppressClick = false
    }

    const getPreviewStack = (project: PortfolioProject): string[] => {
      return project.stack?.slice(0, PREVIEW_STACK_LIMIT) ?? []
    }

    const getProjectPath = (project: PortfolioProject): string => project.path

    // -------------------- Lifecycle --------------------

    return {
      sectionRef,
      projects,
      headingWords,
      currentIndex,
      previousIndex,
      panelStyle,
      preventDragClick,
      carouselProjects,
      carouselRef,
      currentProject,
      currentPosition,
      totalProjects,
      getPreviewStack,
      getProjectPath,
      selectProject,
      shiftProject,
      startDrag,
      trackDrag,
      finishDrag,
      cancelDrag,
    }
  },
})
