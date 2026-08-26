import { defineComponent } from 'vue'
import { PROFESSIONAL_ROLES } from '~/constants/experience'

export default defineComponent({
  name: 'ExperienceSection',
  props: {},
  emits: [],
  setup() {
    // -------------------- Composables --------------------
    // -------------------- State --------------------
    const roles = PROFESSIONAL_ROLES

    // -------------------- Computed --------------------
    // -------------------- Methods --------------------
    // -------------------- Lifecycle --------------------

    return {
      roles,
    }
  },
})
