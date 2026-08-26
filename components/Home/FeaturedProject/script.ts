import { defineComponent } from 'vue'
import { TRACKPAL_PROJECT } from '~/constants/projects'

export default defineComponent({
  name: 'FeaturedProject',
  setup() {
    // -------------------- Composables --------------------
    // -------------------- State --------------------
    const project = TRACKPAL_PROJECT
    const platforms = project.platforms

    // -------------------- Computed --------------------
    const metrics = platforms.flatMap((platform) => platform.metrics.slice(0, 1))
    const technologies = [...new Set(platforms.flatMap((platform) => platform.stack))].slice(0, 6)

    // -------------------- Methods --------------------
    // -------------------- Lifecycle --------------------

    return { project, platforms, metrics, technologies }
  },
})
