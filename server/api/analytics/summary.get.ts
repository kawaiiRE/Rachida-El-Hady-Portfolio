import { createError, defineEventHandler, getHeader, getQuery } from 'h3'
import { readAnalyticsRecords } from '../../utils/analytics-storage'

type AnalyticsRecord = {
  eventName?: string
  request?: {
    geo?: {
      precision?: string
      countryCode?: string
      country?: string
      region?: string
      city?: string
      provider?: string
    }
  }
  payload?: {
    visitor?: {
      visitorId?: string
      sessionId?: string
    }
    page?: {
      path?: string
      utm?: {
        source?: string
        medium?: string
        campaign?: string
        content?: string
        term?: string
      }
    }
    click?: {
      label?: string
      href?: string
      tag?: string
      outbound?: boolean
    }
  }
}

type Counter = {
  events: number
  pageViews: number
  clicks: number
  formSubmits: number
  visitors: Set<string>
}

const createCounter = (): Counter => ({
  events: 0,
  pageViews: 0,
  clicks: 0,
  formSubmits: 0,
  visitors: new Set<string>(),
})

const parseLimit = (value: unknown): number => {
  const limit = Number(value)

  if (!Number.isFinite(limit)) {
    return 10_000
  }

  return Math.min(50_000, Math.max(1, Math.round(limit)))
}

const getRequestToken = (event: Parameters<typeof getHeader>[0]): string => {
  const query = getQuery(event)

  return String(query.token || '') || String(getHeader(event, 'x-analytics-admin-token') || '')
}

const assertAuthorized = (event: Parameters<typeof getHeader>[0]) => {
  const runtimeConfig = useRuntimeConfig()
  const adminToken = String(runtimeConfig.analyticsAdminToken || '')

  if (!adminToken) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Analytics summary is not enabled.',
    })
  }

  if (getRequestToken(event) !== adminToken) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Analytics summary token is invalid.',
    })
  }

  return runtimeConfig
}

const normalizeKeyPart = (value: unknown, fallback = 'unknown'): string => {
  const normalized = String(value || '').trim()

  return normalized || fallback
}

const getLocationKey = (record: AnalyticsRecord): string => {
  const geo = record.request?.geo || {}

  return [
    normalizeKeyPart(geo.city),
    normalizeKeyPart(geo.region),
    normalizeKeyPart(geo.countryCode || geo.country),
  ].join('|')
}

const getCampaignKey = (record: AnalyticsRecord): string => {
  const utm = record.payload?.page?.utm || {}

  return [
    normalizeKeyPart(utm.source),
    normalizeKeyPart(utm.medium),
    normalizeKeyPart(utm.campaign),
    normalizeKeyPart(utm.content),
  ].join('|')
}

const getClickKey = (record: AnalyticsRecord): string => {
  const click = record.payload?.click || {}

  return [
    normalizeKeyPart(click.label),
    normalizeKeyPart(click.href),
    normalizeKeyPart(record.payload?.page?.path),
  ].join('|')
}

const addRecordToCounter = (counter: Counter, record: AnalyticsRecord) => {
  counter.events += 1

  if (record.eventName === 'page_view') counter.pageViews += 1
  if (record.eventName === 'site_click') counter.clicks += 1
  if (record.eventName === 'form_submit') counter.formSubmits += 1

  const visitorId = record.payload?.visitor?.visitorId

  if (visitorId) {
    counter.visitors.add(visitorId)
  }
}

const serializeCounter = (counter: Counter) => ({
  events: counter.events,
  uniqueVisitors: counter.visitors.size,
  pageViews: counter.pageViews,
  clicks: counter.clicks,
  formSubmits: counter.formSubmits,
})

const sortCounters = <T extends { stats: ReturnType<typeof serializeCounter> }>(items: T[]) =>
  items.sort((first, second) => {
    if (second.stats.uniqueVisitors !== first.stats.uniqueVisitors) {
      return second.stats.uniqueVisitors - first.stats.uniqueVisitors
    }

    return second.stats.events - first.stats.events
  })

export default defineEventHandler(async (event) => {
  const runtimeConfig = assertAuthorized(event)
  const query = getQuery(event)
  const limit = parseLimit(query.limit)
  const { records, storage } = await readAnalyticsRecords(event, {
    d1BindingName: String(runtimeConfig.analyticsD1Binding || ''),
    logPath: String(runtimeConfig.analyticsLogPath || ''),
    limit,
  })
  const total = createCounter()
  const locations = new Map<string, Counter>()
  const campaigns = new Map<string, Counter>()
  const campaignLocations = new Map<string, Counter>()
  const clicks = new Map<string, Counter>()
  const precision = new Map<string, Counter>()
  const providers = new Map<string, Counter>()

  for (const record of records as AnalyticsRecord[]) {
    const locationKey = getLocationKey(record)
    const campaignKey = getCampaignKey(record)
    const campaignLocationKey = `${campaignKey}|${locationKey}`
    const precisionKey = normalizeKeyPart(record.request?.geo?.precision)
    const providerKey = normalizeKeyPart(record.request?.geo?.provider)

    addRecordToCounter(total, record)

    for (const [key, map] of [
      [locationKey, locations],
      [campaignKey, campaigns],
      [campaignLocationKey, campaignLocations],
      [precisionKey, precision],
      [providerKey, providers],
    ] as const) {
      const counter = map.get(key) || createCounter()
      addRecordToCounter(counter, record)
      map.set(key, counter)
    }

    if (record.eventName === 'site_click') {
      const clickKey = getClickKey(record)
      const counter = clicks.get(clickKey) || createCounter()
      addRecordToCounter(counter, record)
      clicks.set(clickKey, counter)
    }
  }

  const byLocation = sortCounters(
    [...locations.entries()].map(([key, stats]) => {
      const [city, region, countryCode] = key.split('|')

      return {
        city,
        region,
        countryCode,
        stats: serializeCounter(stats),
      }
    }),
  )
  const byCampaign = sortCounters(
    [...campaigns.entries()].map(([key, stats]) => {
      const [source, medium, campaign, content] = key.split('|')

      return {
        source,
        medium,
        campaign,
        content,
        stats: serializeCounter(stats),
      }
    }),
  )
  const byCampaignLocation = sortCounters(
    [...campaignLocations.entries()].map(([key, stats]) => {
      const [source, medium, campaign, content, city, region, countryCode] = key.split('|')

      return {
        source,
        medium,
        campaign,
        content,
        city,
        region,
        countryCode,
        stats: serializeCounter(stats),
      }
    }),
  )
  const topClicks = sortCounters(
    [...clicks.entries()].map(([key, stats]) => {
      const [label, href, path] = key.split('|')

      return {
        label,
        href,
        path,
        stats: serializeCounter(stats),
      }
    }),
  )

  return {
    generatedAt: new Date().toISOString(),
    storage,
    scannedEvents: records.length,
    stats: serializeCounter(total),
    lebanonCities: byLocation.filter((item) => item.countryCode === 'LB'),
    byLocation,
    byCampaign,
    byCampaignLocation,
    topClicks,
    precision: sortCounters(
      [...precision.entries()].map(([name, stats]) => ({ name, stats: serializeCounter(stats) })),
    ),
    providers: sortCounters(
      [...providers.entries()].map(([name, stats]) => ({ name, stats: serializeCounter(stats) })),
    ),
  }
})
