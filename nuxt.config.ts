// https://nuxt.com/docs/api/configuration/nuxt-config
const siteUrl = process.env.NUXT_PUBLIC_SITE_URL!
const siteName = 'Rachida El Hady'
const siteDescription =
  'Frontend engineer Rachida El Hady builds production React, Vue, Nuxt, TypeScript, and React Native products with scalable architecture, polished interfaces, and reliable delivery.'
const socialImage = `${siteUrl}/images/char-sitting-with-laptop.avif`
const googleAnalyticsId = process.env.NUXT_PUBLIC_GA_MEASUREMENT_ID?.trim()
const websiteStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteName,
  alternateName: 'Rachida El Hady',
  url: siteUrl,
}

export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  hooks: {
    'pages:extend'(pages) {
      const removePageImplementationRoutes = (routes: typeof pages): void => {
        for (let index = routes.length - 1; index >= 0; index -= 1) {
          const route = routes[index]
          if (!route) continue

          if (route.file?.endsWith('/script.ts') || route.file?.endsWith('\\script.ts')) {
            routes.splice(index, 1)
            continue
          }
          if (route.children?.length) removePageImplementationRoutes(route.children)
        }
      }

      removePageImplementationRoutes(pages)
    },
  },

  runtimeConfig: {
    public: {
      siteUrl,
      ...(googleAnalyticsId ? { googleAnalyticsId } : {}),
      emailjsPublicKey: process.env.NUXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
      emailjsServiceId: process.env.NUXT_PUBLIC_EMAILJS_SERVICE_ID!,
      emailjsTemplateId: process.env.NUXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
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
          content: '#08090b',
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
})
