import { defineComponent } from 'vue'
import { ENGINEERING_PRINCIPLES } from '~/constants/home'
export default defineComponent({
  name: 'EngineeringSection',
  setup: () => ({ principles: ENGINEERING_PRINCIPLES }),
})
