import { useState } from '#imports'
import { computed, defineComponent, ref } from 'vue'
import { APP_ROUTES } from '~/constants/routes'

interface AppHeaderLink {
  id: string
  label: string
  path: string
}

export const links: AppHeaderLink[] = [
  { id: 'hero', label: 'Home', path: APP_ROUTES.HOME },
  { id: 'about', label: 'About', path: APP_ROUTES.ABOUT },
  { id: 'vibe', label: 'Vibe', path: APP_ROUTES.VIBE },
  { id: 'projects', label: 'Projects', path: APP_ROUTES.PROJECTS },
  { id: 'contact', label: 'Contact', path: APP_ROUTES.CONTACT },
]

export default defineComponent({
  name: 'AppHeader',
  props: {},
  emits: [],
  setup() {
    // -------------------- Composables --------------------
    const themeMode = useState<'light' | 'dark'>('theme-mode', () => 'light')

    // -------------------- State --------------------
    const isMobileMenuOpen = ref(false)

    // -------------------- Computed --------------------
    const menuButtonLabel = computed(() => (isMobileMenuOpen.value ? 'Close menu' : 'Open menu'))
    const isDarkTheme = computed(() => themeMode.value === 'dark')
    const themeToggleLabel = computed(() =>
      isDarkTheme.value ? 'Switch to light theme' : 'Switch to dark theme',
    )
    const themeToggleText = computed(() => (isDarkTheme.value ? 'Dark' : 'Light'))

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

    // -------------------- Lifecycle --------------------

    return {
      isMobileMenuOpen,
      isDarkTheme,
      menuButtonLabel,
      themeToggleLabel,
      themeToggleText,
      toggleMobileMenu,
      toggleThemeMode,
      closeMobileMenu,
      links,
      APP_ROUTES,
    }
  },
})
