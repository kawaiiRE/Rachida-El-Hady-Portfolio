export interface LeadershipMetric {
  id: string
  value: string
  label: string
  description: string
}

export interface ProfessionalProject {
  id: string
  index: string
  title: string
  context: string
  description: string
  technologies: string[]
}

export interface ProfessionalRole {
  id: string
  index: string
  company: string
  title: string
  startDate: string
  startLabel: string
  endDate: string
  endLabel: string
  summary: string
  highlights: string[]
  projects: ProfessionalProject[]
  additional?: string
}

export const LEADERSHIP_METRICS: LeadershipMetric[] = [
  {
    id: 'delivery-team',
    value: '2 + 1',
    label: 'Delivery team coordinated',
    description:
      'Coordinated two frontend developers and one intern while following features through release.',
  },
  {
    id: 'developers-trained',
    value: '6+',
    label: 'Developers onboarded',
    description:
      'Trained developers and interns on project structure, implementation standards, and independent delivery.',
  },
  {
    id: 'candidate-reviews',
    value: '40+',
    label: 'Candidates evaluated',
    description:
      'Reviewed frontend assessments, led technical follow-ups, and provided hiring recommendations.',
  },
]

export const PROFESSIONAL_ROLES: ProfessionalRole[] = [
  {
    id: 'sowlutions',
    index: '01',
    company: 'Sowlutions',
    title: 'Front-End Developer · Team-lead responsibilities',
    startDate: '2025-01',
    startLabel: 'Jan 2025',
    endDate: '2026-08',
    endLabel: 'Aug 2026',
    summary:
      'Progressed into frontend delivery leadership across live SaaS, AI, analytics, creator-economy, and client platforms while remaining hands-on in the code.',
    highlights: [
      'Owned project-level frontend delivery, planning, pull-request reviews, and production follow-through.',
      'Coordinated API requirements and priorities directly with backend developers, designers, product owners, and client stakeholders.',
      'Improved the shared Nuxt starter foundation with reusable wrappers, clearer structure, and maintainability enhancements.',
    ],
    projects: [
      {
        id: 'ai-operations-platform',
        index: '01',
        title: 'AI-enabled operations platform',
        context: 'Workflow and decision-support software',
        description:
          'Built the frontend from the ground up and established its Nuxt architecture, reusable interface system, shared wrappers, and delivery workflow.',
        technologies: ['Nuxt 4', 'Vue 3', 'TypeScript', 'Pinia'],
      },
      {
        id: 'identity-platform',
        index: '02',
        title: 'Identity-focused SaaS product',
        context: 'Digital identity and rights workflows',
        description:
          'Took broad frontend delivery ownership across an established live product, including refactors, releases, and integration support.',
        technologies: ['Nuxt', 'Vue', 'Production delivery'],
      },
      {
        id: 'compliance-platform',
        index: '03',
        title: 'Compliance operations platform',
        context: 'Professional-services workflow software',
        description:
          'Delivered onboarding and verification flows, dynamic forms, localization, complex business interfaces, and financial reporting workflows.',
        technologies: ['Nuxt', 'Vue', 'i18n', 'Financial UI'],
      },
      {
        id: 'analytics-workspace',
        index: '04',
        title: 'Financial analytics workspace',
        context: 'Data-heavy reporting product',
        description:
          'Built financial analysis and account-structure interfaces, then researched rendering approaches for large data-heavy tables.',
        technologies: ['Vue', 'REST APIs', 'Data visualization'],
      },
      {
        id: 'creator-platforms',
        index: '05',
        title: 'Creator-facing web platforms',
        context: 'Marketing and community experiences',
        description:
          'Built multiple experiences from the ground up and delivered custom JavaScript, CMS architecture, experiments, forms, and workflow automation.',
        technologies: ['JavaScript', 'Webflow', 'WordPress', 'Integrations'],
      },
    ],
    additional:
      'Additional delivery included an AI-assisted media-management tool, a creator-platform foundation, React and Next.js product support, and role-based access integration.',
  },
  {
    id: 'axentech',
    index: '02',
    company: 'Axentech GIB',
    title: 'Front-End Developer',
    startDate: '2023-12',
    startLabel: 'Dec 2023',
    endDate: '2024-09',
    endLabel: 'Sep 2024',
    summary:
      'Built production React features for an insurance-brokerage ERP while developing inside an established product and delivery team.',
    highlights: [
      'Delivered complete pages and workflows for clients, invoices, receipts, and installment tracking.',
      'Built data-heavy interfaces with complex forms, validation, tables, and business calculations.',
      'Integrated REST APIs and debugged frontend and API behavior with Postman.',
    ],
    projects: [
      {
        id: 'operations-erp',
        index: '01',
        title: 'Insurance operations ERP',
        context: 'Internal operations platform',
        description:
          'Created reusable React components and complete business workflows using both class-based and functional components.',
        technologies: ['React', 'JavaScript', 'REST APIs', 'Data tables'],
      },
    ],
  },
]
