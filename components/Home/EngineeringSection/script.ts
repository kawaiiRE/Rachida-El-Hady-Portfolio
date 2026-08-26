import { defineComponent } from 'vue'
import { ENGINEERING_PRINCIPLES } from '~/constants/home'

export default defineComponent({
  name: 'EngineeringSection',
  setup() {
    // -------------------- Composables --------------------
    // -------------------- State --------------------
    const principles = ENGINEERING_PRINCIPLES

    // -------------------- Computed --------------------
    // -------------------- Methods --------------------
    // -------------------- Lifecycle --------------------

    return { principles }
  },
})
