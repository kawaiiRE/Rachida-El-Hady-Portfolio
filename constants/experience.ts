export interface LeadershipMetric {
  id: string
  value: string
  label: string
  description: string
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
  technologies: string[]
}

export const LEADERSHIP_METRICS: LeadershipMetric[] = [
  {
    id: 'delivery-team',
    value: '3+',
    label: 'Delivery team coordinated',
    description:
      'Coordinated two frontend developers and one intern while following features through release.',
  },
  {
    id: 'developers-trained',
    value: '6+',
    label: 'Developers trained and onboarded',
    description:
      'Trained developers and interns on project structure, implementation standards, and independent delivery.',
  },
]

export const PROFESSIONAL_ROLES: ProfessionalRole[] = [
  {
    id: 'sowlutions',
    index: '01',
    company: 'Sowlutions',
    title: 'Front-End Developer',
    startDate: '2025-01',
    startLabel: 'Jan 2025',
    endDate: '2026-08',
    endLabel: 'Aug 2026',
    summary:
      'Progressed into frontend delivery leadership across live SaaS, AI, analytics, creator-economy, and client platforms while remaining hands-on in the code.',
    highlights: [
      'Owned frontend delivery planning, implementation, pull-request reviews, release coordination, and production follow-through across multiple client products.',
      'Coordinated API requirements and priorities directly with backend developers, designers, product owners, and client stakeholders.',
      'Strengthened the shared Nuxt starter and built new frontend foundations with reusable wrappers, scalable interface patterns, and repeatable delivery workflows.',
      'Refactored and extended established live SaaS products while supporting releases, integrations, and production issues.',
      'Delivered onboarding, verification, localization, dynamic forms, financial reporting, and role-based access across complex operational workflows.',
      'Built financial analysis and account-structure interfaces, and evaluated rendering strategies for large data-heavy tables.',
      'Delivered creator-facing web experiences with custom JavaScript, CMS architecture, experiments, forms, and workflow automation.',
    ],
    technologies: [
      'Nuxt 4',
      'Vue 3',
      'TypeScript',
      'Pinia',
      'React',
      'Next.js',
      'REST APIs',
      'i18n',
      'Webflow',
      'WordPress',
    ],
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
      'Created reusable React components and complete business workflows using class-based and functional components.',
    ],
    technologies: ['React', 'JavaScript', 'REST APIs', 'Postman', 'Data tables'],
  },
]
