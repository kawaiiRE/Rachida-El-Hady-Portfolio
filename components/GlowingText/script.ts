import { computed, defineComponent, getCurrentInstance, onMounted, ref } from 'vue'

const FONT_PRESETS = {
  display: {
    cssVariable: 'var(--font-display)',
    loadFamily: null,
  },
  primary: {
    cssVariable: 'var(--font-primary)',
    loadFamily: null,
  },
  body: {
    cssVariable: 'var(--font-body)',
    loadFamily: null,
  },
  oleo: {
    cssVariable: 'var(--font-oleo)',
    loadFamily: "'Oleo Script Swash Caps'",
  },
  'space-mono': {
    cssVariable: 'var(--font-space-mono)',
    loadFamily: "'Space Mono'",
  },
} as const

export default defineComponent({
  name: 'GlowingText',
  props: {
    text: {
      type: String,
      required: true,
    },
    fill: {
      type: String,
      default: 'transparent',
    },
    fontPreset: {
      type: String,
      default: 'display',
    },
  },
  emits: [],
  setup(props) {
    // -------------------- Composables --------------------
    const instance = getCurrentInstance()

    // -------------------- State --------------------
    const symbolId = `glowing-text-${instance?.uid ?? Math.random().toString(36).slice(2)}`
    const fontRenderKey = ref(0)

    // -------------------- Computed --------------------
    const selectedFontPreset = computed(
      () => FONT_PRESETS[props.fontPreset as keyof typeof FONT_PRESETS] ?? FONT_PRESETS.display,
    )
    const resolvedFontFamily = computed(() => selectedFontPreset.value.cssVariable)

    // -------------------- Methods --------------------
    // -------------------- Lifecycle --------------------
    onMounted(async () => {
      if (!('fonts' in document)) {
        return
      }

      const { loadFamily } = selectedFontPreset.value

      if (!loadFamily) {
        return
      }

      try {
        await document.fonts.load(`1em ${loadFamily}`)
        await document.fonts.ready
        fontRenderKey.value += 1
      } catch {
        // Keep the fallback font if the external font fails to load.
      }
    })

    return {
      fontRenderKey,
      text: props.text,
      fill: props.fill,
      fontPreset: props.fontPreset,
      resolvedFontFamily,
      symbolId,
    }
  },
})
