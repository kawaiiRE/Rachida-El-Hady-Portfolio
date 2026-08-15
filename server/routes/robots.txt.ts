export default defineEventHandler((event) => {
  const runtimeConfig = useRuntimeConfig(event)
  const siteUrl = String(runtimeConfig.public.siteUrl || 'https://rachida.dev').replace(/\/$/, '')

  setResponseHeader(event, 'content-type', 'text/plain; charset=utf-8')
  setResponseHeader(event, 'cache-control', 'public, max-age=3600, s-maxage=86400')

  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /analytics',
    `Sitemap: ${siteUrl}/sitemap.xml`,
  ].join('\n')
})
