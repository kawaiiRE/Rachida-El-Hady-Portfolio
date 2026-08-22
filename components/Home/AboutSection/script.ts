import { defineComponent } from 'vue'
import { LEADERSHIP_METRICS } from '~/constants/experience'

type SkillGroup = {
  id: string
  title: string
  skills: string[]
}

export default defineComponent({
  name: 'AboutSection',
  props: {},
  emits: [],
  setup() {
    // -------------------- Composables --------------------
    // -------------------- State --------------------
    const leadershipHighlights = LEADERSHIP_METRICS

    const skillGroups: SkillGroup[] = [
      {
        id: 'frontend',
        title: 'Frontend',
        skills: [
          'React.js',
          'Next.js',
          'Vue.js',
          'Nuxt.js',
          'React Native',
          'Expo',
          'TypeScript',
          'JavaScript',
          'Pinia',
          'Vite',
          'CSS/SCSS',
        ],
      },
      {
        id: 'engineering',
        title: 'Engineering',
        skills: [
          'Frontend Architecture',
          'Reusable Components',
          'REST API Integration',
          'Responsive Design',
          'SSR',
          'SEO',
          'Localization',
          'Performance',
        ],
      },
      {
        id: 'backend',
        title: 'Backend & data',
        skills: ['Node.js', 'Fastify', 'SQL'],
      },
      {
        id: 'delivery',
        title: 'Delivery',
        skills: ['Code Reviews', 'Mentoring', 'Figma', 'Postman', 'Git', 'GitHub'],
      },
    ]

    // -------------------- Computed --------------------
    // -------------------- Methods --------------------
    // -------------------- Lifecycle --------------------

    return {
      leadershipHighlights,
      skillGroups,
    }
  },
})
