import { defineComponent } from 'vue'

type SkillGroup = {
  id: string
  title: string
  skills: string[]
}

type LeadershipHighlight = {
  id: string
  title: string
  description: string
}

export default defineComponent({
  name: 'AboutSection',
  props: {},
  emits: [],
  setup() {
    // -------------------- Composables --------------------
    // -------------------- State --------------------
    const leadershipHighlights: LeadershipHighlight[] = [
      {
        id: 'project-leadership',
        title: 'Leadership',
        description:
          'Take the lead on major frontend projects by directing development, organizing engineering tasks, and keeping the team aligned to deliver high-quality work.',
      },
      {
        id: 'team-growth',
        title: 'Team Growth & Mentorship',
        description:
          'Guide new developers from their first day until they are fully independent, helping them learn the codebase and write cleaner, stronger code.',
      },
      {
        id: 'code-quality',
        title: 'Code Quality & Standards',
        description:
          'Review daily pull requests to maintain clear patterns, consistent implementation, and reliable frontend quality across the team.',
      },
    ]

    const skillGroups: SkillGroup[] = [
      {
        id: 'frontend',
        title: 'Frontend',
        skills: [
          'Vue.js',
          'Nuxt.js',
          'React.js',
          'Next.js',
          'React Native',
          'Expo',
          'TypeScript',
          'JavaScript',
          'Pinia',
          'Redux',
          'CSS/SCSS',
        ],
      },
      {
        id: 'backend',
        title: 'Backend',
        skills: ['Node.js', 'Fastify', 'Laravel', 'REST APIs'],
      },
      {
        id: 'database',
        title: 'Database',
        skills: ['MySQL', 'PostgreSQL', 'MSSQL'],
      },
      {
        id: 'tools',
        title: 'Tools',
        skills: ['Git', 'GitHub', 'Postman', 'Figma', 'VS Code', 'Android Studio'],
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
