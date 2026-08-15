import { useHead, useRuntimeConfig, useServerSeoMeta } from '#imports'

interface PageSeoOptions {
  title: string
  description: string
  path: string
  image?: string
  type?: 'website' | 'profile'
  structuredData?: Record<string, unknown> | Array<Record<string, unknown>>
}

const toAbsoluteUrl = (siteUrl: string, path: string): string => {
  if (/^https?:\/\//.test(path)) return path
  return `${siteUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}

export const usePageSeo = (options: PageSeoOptions): void => {
  const runtimeConfig = useRuntimeConfig()
  const siteUrl = String(runtimeConfig.public.siteUrl || 'https://rachida.dev').replace(/\/$/, '')
  const canonicalUrl = toAbsoluteUrl(siteUrl, options.path)
  const imageUrl = toAbsoluteUrl(siteUrl, options.image || '/images/char-sitting-with-laptop.avif')
  const fullTitle = options.title.includes('Rachida El Hady')
    ? options.title
    : `${options.title} | Rachida El Hady`

  useServerSeoMeta({
    title: fullTitle,
    description: options.description,
    robots: 'index,follow,max-image-preview:large',
    ogType: options.type || 'website',
    ogSiteName: 'Rachida El Hady',
    ogUrl: canonicalUrl,
    ogTitle: fullTitle,
    ogDescription: options.description,
    ogImage: imageUrl,
    ogImageAlt: options.title,
    twitterCard: 'summary_large_image',
    twitterTitle: fullTitle,
    twitterDescription: options.description,
    twitterImage: imageUrl,
  })

  useHead({
    link: [{ key: 'canonical', rel: 'canonical', href: canonicalUrl }],
    script: options.structuredData
      ? [
          {
            key: `structured-data-${options.path}`,
            type: 'application/ld+json',
            innerHTML: JSON.stringify(options.structuredData).replace(/</g, '\\u003c'),
          },
        ]
      : [],
  })
}
