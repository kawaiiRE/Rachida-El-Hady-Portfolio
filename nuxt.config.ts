// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      emailjsPublicKey: process.env.NUXT_PUBLIC_EMAILJS_PUBLIC_KEY || process.env.VITE_EMAILJS_PUBLIC_KEY || '',
      emailjsServiceId: process.env.NUXT_PUBLIC_EMAILJS_SERVICE_ID || process.env.VITE_EMAILJS_SERVICE_ID || '',
      emailjsTemplateId: process.env.NUXT_PUBLIC_EMAILJS_TEMPLATE_ID || process.env.VITE_EMAILJS_TEMPLATE_ID || '',
    },
  },

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
          href: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Sora:wght@500;600;700;800&display=swap',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Oleo+Script+Swash+Caps:wght@400;700&family=Rochester&family=Ruthie&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap',
        },
      ],
      script: [
        {
          src: 'https://www.googletagmanager.com/gtag/js?id=G-YC1MR1Z5Q5',
          async: true,
        },
        {
          innerHTML: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-YC1MR1Z5Q5');
          `,
          type: 'text/javascript',
        },
      ],
    },
  },

  modules: ['@vuestic/nuxt', '@pinia/nuxt'],
  css: ['./assets/fonts.scss', './assets/variables.scss', './assets/global.scss'],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/breakpoints.scss" as *;',
        },
      },
    },
  },
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
