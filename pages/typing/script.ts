import { defineComponent } from 'vue'
import { APP_ROUTES } from '~/constants/routes'

export default defineComponent({
  name: 'TypingPage',
  props: {},
  emits: [],
  setup() {
    // -------------------- Composables --------------------
    usePageSeo({
      title: 'Typing Speed Challenge',
      description:
        'Test your typing speed with Rachida El Hady’s interactive keyboard challenge, featuring Easy and Hard levels, live WPM, accuracy, and session records.',
      path: APP_ROUTES.TYPING,
    })

    // -------------------- State --------------------
    // -------------------- Computed --------------------
    // -------------------- Methods --------------------
    // -------------------- Lifecycle --------------------

    return {}
  },
})
