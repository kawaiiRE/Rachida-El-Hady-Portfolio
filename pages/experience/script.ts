import { defineComponent } from 'vue'
import { APP_ROUTES } from '~/constants/routes'

export default defineComponent({
  name: 'ExperiencePage',
  props: {},
  emits: [],
  setup() {
    usePageSeo({
      title: 'Professional Frontend Experience',
      description:
        'Explore Rachida El Hady’s professional frontend experience across production SaaS, React, Vue, Nuxt, TypeScript, delivery leadership, code reviews, and team mentorship.',
      path: APP_ROUTES.EXPERIENCE,
      type: 'profile',
    })

    return {}
  },
})
