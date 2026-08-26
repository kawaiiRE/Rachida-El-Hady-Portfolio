import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TypingChallengeSection',
  props: {
    heading: {
      type: String,
      default: 'Get to know my work, one keystroke at a time.',
    },
  },
  emits: [],
  setup() {
    // -------------------- Composables --------------------
    const typingChallenge = useTypingChallenge()

    // -------------------- State --------------------
    // -------------------- Computed --------------------
    // -------------------- Methods --------------------
    // -------------------- Lifecycle --------------------

    return typingChallenge
  },
})
