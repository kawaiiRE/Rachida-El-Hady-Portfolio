import { defineComponent } from 'vue'
import { TRACKPAL_PROJECT } from '~/constants/projects'

export default defineComponent({
  name: 'FeaturedProject',
  setup() {
    // -------------------- Composables --------------------
    // -------------------- State --------------------
    const project = TRACKPAL_PROJECT
    const images = project.images.slice(0, 2)

    // -------------------- Computed --------------------
    const metrics = project.metrics.slice(0, 2)
    const technologies = project.stack.slice(0, 6)

    // -------------------- Methods --------------------
    // -------------------- Lifecycle --------------------

    return { project, images, metrics, technologies }
  },
})
