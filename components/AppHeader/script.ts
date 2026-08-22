import { useRoute, useState } from '#imports'
import { computed, defineComponent, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
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
  { id: 'experience', label: 'Work', path: APP_ROUTES.EXPERIENCE },
  { id: 'projects', label: 'Projects', path: APP_ROUTES.PROJECTS },
  { id: 'typing', label: 'Play', path: APP_ROUTES.TYPING },
  { id: 'vibe', label: 'Vibe', path: APP_ROUTES.VIBE },
  { id: 'contact', label: 'Contact', path: APP_ROUTES.CONTACT },
]

export default defineComponent({
  name: 'AppHeader',
  props: {},
  emits: [],
  setup() {
    // -------------------- Composables --------------------
    const route = useRoute()
    const themeMode = useState<ThemeMode>('theme-mode', () => DEFAULT_THEME_MODE)

    // -------------------- State --------------------
    const isMobileMenuOpen = ref(false)
    const scrollProgress = ref(0)
    const activeSectionId = ref('')

    // -------------------- Computed --------------------
    const menuButtonLabel = computed(() => (isMobileMenuOpen.value ? 'Close menu' : 'Open menu'))
    const isDarkTheme = computed(() => themeMode.value === 'dark')
    const themeToggleLabel = computed(() =>
      isDarkTheme.value ? 'Switch to light theme' : 'Switch to dark theme',
    )
    const scrollProgressStyle = computed(() => ({
      transform: `scaleX(${scrollProgress.value})`,
    }))
    const activeLinkId = computed(() => {
      if (route.path === APP_ROUTES.HOME && activeSectionId.value) {
        return activeSectionId.value
      }

      const hashId = route.hash.replace('#', '')
      if (hashId && links.some((link) => link.id === hashId)) {
        return hashId
      }

      return links.find((link) => isRouteMatch(link))?.id ?? ''
    })

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

    const getLinkRoute = (link: AppHeaderLink): string => link.path.split('#')[0] || APP_ROUTES.HOME

    const isRouteMatch = (link: AppHeaderLink): boolean => {
      const linkRoute = getLinkRoute(link)

      return (
        route.path === linkRoute ||
        (linkRoute !== APP_ROUTES.HOME && route.path.startsWith(`${linkRoute}/`))
      )
    }

    const isLinkActive = (link: AppHeaderLink): boolean => activeLinkId.value === link.id

    const getAriaCurrent = (link: AppHeaderLink): 'location' | 'page' | undefined => {
      if (!isLinkActive(link) || !isRouteMatch(link)) {
        return undefined
      }

      return link.path.includes('#') ? 'location' : 'page'
    }

    const syncActiveSection = (): void => {
      if (route.path !== APP_ROUTES.HOME) {
        activeSectionId.value = ''

        return
      }

      const activationLine = Math.min(window.innerHeight * 0.32, 18 * 16)
      const activeSection = links.find((link) => {
        const section = document.getElementById(link.id)

        if (!section) {
          return false
        }

        const bounds = section.getBoundingClientRect()

        return bounds.top <= activationLine && bounds.bottom > activationLine
      })

      activeSectionId.value = activeSection?.id ?? ''
    }

    const syncScrollProgress = (): void => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight

      scrollProgress.value = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0
      syncActiveSection()
    }

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        closeMobileMenu()
      }
    }

    // -------------------- Watchers --------------------
    watch(
      () => route.fullPath,
      () => {
        closeMobileMenu()
        void nextTick().then(syncScrollProgress)
      },
    )

    // -------------------- Lifecycle --------------------
    onMounted(() => {
      syncScrollProgress()
      window.addEventListener('scroll', syncScrollProgress, { passive: true })
      window.addEventListener('resize', syncScrollProgress)
      window.addEventListener('keydown', handleKeyDown)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('scroll', syncScrollProgress)
      window.removeEventListener('resize', syncScrollProgress)
      window.removeEventListener('keydown', handleKeyDown)
    })

    return {
      isMobileMenuOpen,
      isDarkTheme,
      isLinkActive,
      getAriaCurrent,
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
