import { defineComponent } from 'vue'
import { PROFESSIONAL_ROLES } from '~/constants/experience'

export default defineComponent({
  name: 'ExperienceSection',
  props: {},
  emits: [],
  setup() {
    return {
      roles: PROFESSIONAL_ROLES,
    }
  },
})
