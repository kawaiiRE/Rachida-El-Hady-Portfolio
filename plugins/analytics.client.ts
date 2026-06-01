import { defineNuxtPlugin, useRouter, useRuntimeConfig } from '#imports'

type AnalyticsEventName = 'page_view' | 'site_click' | 'form_submit' | 'page_engagement'

interface AnalyticsElementPayload {
  tag: string
  id: string
  classes: string[]
  label: string
  href: string
  target: string
  role: string
  ariaLabel: string
  title: string
  name: string
  value: string
  isOutbound: boolean
}

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

const VISITOR_STORAGE_KEY = 'portfolio:analytics:visitor-id'
const SESSION_STORAGE_KEY = 'portfolio:analytics:session-id'
const SESSION_STARTED_AT_KEY = 'portfolio:analytics:session-started-at'
const OPT_OUT_STORAGE_KEY = 'portfolio:analytics:opt-out'
const MAX_TEXT_LENGTH = 180
const SCROLL_THROTTLE_MS = 250

const isTruthy = (value: unknown): boolean =>
  value === true || value === 'true' || value === '1' || value === 'yes'

const safeText = (value: unknown, maxLength = MAX_TEXT_LENGTH): string => {
  if (typeof value !== 'string') return ''

  return value.replace(/\s+/g, ' ').trim().slice(0, maxLength)
}

const createId = (prefix: string): string => {
  const randomId =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`

  return `${prefix}_${randomId}`
}

const readOrCreateStorageId = (storage: Storage, key: string, prefix: string): string => {
  const existingId = storage.getItem(key)

  if (existingId) {
    return existingId
  }

  const nextId = createId(prefix)
  storage.setItem(key, nextId)

  return nextId
}

const getConnectionPayload = () => {
  const connection = (
    navigator as Navigator & {
      connection?: {
        effectiveType?: string
        downlink?: number
        rtt?: number
        saveData?: boolean
      }
    }
  ).connection

  if (!connection) {
    return null
  }

  return {
    effectiveType: connection.effectiveType || '',
    downlink: typeof connection.downlink === 'number' ? connection.downlink : null,
    rtt: typeof connection.rtt === 'number' ? connection.rtt : null,
    saveData: Boolean(connection.saveData),
  }
}

const getUtmPayload = () => {
  const params = new URLSearchParams(window.location.search)

  return {
    source: safeText(params.get('utm_source') || ''),
    medium: safeText(params.get('utm_medium') || ''),
    campaign: safeText(params.get('utm_campaign') || ''),
    term: safeText(params.get('utm_term') || ''),
    content: safeText(params.get('utm_content') || ''),
  }
}

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

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const router = useRouter()
  const analyticsEnabled = isTruthy(config.public.analyticsEnabled)
  const analyticsEndpoint = String(config.public.analyticsEndpoint || '/api/analytics/event')
  const googleAnalyticsId = String(config.public.googleAnalyticsId || '')

  const globalPrivacyControl = Boolean(
    (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl,
  )
  const doNotTrackEnabled =
    navigator.doNotTrack === '1' ||
    window.doNotTrack === '1' ||
    navigator.doNotTrack === 'yes' ||
    globalPrivacyControl

  const optedOut = localStorage.getItem(OPT_OUT_STORAGE_KEY) === 'true'

  if (!analyticsEnabled || doNotTrackEnabled || optedOut) {
    return
  }

  const visitorId = readOrCreateStorageId(localStorage, VISITOR_STORAGE_KEY, 'visitor')
  const sessionId = readOrCreateStorageId(sessionStorage, SESSION_STORAGE_KEY, 'session')

  if (!sessionStorage.getItem(SESSION_STARTED_AT_KEY)) {
    sessionStorage.setItem(SESSION_STARTED_AT_KEY, new Date().toISOString())
  }

  const pageStartedAt = { value: Date.now() }
  const maxScrollDepth = { value: getScrollDepth() }
  let lastTrackedPath = ''
  let lastScrollCheck = 0
  let googleAnalyticsLoaded = false

  const installGoogleAnalytics = () => {
    if (!googleAnalyticsId || googleAnalyticsLoaded) {
      return
    }

    googleAnalyticsLoaded = true
    window.dataLayer = window.dataLayer || []
    window.gtag =
      window.gtag ||
      function gtag(...args: unknown[]) {
        window.dataLayer?.push(args)
      }

    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
      googleAnalyticsId,
    )}`
    document.head.appendChild(script)

    window.gtag('js', new Date())
    window.gtag('config', googleAnalyticsId, {
      anonymize_ip: true,
      send_page_view: false,
    })
  }

  const getBasePayload = (eventName: AnalyticsEventName) => ({
    schemaVersion: 1,
    eventId: createId('event'),
    eventName,
    occurredAt: new Date().toISOString(),
    visitor: {
      visitorId,
      sessionId,
      sessionStartedAt: sessionStorage.getItem(SESSION_STARTED_AT_KEY) || '',
    },
    page: {
      title: safeText(document.title),
      path: window.location.pathname,
      fullPath: `${window.location.pathname}${window.location.search}${window.location.hash}`,
      url: window.location.href,
      referrer: document.referrer,
      hash: window.location.hash,
      utm: getUtmPayload(),
    },
    environment: {
      language: navigator.language,
      languages: Array.from(navigator.languages || []),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timezoneOffset: new Date().getTimezoneOffset(),
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      screen: {
        width: window.screen.width,
        height: window.screen.height,
        colorDepth: window.screen.colorDepth,
        pixelRatio: window.devicePixelRatio,
      },
      hardwareConcurrency: navigator.hardwareConcurrency || null,
      deviceMemory: (navigator as Navigator & { deviceMemory?: number }).deviceMemory || null,
      connection: getConnectionPayload(),
      prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      prefersDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
      touchPoints: navigator.maxTouchPoints || 0,
    },
  })

  const postAnalyticsEvent = (payload: Record<string, unknown>) => {
    const body = JSON.stringify(payload)

    if (navigator.sendBeacon) {
      const didQueue = navigator.sendBeacon(
        analyticsEndpoint,
        new Blob([body], { type: 'application/json' }),
      )

      if (didQueue) {
        return
      }
    }

    fetch(analyticsEndpoint, {
      method: 'POST',
      body,
      headers: {
        'content-type': 'application/json',
      },
      keepalive: true,
    }).catch(() => {})
  }

  const trackGoogleEvent = (eventName: AnalyticsEventName, params: Record<string, unknown>) => {
    installGoogleAnalytics()

    if (!window.gtag) {
      return
    }

    window.gtag('event', eventName, params)
  }

  const trackPageView = (previousPath = '') => {
    const fullPath = `${window.location.pathname}${window.location.search}${window.location.hash}`

    if (lastTrackedPath === fullPath) {
      return
    }

    pageStartedAt.value = Date.now()
    maxScrollDepth.value = getScrollDepth()
    lastTrackedPath = fullPath

    const payload = {
      ...getBasePayload('page_view'),
      navigation: {
        previousPath,
      },
    }

    postAnalyticsEvent(payload)
    trackGoogleEvent('page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: fullPath,
      previous_path: previousPath,
      visitor_id: visitorId,
      session_id: sessionId,
    })
  }

  const buildElementPayload = (element: Element): AnalyticsElementPayload => {
    const anchor = element instanceof HTMLAnchorElement ? element : element.closest('a')
    const input = element instanceof HTMLInputElement ? element : null
    const href = anchor?.href || ''
    const label =
      element.getAttribute('data-analytics-label') ||
      element.getAttribute('aria-label') ||
      element.getAttribute('title') ||
      input?.value ||
      element.textContent ||
      href
    let isOutbound = false

    if (href) {
      try {
        const targetUrl = new URL(href, window.location.href)
        isOutbound =
          targetUrl.protocol === 'mailto:' ||
          targetUrl.protocol === 'tel:' ||
          targetUrl.origin !== window.location.origin
      } catch {
        isOutbound = false
      }
    }

    return {
      tag: element.tagName.toLowerCase(),
      id: safeText(element.id),
      classes: Array.from(element.classList).slice(0, 8),
      label: safeText(label),
      href: safeText(href, 500),
      target: safeText(anchor?.target || ''),
      role: safeText(element.getAttribute('role') || ''),
      ariaLabel: safeText(element.getAttribute('aria-label') || ''),
      title: safeText(element.getAttribute('title') || ''),
      name: safeText(input?.name || element.getAttribute('name') || ''),
      value: safeText(input?.type === 'submit' || input?.type === 'button' ? input.value : ''),
      isOutbound,
    }
  }

  const trackClick = (event: MouseEvent) => {
    const target = event.target instanceof Element ? event.target : null
    const element = target?.closest(
      'a, button, [role="button"], input[type="button"], input[type="submit"], input[type="reset"]',
    )

    if (!element || element.closest('[data-analytics-ignore]')) {
      return
    }

    const elementPayload = buildElementPayload(element)
    const payload = {
      ...getBasePayload('site_click'),
      click: {
        ...elementPayload,
        x: event.clientX,
        y: event.clientY,
      },
    }

    postAnalyticsEvent(payload)
    trackGoogleEvent('site_click', {
      event_category: elementPayload.isOutbound ? 'outbound' : 'interaction',
      event_label: elementPayload.label,
      link_url: elementPayload.href,
      element_tag: elementPayload.tag,
      page_path: window.location.pathname,
      visitor_id: visitorId,
      session_id: sessionId,
    })
  }

  const trackFormSubmit = (event: SubmitEvent) => {
    const form = event.target instanceof HTMLFormElement ? event.target : null

    if (!form || form.closest('[data-analytics-ignore]')) {
      return
    }

    const payload = {
      ...getBasePayload('form_submit'),
      form: {
        id: safeText(form.id),
        name: safeText(form.getAttribute('name') || ''),
        action: safeText(form.action, 500),
        method: safeText(form.method),
        label: safeText(
          form.getAttribute('data-analytics-label') ||
            form.getAttribute('aria-label') ||
            form.id ||
            'form',
        ),
      },
    }

    postAnalyticsEvent(payload)
    trackGoogleEvent('form_submit', {
      event_category: 'form',
      event_label: payload.form.label,
      page_path: window.location.pathname,
      visitor_id: visitorId,
      session_id: sessionId,
    })
  }

  const trackEngagement = () => {
    const timeOnPageMs = Math.max(0, Date.now() - pageStartedAt.value)

    if (timeOnPageMs < 1000) {
      return
    }

    const payload = {
      ...getBasePayload('page_engagement'),
      engagement: {
        timeOnPageMs,
        maxScrollDepth: maxScrollDepth.value,
      },
    }

    postAnalyticsEvent(payload)
    trackGoogleEvent('page_engagement', {
      engagement_time_msec: timeOnPageMs,
      max_scroll_depth: maxScrollDepth.value,
      page_path: window.location.pathname,
      visitor_id: visitorId,
      session_id: sessionId,
    })
  }

  const updateScrollDepth = () => {
    const now = Date.now()

    if (now - lastScrollCheck < SCROLL_THROTTLE_MS) {
      return
    }

    lastScrollCheck = now
    maxScrollDepth.value = Math.max(maxScrollDepth.value, getScrollDepth())
  }

  nuxtApp.hook('app:mounted', () => {
    installGoogleAnalytics()
    trackPageView()
  })

  router.afterEach((to, from) => {
    window.setTimeout(() => {
      trackPageView(from.fullPath || '')
    }, 0)
  })

  document.addEventListener('click', trackClick, true)
  document.addEventListener('submit', trackFormSubmit, true)
  window.addEventListener('scroll', updateScrollDepth, { passive: true })
  window.addEventListener('pagehide', trackEngagement)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      trackEngagement()
    }
  })
})
