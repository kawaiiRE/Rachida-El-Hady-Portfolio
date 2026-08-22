import { PROJECTS } from '~/constants/projects'
import { APP_ROUTES } from '~/constants/routes'

interface SitemapEntry {
  path: string
  changeFrequency: 'monthly' | 'weekly'
  priority: string
}

const escapeXml = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export default defineEventHandler((event) => {
  const runtimeConfig = useRuntimeConfig(event)
  const siteUrl = String(runtimeConfig.public.siteUrl || 'https://rachida.dev').replace(/\/$/, '')
  const entries: SitemapEntry[] = [
    { path: APP_ROUTES.HOME, changeFrequency: 'monthly', priority: '1.0' },
    { path: APP_ROUTES.PROJECTS, changeFrequency: 'monthly', priority: '0.9' },
    { path: APP_ROUTES.EXPERIENCE, changeFrequency: 'monthly', priority: '0.9' },
    { path: APP_ROUTES.TYPING, changeFrequency: 'monthly', priority: '0.8' },
    ...PROJECTS.map((project) => ({
      path: project.path,
      changeFrequency: 'monthly' as const,
      priority: '0.8',
    })),
  ]
  const urls = entries
    .map(
      (entry) => `  <url>
    <loc>${escapeXml(`${siteUrl}${entry.path}`)}</loc>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`,
    )
    .join('\n')

  setResponseHeader(event, 'content-type', 'application/xml; charset=utf-8')
  setResponseHeader(event, 'cache-control', 'public, max-age=3600, s-maxage=86400')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`
})
