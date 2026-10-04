import { PROJECTS } from '~/constants/projects'
import { APP_ROUTES } from '~/constants/routes'
import { SITE_IDENTITY } from '~/constants/site'

const escapeXml = (value: string): string =>
  value.replace(/[<>&"']/g, (character) => {
    const entities: Record<string, string> = {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      '"': '&quot;',
      "'": '&apos;',
    }
    return entities[character]!
  })

export default defineEventHandler((event) => {
  const siteUrl = String(useRuntimeConfig(event).public.siteUrl || SITE_IDENTITY.url)
  const absoluteUrl = (path: string): string => escapeXml(new URL(path, siteUrl).href)
  const pages = [APP_ROUTES.HOME, APP_ROUTES.PROJECTS, APP_ROUTES.EXPERIENCE, APP_ROUTES.TYPING]
  const entries = [
    ...pages.map((path) => `<url><loc>${absoluteUrl(path)}</loc></url>`),
    ...PROJECTS.map((project) => {
      const images = [...new Set(project.images ?? [])]
        .map((image) => `<image:image><image:loc>${absoluteUrl(image)}</image:loc></image:image>`)
        .join('')
      return `<url><loc>${absoluteUrl(project.path)}</loc>${images}</url>`
    }),
  ]

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${entries.join('\n')}\n</urlset>`
})
