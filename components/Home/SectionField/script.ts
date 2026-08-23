import { defineComponent, onBeforeUnmount, onMounted, ref, shallowRef } from 'vue'
import { Vector3 } from 'three'
import { Field } from '~/lib/particle-field/gl/field'
import {
  BOOT_LOOK,
  FIELD_LOOKS,
  FIELD_SECTION_IDS,
  type FieldSectionId,
} from '~/lib/particle-field/looks'

const WORDMARK = ['RACHIDA', 'EL HADY']
const DELIVERY_BARS = [8.4, 6.8, 9.6, 7.5, 10.8, 8.9, 6.2]
const WORDMARK_SCROLL_DISTANCE = 200

export default defineComponent({
  name: 'HomeSectionField',
  setup() {
    const canvasRef = shallowRef<HTMLCanvasElement | null>(null)
    const isHero = ref(true)

    let field: Field | null = null
    let frameId = 0
    let bootTimer = 0
    let wordmarkStartScrollY: number | null = null
    let lastFrame = 0
    let elapsed = 0
    let active: FieldSectionId = 'hero'
    let sections: Array<{ id: FieldSectionId; element: HTMLElement }> = []
    let isVisible = true
    let isUnmounted = false

    const frameHero = (extent: { width: number; height: number }): void => {
      FIELD_LOOKS.hero.fitWidth = extent.width * 1.12
      FIELD_LOOKS.hero.fitHeight = extent.height * 3.1
    }

    const findActiveSection = (): FieldSectionId => {
      const probe = window.scrollY + window.innerHeight * 0.34
      let current = sections[0]?.id ?? 'hero'

      for (const section of sections) {
        if (section.element.offsetTop <= probe) {
          current = section.id
        }
      }

      return current
    }

    const applySection = (force = false): void => {
      if (!field) {
        return
      }

      const next = findActiveSection()
      if (!force && next === active) {
        return
      }

      const previous = active
      active = next
      isHero.value = next === 'hero'
      document.documentElement.dataset.section = next

      wordmarkStartScrollY = null
      if (previous === 'hero' && next === 'leadership') {
        wordmarkStartScrollY = window.scrollY
        return
      }

      field.setLook(FIELD_LOOKS[next], 1.5)

      if (next !== 'hero' && (previous !== 'hero' || next !== 'leadership')) {
        field.wave(new Vector3(0, 0, 0), 16, 22, 2.6)
      }
    }

    const advanceWordmark = (): void => {
      if (
        !field ||
        active !== 'leadership' ||
        wordmarkStartScrollY === null ||
        window.scrollY - wordmarkStartScrollY < WORDMARK_SCROLL_DISTANCE
      ) {
        return
      }

      wordmarkStartScrollY = null
      field.setLook(FIELD_LOOKS.leadership, 1.5)
    }

    const handlePointerMove = (event: PointerEvent): void => {
      if (!field || event.pointerType === 'touch') {
        return
      }

      const { width, height } = field.viewport
      const x = (event.clientX / width) * 2 - 1
      const y = 1 - (event.clientY / height) * 2
      field.setPointer(x, y, true)
    }

    const releasePointer = (): void => {
      field?.releasePointer()
    }

    const handleVisibilityChange = (): void => {
      isVisible = document.visibilityState === 'visible'
      lastFrame = performance.now()
    }

    const tick = (time: number): void => {
      if (!field || isUnmounted) {
        return
      }

      const delta = lastFrame ? Math.min((time - lastFrame) / 1000, 1 / 20) : 1 / 60
      lastFrame = time

      if (isVisible) {
        // Tarraf's director resolves the active section on the shared frame
        // loop. Doing the same keeps morphs synchronized with native mobile
        // scrolling, programmatic jumps, and late layout shifts.
        applySection()
        advanceWordmark()
        elapsed += delta
        field.update(delta, elapsed)
      }

      frameId = requestAnimationFrame(tick)
    }

    const createField = async (): Promise<void> => {
      if (!canvasRef.value) {
        return
      }

      const fontsReady = document.fonts
        ? document.fonts.ready.then(() => document.fonts.load('700 340px "Sora"'))
        : Promise.resolve()

      await Promise.race([
        fontsReady,
        new Promise<void>((resolve) => window.setTimeout(resolve, 3000)),
      ]).catch(() => undefined)
      if (isUnmounted || !canvasRef.value) {
        return
      }

      sections = FIELD_SECTION_IDS.flatMap((id) => {
        const element = document.getElementById(id)
        return element ? [{ id, element }] : []
      })

      field = new Field(canvasRef.value, BOOT_LOOK, WORDMARK, DELIVERY_BARS)
      frameHero(field.wordmarkExtent)
      BOOT_LOOK.fitWidth = FIELD_LOOKS.hero.fitWidth
      BOOT_LOOK.fitHeight = FIELD_LOOKS.hero.fitHeight
      field.setLook({
        fitWidth: FIELD_LOOKS.hero.fitWidth,
        fitHeight: FIELD_LOOKS.hero.fitHeight,
      })

      for (let step = 0; step < 8; step += 1) {
        field.update(1 / 60, step / 60)
      }
      elapsed = 8 / 60

      field.onWordmark = (extent) => {
        frameHero(extent)
        if (active === 'hero') {
          field?.setLook(FIELD_LOOKS.hero)
        }
      }

      active = findActiveSection()
      isHero.value = active === 'hero'
      document.documentElement.dataset.section = active
      bootTimer = window.setTimeout(() => {
        if (!field) {
          return
        }

        field.setLook(FIELD_LOOKS[active], 1.8)
        if (active !== 'hero') {
          field.wave(new Vector3(0, 0, 0), 18, 22, 2.6)
        }
      }, 120)

      window.addEventListener('pointermove', handlePointerMove, { passive: true })
      window.addEventListener('pointerleave', releasePointer)
      window.addEventListener('blur', releasePointer)
      document.addEventListener('visibilitychange', handleVisibilityChange)

      frameId = requestAnimationFrame(tick)
    }

    onMounted(() => {
      void createField()
    })

    onBeforeUnmount(() => {
      isUnmounted = true
      window.clearTimeout(bootTimer)
      cancelAnimationFrame(frameId)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', releasePointer)
      window.removeEventListener('blur', releasePointer)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      field?.dispose()
      field = null
    })

    return {
      canvasRef,
      isHero,
    }
  },
})
