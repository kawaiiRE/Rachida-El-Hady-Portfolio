import { computed, defineComponent, ref } from 'vue'
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
    // -------------------- State --------------------
    const projects = PROJECTS.flatMap((project) =>
      project.separatePlatformsInCarousel && project.platforms?.length
        ? project.platforms
        : [project],
    )
    const currentIndex = ref(0)
    const carouselRef = ref<HTMLElement | null>(null)
    const dragStartX = ref<number | null>(null)
    const totalProjects = computed(() => projects.length)

    // -------------------- Computed --------------------
    const currentProject = computed<PortfolioProject | null>(() => {
      return projects[currentIndex.value] ?? null
    })
    const currentPosition = computed(() => String(currentIndex.value + 1).padStart(2, '0'))

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

    const selectProject = (index: number): void => {
      const normalizedIndex = normalizeIndex(index)

      if (normalizedIndex === currentIndex.value) {
        const selectedProject = projects[normalizedIndex]

        if (selectedProject) {
          void navigateTo(selectedProject.path)
        }

        return
      }

      currentIndex.value = normalizedIndex
    }

    const shiftProject = (direction: number): void => {
      if (!totalProjects.value) {
        return
      }

      currentIndex.value = normalizeIndex(currentIndex.value + direction)
    }

    const startDrag = (event: PointerEvent): void => {
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
    }

    const cancelDrag = (): void => {
      dragStartX.value = null
    }

    const finishDrag = (event: PointerEvent): void => {
      if (dragStartX.value === null) return
      const distance = event.clientX - dragStartX.value
      dragStartX.value = null
      if (Math.abs(distance) < 42) return
      shiftProject(distance > 0 ? -1 : 1)
    }

    const getPreviewStack = (project: PortfolioProject): string[] => {
      return project.stack?.slice(0, PREVIEW_STACK_LIMIT) ?? []
    }

    const getProjectPath = (project: PortfolioProject): string => project.path

    // -------------------- Lifecycle --------------------

    return {
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
