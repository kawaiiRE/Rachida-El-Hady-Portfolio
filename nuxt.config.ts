// https://nuxt.com/docs/api/configuration/nuxt-config
const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://rachida.dev'
const siteName = 'Rachida El Hady'
const siteDescription =
  'Frontend engineer portfolio for Rachida El Hady, featuring Nuxt, Vue, React Native, Expo, and production-focused interface work.'
const socialImage = `${siteUrl}/images/char-sitting-with-laptop.avif`
const googleAnalyticsId = process.env.NUXT_PUBLIC_GA_MEASUREMENT_ID || ''
const websiteStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteName,
  alternateName: 'Rachida El Hady',
  url: siteUrl,
}

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  runtimeConfig: {
    analyticsAdminToken: process.env.ANALYTICS_ADMIN_TOKEN || '',
    analyticsD1Binding: process.env.ANALYTICS_D1_BINDING || 'ANALYTICS_DB',
    analyticsIpSalt: process.env.ANALYTICS_IP_SALT || '',
    analyticsLogPath: process.env.ANALYTICS_LOG_PATH || '.data/analytics-events.jsonl',
    public: {
      siteUrl,
      analyticsEnabled:
        process.env.NUXT_PUBLIC_ANALYTICS_ENABLED ||
        (process.env.NODE_ENV === 'production' ? 'true' : 'false'),
      analyticsEndpoint: process.env.NUXT_PUBLIC_ANALYTICS_ENDPOINT || '/api/analytics/event',
      analyticsPreciseLocationEnabled:
        process.env.NUXT_PUBLIC_ANALYTICS_PRECISE_LOCATION_ENABLED || 'false',
      analyticsPreciseLocationMode:
        process.env.NUXT_PUBLIC_ANALYTICS_PRECISE_LOCATION_MODE || 'campaign',
      googleAnalyticsId,
      emailjsPublicKey:
        process.env.NUXT_PUBLIC_EMAILJS_PUBLIC_KEY || process.env.VITE_EMAILJS_PUBLIC_KEY || '',
      emailjsServiceId:
        process.env.NUXT_PUBLIC_EMAILJS_SERVICE_ID || process.env.VITE_EMAILJS_SERVICE_ID || '',
      emailjsTemplateId:
        process.env.NUXT_PUBLIC_EMAILJS_TEMPLATE_ID || process.env.VITE_EMAILJS_TEMPLATE_ID || '',
    },
  },

  // Application configuration
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      title: siteName,
      meta: [
        {
          name: 'description',
          content: siteDescription,
        },
        {
          name: 'theme-color',
          content: '#121212',
        },
        {
          property: 'og:type',
          content: 'website',
        },
        {
          property: 'og:site_name',
          content: siteName,
        },
        {
          property: 'og:url',
          content: siteUrl,
        },
        {
          property: 'og:title',
          content: siteName,
        },
        {
          property: 'og:description',
          content: siteDescription,
        },
        {
          property: 'og:image',
          content: socialImage,
        },
        {
          name: 'twitter:card',
          content: 'summary_large_image',
        },
        {
          name: 'twitter:title',
          content: siteName,
        },
        {
          name: 'twitter:description',
          content: siteDescription,
        },
        {
          name: 'twitter:image',
          content: socialImage,
        },
        {
          name: 'application-name',
          content: siteName,
        },
      ],
      link: [
        {
          rel: 'canonical',
          href: siteUrl,
        },
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
          type: 'application/ld+json',
          innerHTML: JSON.stringify(websiteStructuredData),
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
