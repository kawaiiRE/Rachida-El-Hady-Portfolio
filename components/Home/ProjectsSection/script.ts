import { computed, defineComponent, ref } from 'vue'
import { PROJECTS } from '~/constants/projects'
import type { PortfolioProject } from '~/constants/projects'

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

export default defineComponent({
  name: 'ProjectsSection',
  props: {},
  emits: [],
  setup() {
    const projects = PROJECTS
    const currentIndex = ref(0)
    const totalProjects = computed(() => projects.length)

    const currentProject = computed<PortfolioProject | null>(() => {
      return projects[currentIndex.value] ?? null
    })

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
      currentIndex.value = normalizeIndex(index)
    }

    const shiftProject = (direction: number): void => {
      if (!totalProjects.value) {
        return
      }

      currentIndex.value = normalizeIndex(currentIndex.value + direction)
    }

    const getPreviewStack = (project: PortfolioProject): string[] => {
      return project.stack.slice(0, PREVIEW_STACK_LIMIT)
    }

    const getProjectPath = (project: PortfolioProject) => {
      return {
        path: '/projects',
        hash: `#${project.id}`,
      }
    }

    return {
      carouselProjects,
      currentProject,
      getPreviewStack,
      getProjectPath,
      selectProject,
      shiftProject,
    }
  },
})
