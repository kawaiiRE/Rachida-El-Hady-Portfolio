import { computed, defineComponent, onBeforeUnmount, ref } from 'vue'
import { VIBE_ROWS } from '~/constants/vibe'

const ROW_REPEAT_COUNT = 3
const VIBE_TRACK = {
  src: '/music/vibe-track.mpeg',
  title: 'Vibe with me',
  subtitle: 'Tiny soundtrack. Big mood.',
} as const

export default defineComponent({
  name: 'VibeSection',
  props: {},
  emits: [],
  setup() {
    const audioRef = ref<HTMLAudioElement | null>(null)
    const isPlaying = ref(false)
    const isFallbackPlayback = ref(false)

    const handleAudioPlay = (): void => {
      isFallbackPlayback.value = false
      isPlaying.value = true
    }

    const handleAudioPause = (): void => {
      isFallbackPlayback.value = false
      isPlaying.value = false
    }

    const togglePlayback = async (): Promise<void> => {
      if (isFallbackPlayback.value) {
        isPlaying.value = !isPlaying.value

        return
      }

      if (!audioRef.value) {
        isPlaying.value = !isPlaying.value
        isFallbackPlayback.value = true

        return
      }

      if (audioRef.value.paused) {
        try {
          await audioRef.value.play()
        } catch (error) {
          isFallbackPlayback.value = true
          isPlaying.value = true
        }

        return
      }

      audioRef.value.pause()
    }

    onBeforeUnmount(() => {
      audioRef.value?.pause()
    })

    return {
      audioRef,
      isPlaying,
      handleAudioPause,
      handleAudioPlay,
      togglePlayback,
      track: VIBE_TRACK,
      vibeRows: VIBE_ROWS,
      ROW_REPEAT_COUNT,
    }
  },
})
