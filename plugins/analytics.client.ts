import { defineNuxtPlugin, useRouter, useRuntimeConfig } from '#imports'

type GoogleAnalyticsEventName = 'page_view' | 'site_click' | 'form_submit' | 'page_engagement'

interface TrackedElement {
  tag: string
  id: string
  label: string
  href: string
  linkDomain: string
  role: string
  isOutbound: boolean
}

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

const OPT_OUT_STORAGE_KEY = 'portfolio:google-analytics:opt-out'
const OPT_OUT_QUERY_PARAM = 'analytics_opt_out'
const OPT_IN_QUERY_PARAM = 'analytics_opt_in'
const MAX_TEXT_LENGTH = 180
const MAX_URL_LENGTH = 500
const SCROLL_THROTTLE_MS = 250
const MIN_ENGAGEMENT_MS = 1_000

const isTruthy = (value: unknown): boolean =>
  value === true || value === 'true' || value === '1' || value === 'yes'

const safeText = (value: unknown, maxLength = MAX_TEXT_LENGTH): string => {
  if (typeof value !== 'string') {
    return ''
  }

  return value.replace(/\s+/g, ' ').trim().slice(0, maxLength)
}

const getCurrentPath = (): string =>
  `${window.location.pathname}${window.location.search}${window.location.hash}`

const getScrollDepth = (): number => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop || 0
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0
  const documentHeight = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight,
    viewportHeight,
  )

  if (documentHeight <= viewportHeight) {
    return 100
  }

  return Math.min(100, Math.round(((scrollTop + viewportHeight) / documentHeight) * 100))
}

const applyAnalyticsPreferenceFromUrl = (): void => {
  const url = new URL(window.location.href)
  const shouldOptOut = isTruthy(url.searchParams.get(OPT_OUT_QUERY_PARAM))
  const shouldOptIn = isTruthy(url.searchParams.get(OPT_IN_QUERY_PARAM))

  if (!shouldOptOut && !shouldOptIn) {
    return
  }

  if (shouldOptOut) {
    localStorage.setItem(OPT_OUT_STORAGE_KEY, 'true')
  } else {
    localStorage.removeItem(OPT_OUT_STORAGE_KEY)
  }

  url.searchParams.delete(OPT_OUT_QUERY_PARAM)
  url.searchParams.delete(OPT_IN_QUERY_PARAM)
  window.history.replaceState(
    window.history.state,
    document.title,
    `${url.pathname}${url.search}${url.hash}`,
  )
}

const isPrivacyControlEnabled = (): boolean => {
  const globalPrivacyControl = Boolean(
    (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl,
  )

  return (
    navigator.doNotTrack === '1' ||
    navigator.doNotTrack === 'yes' ||
    (window as Window & { doNotTrack?: string }).doNotTrack === '1' ||
    globalPrivacyControl ||
    localStorage.getItem(OPT_OUT_STORAGE_KEY) === 'true'
  )
}

const getTrackedElement = (element: Element): TrackedElement => {
  const anchor = element instanceof HTMLAnchorElement ? element : element.closest('a')
  const input = element instanceof HTMLInputElement ? element : null
  const href = anchor?.href || ''
  const label =
    element.getAttribute('data-analytics-label') ||
    element.getAttribute('aria-label') ||
    element.getAttribute('title') ||
    (input && ['button', 'submit', 'reset'].includes(input.type) ? input.value : '') ||
    element.textContent ||
    href
  let linkDomain = ''
  let isOutbound = false

  if (href) {
    try {
      const targetUrl = new URL(href, window.location.href)
      linkDomain = targetUrl.hostname
      isOutbound =
        targetUrl.protocol === 'mailto:' ||
        targetUrl.protocol === 'tel:' ||
        targetUrl.origin !== window.location.origin
    } catch {
      linkDomain = ''
    }
  }

  return {
    tag: element.tagName.toLowerCase(),
    id: safeText(element.id),
    label: safeText(label),
    href: safeText(href, MAX_URL_LENGTH),
    linkDomain: safeText(linkDomain),
    role: safeText(element.getAttribute('role') || ''),
    isOutbound,
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const router = useRouter()
  const measurementId = config.public.googleAnalyticsId

  applyAnalyticsPreferenceFromUrl()

  if (typeof measurementId !== 'string' || !measurementId.trim() || isPrivacyControlEnabled()) {
    return
  }

  const googleAnalyticsId = measurementId.trim()
  let isInstalled = false
  let lastTrackedPath = ''
  let pageStartedAt = Date.now()
  let maxScrollDepth = getScrollDepth()
  let lastScrollCheck = 0

  const installGoogleAnalytics = (): void => {
    if (isInstalled) {
      return
    }

    isInstalled = true
    window.dataLayer = window.dataLayer || []
    window.gtag =
      window.gtag ||
      function gtag(...args: unknown[]) {
        window.dataLayer?.push(args)
      }

    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(googleAnalyticsId)}`
    document.head.appendChild(script)

    window.gtag('js', new Date())
    window.gtag('config', googleAnalyticsId, {
      anonymize_ip: true,
      send_page_view: false,
      transport_type: 'beacon',
    })
  }

  const trackEvent = (
    eventName: GoogleAnalyticsEventName,
    parameters: Record<string, unknown>,
  ): void => {
    installGoogleAnalytics()
    window.gtag?.('event', eventName, parameters)
  }

  const trackPageView = (previousPath = ''): void => {
    const currentPath = getCurrentPath()

    if (lastTrackedPath === currentPath) {
      return
    }

    lastTrackedPath = currentPath
    pageStartedAt = Date.now()
    maxScrollDepth = getScrollDepth()

    trackEvent('page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: currentPath,
      previous_path: previousPath,
    })
  }

  const trackClick = (event: MouseEvent): void => {
    const target = event.target instanceof Element ? event.target : null
    const element = target?.closest(
      'a, button, [role="button"], input[type="button"], input[type="submit"], input[type="reset"]',
    )

    if (!element || element.closest('[data-analytics-ignore]')) {
      return
    }

    const trackedElement = getTrackedElement(element)

    trackEvent('site_click', {
      event_category: trackedElement.isOutbound ? 'outbound' : 'interaction',
      event_label: trackedElement.label,
      link_url: trackedElement.href,
      link_domain: trackedElement.linkDomain,
      outbound: trackedElement.isOutbound,
      element_tag: trackedElement.tag,
      element_id: trackedElement.id,
      element_role: trackedElement.role,
      page_path: getCurrentPath(),
    })
  }

  const trackFormSubmit = (event: SubmitEvent): void => {
    const form = event.target instanceof HTMLFormElement ? event.target : null

    if (!form || form.closest('[data-analytics-ignore]')) {
      return
    }

    trackEvent('form_submit', {
      form_id: safeText(form.id),
      form_name: safeText(form.getAttribute('name') || ''),
      form_destination: safeText(form.action, MAX_URL_LENGTH),
      form_method: safeText(form.method),
      form_label: safeText(
        form.getAttribute('data-analytics-label') ||
          form.getAttribute('aria-label') ||
          form.id ||
          'form',
      ),
      page_path: getCurrentPath(),
    })
  }

  const trackEngagement = (): void => {
    if (!lastTrackedPath) {
      return
    }

    const timeOnPageMs = Math.max(0, Date.now() - pageStartedAt)

    if (timeOnPageMs < MIN_ENGAGEMENT_MS) {
      return
    }

    trackEvent('page_engagement', {
      engagement_time_msec: timeOnPageMs,
      max_scroll_depth: maxScrollDepth,
      page_path: lastTrackedPath,
    })

    pageStartedAt = Date.now()
    maxScrollDepth = getScrollDepth()
  }

  const updateScrollDepth = (): void => {
    const now = Date.now()

    if (now - lastScrollCheck < SCROLL_THROTTLE_MS) {
      return
    }

    lastScrollCheck = now
    maxScrollDepth = Math.max(maxScrollDepth, getScrollDepth())
  }

  const handleVisibilityChange = (): void => {
    if (document.visibilityState === 'hidden') {
      trackEngagement()
    }
  }

  const removeRouterHook = router.afterEach((to, from) => {
    trackEngagement()

    window.setTimeout(() => {
      trackPageView(from.fullPath || '')
    }, 0)
  })

  document.addEventListener('click', trackClick, true)
  document.addEventListener('submit', trackFormSubmit, true)
  document.addEventListener('visibilitychange', handleVisibilityChange)
  window.addEventListener('scroll', updateScrollDepth, { passive: true })
  window.addEventListener('pagehide', trackEngagement)

  nuxtApp.hook('app:mounted', () => {
    installGoogleAnalytics()
    trackPageView()
  })

  const cleanup = (): void => {
    removeRouterHook()
    document.removeEventListener('click', trackClick, true)
    document.removeEventListener('submit', trackFormSubmit, true)
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    window.removeEventListener('scroll', updateScrollDepth)
    window.removeEventListener('pagehide', trackEngagement)
  }

  if (import.meta.hot) {
    import.meta.hot.dispose(cleanup)
  }
})
