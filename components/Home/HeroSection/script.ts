import { useState } from '#imports'
import { defineComponent, nextTick, onBeforeUnmount, onMounted, shallowRef, watch } from 'vue'
import { APP_LINKS, APP_ROUTES } from '~/constants/routes'
import { DEFAULT_THEME_MODE, type ThemeMode } from '~/constants/theme'
import { hexColorToNumber, resolveCssVarColor, themeColorVariables } from '~/lib/utils'

type VantaEffect = {
  destroy: () => void
}

type GsapMatchMedia = {
  add: (query: string, callback: () => void | (() => void)) => void
  revert: () => void
}

export default defineComponent({
  name: 'HeroSection',
  props: {},
  emits: [],
  setup() {
    // -------------------- Composables --------------------
    const themeMode = useState<ThemeMode>('theme-mode', () => DEFAULT_THEME_MODE)

    // -------------------- State --------------------
    const heroRef = shallowRef<HTMLElement | null>(null)
    const backgroundRef = shallowRef<HTMLElement | null>(null)
    const sittingImageRef = shallowRef<HTMLImageElement | null>(null)
    const scrollFlowerRef = shallowRef<HTMLElement | null>(null)
    const vantaEffect = shallowRef<VantaEffect | null>(null)
    let vantaCreationId = 0
    let scrollMatchMedia: GsapMatchMedia | null = null

    // -------------------- Computed --------------------
    // -------------------- Methods --------------------
    const createVantaBackground = async (): Promise<void> => {
      if (typeof window === 'undefined' || !backgroundRef.value || vantaEffect.value) {
        return
      }

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return
      }

      const creationId = ++vantaCreationId
      const backgroundElement = backgroundRef.value
      const [birdsModule, threeModule] = await Promise.all([
        import('vanta/dist/vanta.birds.min'),
        import('three-vanta'),
      ])

      if (creationId !== vantaCreationId || !backgroundElement.isConnected) {
        return
      }

      const primaryBirdColor = resolveCssVarColor(themeColorVariables.heroBirdPrimary)
      const secondaryBirdColor = resolveCssVarColor(themeColorVariables.heroBirdSecondary)
      const birdsFactory = (birdsModule.default ?? birdsModule) as (options: unknown) => VantaEffect
      const three = threeModule.default ?? threeModule
      const isPhoneViewport = window.matchMedia('(max-width: 38rem)').matches

      ;(window as { THREE?: unknown }).THREE = three
      vantaEffect.value = birdsFactory({
        el: backgroundElement,
        THREE: three,
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
        colorMode: 'lerpGradient',
        birdSize: isPhoneViewport ? 1.5 : 1.35,
        wingSpan: isPhoneViewport ? 18 : 22,
        speedLimit: isPhoneViewport ? 4 : 3.25,
        separation: 26,
        alignment: 34,
        cohesion: 32,
        quantity: isPhoneViewport ? 4 : 3,
      }) as VantaEffect
    }

    const destroyVantaBackground = (): void => {
      vantaCreationId += 1
      vantaEffect.value?.destroy()
      vantaEffect.value = null
    }

    const createScrollAnimations = async (): Promise<void> => {
      if (!heroRef.value || !sittingImageRef.value || !scrollFlowerRef.value) {
        return
      }

      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])

      if (!heroRef.value || !sittingImageRef.value || !scrollFlowerRef.value) {
        return
      }

      const heroElement = heroRef.value
      const sittingImageElement = sittingImageRef.value
      const scrollFlowerElement = scrollFlowerRef.value

      gsap.registerPlugin(ScrollTrigger)
      scrollMatchMedia = gsap.matchMedia()
      scrollMatchMedia.add('(prefers-reduced-motion: no-preference)', () => {
        const context = gsap.context(() => {
          gsap.from(['.eyebrow', '.title span', '.subtitle', '.actions'], {
            opacity: 0,
            y: 28,
            duration: 0.82,
            stagger: 0.075,
            ease: 'power3.out',
            clearProps: 'opacity,transform',
          })

          gsap.from(sittingImageElement, {
            opacity: 0,
            duration: 1,
            delay: 0.18,
            ease: 'power2.out',
          })

          gsap.from(scrollFlowerElement, {
            opacity: 0,
            duration: 0.9,
            delay: 0.34,
            ease: 'power2.out',
          })

          gsap
            .timeline({
              scrollTrigger: {
                trigger: heroElement,
                start: 'top top',
                end: 'bottom top',
                scrub: 0.8,
                invalidateOnRefresh: true,
              },
            })
            .to(scrollFlowerElement, { rotation: 165, scale: 1.08, ease: 'none' }, 0)
        }, heroElement)

        return () => context.revert()
      })
    }

    const destroyScrollAnimations = (): void => {
      scrollMatchMedia?.revert()
      scrollMatchMedia = null
    }

    // -------------------- Watchers --------------------
    watch(themeMode, async () => {
      await nextTick()
      destroyVantaBackground()
      await createVantaBackground()
    })

    // -------------------- Lifecycle --------------------
    onMounted(() => {
      void createVantaBackground()
      void createScrollAnimations()
    })

    onBeforeUnmount(() => {
      destroyVantaBackground()
      destroyScrollAnimations()
    })

    return {
      heroRef,
      backgroundRef,
      sittingImageRef,
      scrollFlowerRef,
      APP_LINKS,
      APP_ROUTES,
    }
  },
})
