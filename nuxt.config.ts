// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Application configuration
  app: {
    head: {
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap',
        },
      ],
    },
  },

  modules: ['@vuestic/nuxt', '@pinia/nuxt'],
  css: ['./assets/variables.scss', './assets/global.scss'],
  build: {
    transpile: ['vuestic-ui'],
  },
  vuestic: {
    config: {
      colors: {
        variables: {
          primary: '#7c5cff',
          secondary: '#00d4ff',
        },
      },
    },
  },
})
