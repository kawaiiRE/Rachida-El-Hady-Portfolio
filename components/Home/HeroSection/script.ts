import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import type { PropType } from 'vue'
import { hexColorToNumber, resolveCssVarColor, themeColorVariables } from '~/lib/utils'
import { APP_LINKS, APP_ROUTES } from '~/constants/routes'

type VantaEffect = {
  destroy: () => void
}

export default defineComponent({
  name: 'HeroSection',
  props: {},
  emits: [],
  setup() {
    // -------------------- Composables --------------------
    // -------------------- State --------------------
    const heroBackgroundRef = ref<HTMLElement | null>(null)
    const vantaEffect = ref<VantaEffect | null>(null)

    // -------------------- Computed --------------------
    // -------------------- Methods --------------------
    const createVantaBackground = async (): Promise<void> => {
      if (typeof window === 'undefined' || !heroBackgroundRef.value || vantaEffect.value) {
        return
      }

      const [birdsModule, threeModule] = await Promise.all([
        import('vanta/dist/vanta.birds.min'),
        import('three'),
      ])

      const primaryBirdColor = resolveCssVarColor(themeColorVariables.primary400)
      const secondaryBirdColor = resolveCssVarColor(themeColorVariables.secondary400)

      const birdsFactory = (birdsModule.default ?? birdsModule) as (options: unknown) => VantaEffect
      ;(window as { THREE?: unknown }).THREE = threeModule

      vantaEffect.value = birdsFactory({
        el: heroBackgroundRef.value,
        THREE: threeModule,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        scale: 1,
        scaleMobile: 1,
        backgroundAlpha: 0,
        color1: hexColorToNumber(primaryBirdColor),
        color2: hexColorToNumber(secondaryBirdColor),
        birdSize: 1.5,
        wingSpan: 18,
        speedLimit: 4,
        separation: 24,
        alignment: 26,
        cohesion: 28,
      }) as VantaEffect
    }

    const destroyVantaBackground = (): void => {
      if (!vantaEffect.value) {
        return
      }

      vantaEffect.value.destroy()
      vantaEffect.value = null
    }

    // -------------------- Lifecycle --------------------
    onMounted(() => {
      void createVantaBackground()
    })

    onBeforeUnmount(() => {
      destroyVantaBackground()
    })

    return {
      heroBackgroundRef,
      APP_LINKS,
      APP_ROUTES,
    }
  },
})
