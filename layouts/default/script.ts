import { useState } from '#imports'
import { computed, defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const THEME_STORAGE_KEY = 'theme-mode'

export default defineComponent({
  name: 'DefaultLayout',
  props: {},
  emits: [],
  setup() {
    // -------------------- Composables --------------------
    const themeMode = useState<'light' | 'dark'>('theme-mode', () => 'light')

    // -------------------- State --------------------
    const isThemeTransitionActive = ref(false)
    const isRestoringTheme = ref(true)
    let themeTransitionTimeout: ReturnType<typeof setTimeout> | null = null

    // -------------------- Computed --------------------
    const layoutClasses = computed(() => ({
      dark: themeMode.value === 'dark',
      'default-layout--theme-transition': isThemeTransitionActive.value,
    }))

    // -------------------- Methods --------------------
    const startThemeTransition = (): void => {
      if (themeTransitionTimeout) {
        clearTimeout(themeTransitionTimeout)
      }

      isThemeTransitionActive.value = false

      if (!import.meta.client) {
        return
      }

      window.requestAnimationFrame(() => {
        isThemeTransitionActive.value = true
        themeTransitionTimeout = setTimeout(() => {
          isThemeTransitionActive.value = false
          themeTransitionTimeout = null
        }, 720)
      })
    }

    // -------------------- Lifecycle --------------------
    watch(themeMode, (nextTheme, previousTheme) => {
      if (import.meta.client) {
        localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
        document.documentElement.classList.toggle('dark', nextTheme === 'dark')
      }

      if (isRestoringTheme.value || !previousTheme || nextTheme === previousTheme) {
        return
      }

      startThemeTransition()
    })

    onMounted(() => {
      const savedThemeMode = localStorage.getItem(THEME_STORAGE_KEY)

      if (savedThemeMode === 'light' || savedThemeMode === 'dark') {
        themeMode.value = savedThemeMode
        document.documentElement.classList.toggle('dark', themeMode.value === 'dark')
      } else {
        localStorage.setItem(THEME_STORAGE_KEY, themeMode.value)
        document.documentElement.classList.toggle('dark', themeMode.value === 'dark')
      }

      isRestoringTheme.value = false
    })

    onBeforeUnmount(() => {
      if (themeTransitionTimeout) {
        clearTimeout(themeTransitionTimeout)
      }
    })

    return {
      layoutClasses,
    }
  },
})
