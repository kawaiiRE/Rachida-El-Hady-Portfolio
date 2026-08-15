import { defineComponent } from 'vue'
import { PROJECTS } from '~/constants/projects'

export default defineComponent({
  name: 'HomePage',
  setup() {
    const runtimeConfig = useRuntimeConfig()
    const siteUrl = String(runtimeConfig.public.siteUrl || 'https://rachida.dev').replace(/\/$/, '')
    const personId = `${siteUrl}/#person`

    usePageSeo({
      title: 'Rachida El Hady | Frontend Engineer for Web and Mobile Products',
      description:
        'Portfolio of frontend engineer Rachida El Hady, featuring production Nuxt, Vue, React Native, Expo, TypeScript, WebGL, and full-stack product work.',
      path: '/',
      type: 'profile',
      structuredData: [
        {
          '@context': 'https://schema.org',
          '@type': 'ProfilePage',
          url: siteUrl,
          name: 'Rachida El Hady — Frontend Engineer',
          mainEntity: {
            '@type': 'Person',
            '@id': personId,
            name: 'Rachida El Hady',
            url: siteUrl,
            jobTitle: 'Frontend Engineer',
            description:
              'Frontend engineer building production web and mobile products with Nuxt, Vue, React Native, Expo, and TypeScript.',
            knowsAbout: [
              'Frontend engineering',
              'Nuxt',
              'Vue.js',
              'React Native',
              'Expo',
              'TypeScript',
              'WebGL',
              'Mobile application development',
            ],
          },
          hasPart: {
            '@type': 'ItemList',
            name: 'Selected software projects',
            itemListElement: PROJECTS.map((project, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: project.title,
              url: `${siteUrl}/projects/${project.id}`,
            })),
          },
        },
      ],
    })

    return {}
  },
})
