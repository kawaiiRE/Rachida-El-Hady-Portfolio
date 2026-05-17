import Particles from '@tsparticles/vue3'
import { loadFull } from 'tsparticles'
import { loadPolygonMaskPlugin } from '@tsparticles/plugin-polygon-mask'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Particles, {
    init: async (engine) => {
      await loadFull(engine)
      await loadPolygonMaskPlugin(engine)
    },
  })
})
