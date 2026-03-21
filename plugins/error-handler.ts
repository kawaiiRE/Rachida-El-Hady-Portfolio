export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
    // Centralize Vue runtime errors here if you wire an external logger.
    console.error("[vue:errorHandler]", error, info)
  }

  nuxtApp.hook("vue:error", (error, instance, info) => {
    console.error("[vue:error]", error, info)
  })
})
