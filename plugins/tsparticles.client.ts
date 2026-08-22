import Particles from '@tsparticles/vue3'
import { loadPolygonMaskPlugin } from '@tsparticles/plugin-polygon-mask'
import { loadFull } from 'tsparticles'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Particles, {
    init: async (engine) => {
      await loadFull(engine)
      await loadPolygonMaskPlugin(engine)
    },
  })
})
