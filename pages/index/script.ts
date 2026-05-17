import { defineComponent } from 'vue'
import { PROJECTS } from '~/constants/projects'

export default defineComponent({
  name: 'IndexPage',
  props: {},
  emits: [],
  setup() {
    // -------------------- Composables --------------------
    // -------------------- State --------------------
    const projects = PROJECTS

    // -------------------- Computed --------------------
    // -------------------- Methods --------------------
    // -------------------- Lifecycle --------------------

    return {
      projects,
    }
  },
})
