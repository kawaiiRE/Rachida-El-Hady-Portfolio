import { defineComponent } from 'vue'

type SkillGroup = {
  id: string
  title: string
  skills: string[]
}

type Highlight = {
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
    const items: string[] = [
      'I build functional web and mobile applications using modern frameworks like Nuxt and Expo.',
      'I focus on creating practical, data-driven tools and systems that serve a clear purpose.',
      'I enjoy turning complex product ideas into polished interfaces.',
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

    const highlights: Highlight[] = [
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
          'Directly guide all new developers from their first day until they are fully independent. I help them learn new technologies, master our codebase, and consistently write cleaner, better code.',
      },
      {
        id: 'code-quality',
        title: 'Code Quality & Standards',
        description:
          'Review daily pull requests to maintain high code quality and consistency across the team.',
      },
    ]

    // -------------------- Computed --------------------
    // -------------------- Methods --------------------
    // -------------------- Lifecycle --------------------

    return {
      highlights,
      items,
      skillGroups,
    }
  },
})
