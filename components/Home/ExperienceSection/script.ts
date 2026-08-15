import { defineComponent } from 'vue'
import { EXPERIENCE_CHAPTERS } from '~/constants/home'
export default defineComponent({
  name: 'ExperienceSection',
  setup: () => ({ chapters: EXPERIENCE_CHAPTERS }),
})
