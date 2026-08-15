import { useState } from '#imports'
import { computed, defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import { APP_ROUTES } from '~/constants/routes'
import { DEFAULT_THEME_MODE, type ThemeMode } from '~/constants/theme'

interface AppHeaderLink {
  id: string
  label: string
  path: string
}

export const links: AppHeaderLink[] = [
  // { id: 'hero', label: 'Home', path: APP_ROUTES.HOME },
  // { id: 'leadership', label: 'Leadership', path: APP_ROUTES.LEADERSHIP },
  { id: 'projects', label: 'Projects', path: APP_ROUTES.PROJECTS },
  { id: 'vibe', label: 'Vibe', path: APP_ROUTES.VIBE },
  { id: 'contact', label: 'Contact', path: APP_ROUTES.CONTACT },
]

export default defineComponent({
  name: 'AppHeader',
  props: {},
  emits: [],
  setup() {
    // -------------------- Composables --------------------
    const themeMode = useState<ThemeMode>('theme-mode', () => DEFAULT_THEME_MODE)

    // -------------------- State --------------------
    const isMobileMenuOpen = ref(false)
    const scrollProgress = ref(0)

    // -------------------- Computed --------------------
    const menuButtonLabel = computed(() => (isMobileMenuOpen.value ? 'Close menu' : 'Open menu'))
    const isDarkTheme = computed(() => themeMode.value === 'dark')
    const themeToggleLabel = computed(() =>
      isDarkTheme.value ? 'Switch to light theme' : 'Switch to dark theme',
    )
    const scrollProgressStyle = computed(() => ({
      transform: `scaleX(${scrollProgress.value})`,
    }))

    // -------------------- Methods --------------------
    const toggleMobileMenu = (): void => {
      isMobileMenuOpen.value = !isMobileMenuOpen.value
    }

    const closeMobileMenu = (): void => {
      isMobileMenuOpen.value = false
    }

    const toggleThemeMode = (): void => {
      themeMode.value = isDarkTheme.value ? 'light' : 'dark'
    }

    const syncScrollProgress = (): void => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight

      scrollProgress.value = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0
    }

    // -------------------- Lifecycle --------------------
    onMounted(() => {
      syncScrollProgress()
      window.addEventListener('scroll', syncScrollProgress, { passive: true })
      window.addEventListener('resize', syncScrollProgress)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('scroll', syncScrollProgress)
      window.removeEventListener('resize', syncScrollProgress)
    })

    return {
      isMobileMenuOpen,
      isDarkTheme,
      menuButtonLabel,
      scrollProgressStyle,
      themeToggleLabel,
      toggleMobileMenu,
      toggleThemeMode,
      closeMobileMenu,
      links,
      APP_ROUTES,
    }
  },
})
