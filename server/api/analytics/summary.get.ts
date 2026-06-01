import { createError, defineEventHandler, getHeader, getQuery } from 'h3'
import type { AnalyticsRecord } from '../../utils/analytics-storage'
import { readAnalyticsRecords } from '../../utils/analytics-storage'
import {
  buildAnalyticsFilterOptions,
  filterAnalyticsRecords,
  getAnalyticsCampaignKey,
  getAnalyticsClickKey,
  getAnalyticsFacts,
  getAnalyticsGeoQualityKey,
  getAnalyticsLocationKey,
  getAnalyticsPreciseLocationKey,
  parseAnalyticsFilters,
  parseAnalyticsLimit,
} from '../../utils/analytics-report'

type Counter = {
  events: number
  pageViews: number
  clicks: number
  formSubmits: number
  engagements: number
  visitors: Set<string>
  sessions: Set<string>
  engagementSeconds: number
  engagementSamples: number
  scrollDepth: number
  scrollSamples: number
}

const createCounter = (): Counter => ({
  events: 0,
  pageViews: 0,
  clicks: 0,
  formSubmits: 0,
  engagements: 0,
  visitors: new Set<string>(),
  sessions: new Set<string>(),
  engagementSeconds: 0,
  engagementSamples: 0,
  scrollDepth: 0,
  scrollSamples: 0,
})

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

const addRecordToCounter = (counter: Counter, record: AnalyticsRecord) => {
  const facts = getAnalyticsFacts(record)

  counter.events += 1

  if (facts.eventName === 'page_view') counter.pageViews += 1
  if (facts.eventName === 'site_click') counter.clicks += 1
  if (facts.eventName === 'form_submit') counter.formSubmits += 1
  if (facts.eventName === 'page_engagement') counter.engagements += 1

  if (facts.visitorId) counter.visitors.add(facts.visitorId)
  if (facts.sessionId) counter.sessions.add(facts.sessionId)

  if (facts.engagementSeconds) {
    counter.engagementSeconds += facts.engagementSeconds
    counter.engagementSamples += 1
  }

  if (facts.scrollDepth) {
    counter.scrollDepth += facts.scrollDepth
    counter.scrollSamples += 1
  }
}

const serializeCounter = (counter: Counter) => {
  const clickRate = counter.pageViews
    ? Math.round((counter.clicks / counter.pageViews) * 1000) / 10
    : 0

  return {
    events: counter.events,
    uniqueVisitors: counter.visitors.size,
    uniqueSessions: counter.sessions.size,
    pageViews: counter.pageViews,
    clicks: counter.clicks,
    formSubmits: counter.formSubmits,
    engagements: counter.engagements,
    avgEngagementSeconds: counter.engagementSamples
      ? Math.round(counter.engagementSeconds / counter.engagementSamples)
      : 0,
    avgScrollDepth: counter.scrollSamples
      ? Math.round(counter.scrollDepth / counter.scrollSamples)
      : 0,
    clickRate,
  }
}

const sortCounters = <T extends { stats: ReturnType<typeof serializeCounter> }>(items: T[]) =>
  items.sort((first, second) => {
    if (second.stats.uniqueVisitors !== first.stats.uniqueVisitors) {
      return second.stats.uniqueVisitors - first.stats.uniqueVisitors
    }

    if (second.stats.pageViews !== first.stats.pageViews) {
      return second.stats.pageViews - first.stats.pageViews
    }

    return second.stats.events - first.stats.events
  })

const addToMap = (map: Map<string, Counter>, key: string, record: AnalyticsRecord) => {
  const counter = map.get(key) || createCounter()

  addRecordToCounter(counter, record)
  map.set(key, counter)
}

const serializeNamedCounters = (map: Map<string, Counter>) =>
  sortCounters(
    [...map.entries()].map(([name, stats]) => ({
      name,
      stats: serializeCounter(stats),
    })),
  )

const parseNullableNumber = (value: string): number | null => {
  if (!value || value === 'unknown') {
    return null
  }

  const parsedValue = Number.parseFloat(value)

  return Number.isFinite(parsedValue) ? parsedValue : null
}

const getDayKey = (record: AnalyticsRecord): string => {
  const facts = getAnalyticsFacts(record)
  const date = new Date(facts.receivedAt)

  if (Number.isNaN(date.getTime())) {
    return 'unknown'
  }

  return date.toISOString().slice(0, 10)
}

const getHourKey = (record: AnalyticsRecord): string => {
  const facts = getAnalyticsFacts(record)
  const date = new Date(facts.receivedAt)

  if (Number.isNaN(date.getTime())) {
    return 'unknown'
  }

  return date.getUTCHours().toString().padStart(2, '0')
}

export default defineEventHandler(async (event) => {
  const runtimeConfig = assertAuthorized(event)
  const query = getQuery(event)
  const limit = parseAnalyticsLimit(query.limit, 10_000, 50_000)
  const filters = parseAnalyticsFilters(query)
  const { records, storage } = await readAnalyticsRecords(event, {
    d1BindingName: String(runtimeConfig.analyticsD1Binding || ''),
    logPath: String(runtimeConfig.analyticsLogPath || ''),
    limit,
  })
  const filteredRecords = filterAnalyticsRecords(records, filters)
  const total = createCounter()
  const locations = new Map<string, Counter>()
  const preciseLocations = new Map<string, Counter>()
  const campaigns = new Map<string, Counter>()
  const campaignLocations = new Map<string, Counter>()
  const clicks = new Map<string, Counter>()
  const precision = new Map<string, Counter>()
  const providers = new Map<string, Counter>()
  const geoQuality = new Map<string, Counter>()
  const pages = new Map<string, Counter>()
  const referrers = new Map<string, Counter>()
  const events = new Map<string, Counter>()
  const devices = new Map<string, Counter>()
  const languages = new Map<string, Counter>()
  const timeline = new Map<string, Counter>()
  const hours = new Map<string, Counter>()

  for (const record of filteredRecords) {
    const facts = getAnalyticsFacts(record)
    const locationKey = getAnalyticsLocationKey(record)
    const preciseLocationKey = getAnalyticsPreciseLocationKey(record)
    const campaignKey = getAnalyticsCampaignKey(record)
    const campaignLocationKey = `${campaignKey}|${locationKey}`

    addRecordToCounter(total, record)
    addToMap(locations, locationKey, record)
    addToMap(preciseLocations, preciseLocationKey, record)
    addToMap(campaigns, campaignKey, record)
    addToMap(campaignLocations, campaignLocationKey, record)
    addToMap(precision, normalizeKeyPart(facts.precision), record)
    addToMap(providers, normalizeKeyPart(facts.provider), record)
    addToMap(geoQuality, getAnalyticsGeoQualityKey(record), record)
    addToMap(pages, normalizeKeyPart(facts.pagePath), record)
    addToMap(referrers, normalizeKeyPart(facts.referrerHost, 'direct'), record)
    addToMap(events, normalizeKeyPart(facts.eventName), record)
    addToMap(devices, normalizeKeyPart(facts.device), record)
    addToMap(languages, normalizeKeyPart(facts.language), record)
    addToMap(timeline, getDayKey(record), record)
    addToMap(hours, getHourKey(record), record)

    if (facts.eventName === 'site_click') {
      addToMap(clicks, getAnalyticsClickKey(record), record)
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
  const byPreciseLocation = sortCounters(
    [...preciseLocations.entries()].map(([key, stats]) => {
      const [
        city,
        region,
        countryCode,
        postalCode,
        timezone,
        colo,
        latitude,
        longitude,
        provider,
        precisionLevel,
      ] = key.split('|')

      return {
        city,
        region,
        countryCode,
        postalCode,
        timezone,
        colo,
        latitude: parseNullableNumber(latitude),
        longitude: parseNullableNumber(longitude),
        provider,
        precision: precisionLevel,
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
  const byPage = sortCounters(
    [...pages.entries()].map(([path, stats]) => ({
      path,
      stats: serializeCounter(stats),
    })),
  )
  const byReferrer = sortCounters(
    [...referrers.entries()].map(([host, stats]) => ({
      host,
      stats: serializeCounter(stats),
    })),
  )
  const byDay = [...timeline.entries()]
    .map(([date, stats]) => ({ date, stats: serializeCounter(stats) }))
    .sort((first, second) => first.date.localeCompare(second.date))
  const byHour = [...hours.entries()]
    .map(([hour, stats]) => ({ hour, stats: serializeCounter(stats) }))
    .sort((first, second) => first.hour.localeCompare(second.hour))
  const byGeoQuality = sortCounters(
    [...geoQuality.entries()].map(([key, stats]) => {
      const [provider, precisionLevel, colo, postalStatus, coordinateStatus] = key.split('|')

      return {
        provider,
        precision: precisionLevel,
        colo,
        hasPostalCode: postalStatus === 'postal',
        hasCoordinates: coordinateStatus === 'coordinates',
        stats: serializeCounter(stats),
      }
    }),
  )

  return {
    generatedAt: new Date().toISOString(),
    storage,
    scannedEvents: records.length,
    matchedEvents: filteredRecords.length,
    filters,
    filterOptions: buildAnalyticsFilterOptions(records),
    stats: serializeCounter(total),
    lebanonCities: byLocation.filter((item) => item.countryCode === 'LB'),
    lebanonPreciseLocations: byPreciseLocation.filter((item) => item.countryCode === 'LB'),
    byLocation,
    byPreciseLocation,
    byCampaign,
    byCampaignLocation,
    topClicks,
    byPage,
    byReferrer,
    byEvent: serializeNamedCounters(events),
    byDevice: serializeNamedCounters(devices),
    byLanguage: serializeNamedCounters(languages),
    byDay,
    byHour,
    precision: serializeNamedCounters(precision),
    providers: serializeNamedCounters(providers),
    geoQuality: byGeoQuality,
  }
})
