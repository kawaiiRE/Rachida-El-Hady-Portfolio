import { createError, defineEventHandler, getHeader, getQuery } from 'h3'
import type { AnalyticsRecord } from '../../utils/analytics-storage'
import { readAnalyticsRecords } from '../../utils/analytics-storage'
import {
  buildAnalyticsFilterOptions,
  getAnalyticsAdTargetKey,
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

type SessionAccumulator = {
  sessionId: string
  visitorId: string
  firstSeen: string
  lastSeen: string
  firstTimestamp: number
  lastTimestamp: number
  city: string
  region: string
  countryCode: string
  postalCode: string
  colo: string
  accuracyMeters: number | null
  nearestLocalityDistanceKm: number | null
  precision: string
  provider: string
  device: string
  referrerHost: string
  source: string
  medium: string
  campaign: string
  adTargetCity: string
  adTargetRegion: string
  adTargetCountryCode: string
  adTargetArea: string
  adTargetAdSet: string
  entryPage: string
  exitPage: string
  pages: Set<string>
  counter: Counter
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
  const normalized = String(value ?? '').trim()

  return normalized && !['undefined', 'null'].includes(normalized.toLowerCase())
    ? normalized
    : fallback
}

const isKnownPart = (value: unknown): boolean => {
  const normalized = String(value ?? '')
    .trim()
    .toLowerCase()

  return Boolean(normalized && !['unknown', 'undefined', 'null'].includes(normalized))
}

const hasKnownGeoValue = (...values: unknown[]): boolean => values.some(isKnownPart)

const splitKeyParts = (key: string, length: number): string[] =>
  Array.from({ length }, (_, index) => normalizeKeyPart(key.split('|')[index]))

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
      name: normalizeKeyPart(name),
      stats: serializeCounter(stats),
    })),
  )

const getSessionKey = (record: AnalyticsRecord): string => {
  const facts = getAnalyticsFacts(record)

  return facts.sessionId || facts.visitorId || record.id
}

const createSessionAccumulator = (
  record: AnalyticsRecord,
  facts: ReturnType<typeof getAnalyticsFacts>,
): SessionAccumulator => ({
  sessionId: facts.sessionId || record.id,
  visitorId: facts.visitorId,
  firstSeen: facts.receivedAt,
  lastSeen: facts.receivedAt,
  firstTimestamp: facts.timestamp,
  lastTimestamp: facts.timestamp,
  city: facts.city,
  region: facts.region || facts.regionCode,
  countryCode: facts.countryCode || facts.country,
  postalCode: facts.postalCode,
  colo: facts.colo,
  accuracyMeters: facts.accuracyMeters,
  nearestLocalityDistanceKm: facts.nearestLocalityDistanceKm,
  precision: facts.precision,
  provider: facts.provider,
  device: facts.device,
  referrerHost: facts.referrerHost,
  source: facts.utmSource,
  medium: facts.utmMedium,
  campaign: facts.utmCampaign,
  adTargetCity: facts.adTargetCity,
  adTargetRegion: facts.adTargetRegion,
  adTargetCountryCode: facts.adTargetCountryCode || facts.adTargetCountry,
  adTargetArea: facts.adTargetArea,
  adTargetAdSet: facts.adTargetAdSet,
  entryPage: facts.pagePath,
  exitPage: facts.pagePath,
  pages: new Set<string>(),
  counter: createCounter(),
})

const addToSessions = (sessions: Map<string, SessionAccumulator>, record: AnalyticsRecord) => {
  const facts = getAnalyticsFacts(record)
  const key = getSessionKey(record)
  const session = sessions.get(key) || createSessionAccumulator(record, facts)

  addRecordToCounter(session.counter, record)

  if (facts.pagePath) {
    session.pages.add(facts.pagePath)
  }

  if (facts.timestamp && (!session.firstTimestamp || facts.timestamp < session.firstTimestamp)) {
    session.firstTimestamp = facts.timestamp
    session.firstSeen = facts.receivedAt
    session.entryPage = facts.pagePath || session.entryPage
  }

  if (facts.timestamp && facts.timestamp >= session.lastTimestamp) {
    session.lastTimestamp = facts.timestamp
    session.lastSeen = facts.receivedAt
    session.exitPage = facts.pagePath || session.exitPage
  }

  session.visitorId = session.visitorId || facts.visitorId
  session.city = session.city || facts.city
  session.region = session.region || facts.region || facts.regionCode
  session.countryCode = session.countryCode || facts.countryCode || facts.country
  session.postalCode = session.postalCode || facts.postalCode
  session.colo = session.colo || facts.colo
  session.accuracyMeters = session.accuracyMeters ?? facts.accuracyMeters
  session.nearestLocalityDistanceKm =
    session.nearestLocalityDistanceKm ?? facts.nearestLocalityDistanceKm
  session.precision = session.precision || facts.precision
  session.provider = session.provider || facts.provider
  session.device = session.device || facts.device
  session.referrerHost = session.referrerHost || facts.referrerHost
  session.source = session.source || facts.utmSource
  session.medium = session.medium || facts.utmMedium
  session.campaign = session.campaign || facts.utmCampaign
  session.adTargetCity = session.adTargetCity || facts.adTargetCity
  session.adTargetRegion = session.adTargetRegion || facts.adTargetRegion
  session.adTargetCountryCode =
    session.adTargetCountryCode || facts.adTargetCountryCode || facts.adTargetCountry
  session.adTargetArea = session.adTargetArea || facts.adTargetArea
  session.adTargetAdSet = session.adTargetAdSet || facts.adTargetAdSet

  sessions.set(key, session)
}

const serializeSession = (session: SessionAccumulator) => ({
  sessionId: normalizeKeyPart(session.sessionId),
  visitorId: normalizeKeyPart(session.visitorId),
  firstSeen: normalizeKeyPart(session.firstSeen),
  lastSeen: normalizeKeyPart(session.lastSeen),
  durationSeconds:
    session.firstTimestamp && session.lastTimestamp
      ? Math.max(0, Math.round((session.lastTimestamp - session.firstTimestamp) / 1000))
      : 0,
  city: normalizeKeyPart(session.city),
  region: normalizeKeyPart(session.region),
  countryCode: normalizeKeyPart(session.countryCode),
  postalCode: normalizeKeyPart(session.postalCode),
  colo: normalizeKeyPart(session.colo),
  accuracyMeters: session.accuracyMeters,
  nearestLocalityDistanceKm: session.nearestLocalityDistanceKm,
  precision: normalizeKeyPart(session.precision),
  provider: normalizeKeyPart(session.provider),
  device: normalizeKeyPart(session.device),
  referrerHost: normalizeKeyPart(session.referrerHost, 'direct'),
  source: normalizeKeyPart(session.source),
  medium: normalizeKeyPart(session.medium),
  campaign: normalizeKeyPart(session.campaign),
  adTargetCity: normalizeKeyPart(session.adTargetCity),
  adTargetRegion: normalizeKeyPart(session.adTargetRegion),
  adTargetCountryCode: normalizeKeyPart(session.adTargetCountryCode),
  adTargetArea: normalizeKeyPart(session.adTargetArea),
  adTargetAdSet: normalizeKeyPart(session.adTargetAdSet),
  entryPage: normalizeKeyPart(session.entryPage),
  exitPage: normalizeKeyPart(session.exitPage),
  pages: [...session.pages],
  stats: serializeCounter(session.counter),
})

const parseNullableNumber = (value: unknown): number | null => {
  if (!value || value === 'unknown') {
    return null
  }

  const parsedValue = Number.parseFloat(String(value))

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
  const countries = new Map<string, Counter>()
  const locations = new Map<string, Counter>()
  const preciseLocations = new Map<string, Counter>()
  const campaigns = new Map<string, Counter>()
  const campaignLocations = new Map<string, Counter>()
  const adTargets = new Map<string, Counter>()
  const campaignAdTargets = new Map<string, Counter>()
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
  const sessions = new Map<string, SessionAccumulator>()

  for (const record of filteredRecords) {
    const facts = getAnalyticsFacts(record)
    const countryKey = normalizeKeyPart(facts.countryCode || facts.country)
    const locationKey = getAnalyticsLocationKey(record)
    const preciseLocationKey = getAnalyticsPreciseLocationKey(record)
    const campaignKey = getAnalyticsCampaignKey(record)
    const campaignLocationKey = `${campaignKey}|${locationKey}`
    const adTargetKey = getAnalyticsAdTargetKey(record)
    const campaignAdTargetKey = `${campaignKey}|${adTargetKey}`
    const hasCountry = isKnownPart(facts.countryCode || facts.country)
    const hasLocation = hasKnownGeoValue(
      facts.city,
      facts.region,
      facts.regionCode,
      facts.countryCode,
      facts.country,
    )
    const hasPreciseLocation = hasKnownGeoValue(
      facts.city,
      facts.region,
      facts.regionCode,
      facts.postalCode,
      facts.timezone,
      facts.colo,
      facts.latitude,
      facts.longitude,
    )
    const hasAdTarget = hasKnownGeoValue(
      facts.adTargetCity,
      facts.adTargetRegion,
      facts.adTargetCountryCode,
      facts.adTargetCountry,
      facts.adTargetArea,
      facts.adTargetAdSet,
    )

    addRecordToCounter(total, record)
    if (hasCountry) addToMap(countries, countryKey, record)
    if (hasLocation) addToMap(locations, locationKey, record)
    if (hasPreciseLocation) addToMap(preciseLocations, preciseLocationKey, record)
    addToMap(campaigns, campaignKey, record)
    if (hasLocation) addToMap(campaignLocations, campaignLocationKey, record)
    if (hasAdTarget) {
      addToMap(adTargets, adTargetKey, record)
      addToMap(campaignAdTargets, campaignAdTargetKey, record)
    }
    addToMap(precision, normalizeKeyPart(facts.precision), record)
    if (isKnownPart(facts.provider)) addToMap(providers, normalizeKeyPart(facts.provider), record)
    addToMap(geoQuality, getAnalyticsGeoQualityKey(record), record)
    addToMap(pages, normalizeKeyPart(facts.pagePath), record)
    addToMap(referrers, normalizeKeyPart(facts.referrerHost, 'direct'), record)
    addToMap(events, normalizeKeyPart(facts.eventName), record)
    addToMap(devices, normalizeKeyPart(facts.device), record)
    addToMap(languages, normalizeKeyPart(facts.language), record)
    addToMap(timeline, getDayKey(record), record)
    addToMap(hours, getHourKey(record), record)
    addToSessions(sessions, record)

    if (facts.eventName === 'site_click') {
      addToMap(clicks, getAnalyticsClickKey(record), record)
    }
  }

  const byLocation = sortCounters(
    [...locations.entries()].map(([key, stats]) => {
      const [city, region, countryCode] = splitKeyParts(key, 3)

      return {
        city,
        region,
        countryCode,
        stats: serializeCounter(stats),
      }
    }),
  )
  const byCountry = sortCounters(
    [...countries.entries()].map(([countryCode, stats]) => ({
      countryCode,
      stats: serializeCounter(stats),
    })),
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
        accuracyMeters,
        nearestLocalityDistanceKm,
        provider,
        precisionLevel,
      ] = splitKeyParts(key, 12)

      return {
        city,
        region,
        countryCode,
        postalCode,
        timezone,
        colo,
        latitude: parseNullableNumber(latitude),
        longitude: parseNullableNumber(longitude),
        accuracyMeters: parseNullableNumber(accuracyMeters),
        nearestLocalityDistanceKm: parseNullableNumber(nearestLocalityDistanceKm),
        provider,
        precision: precisionLevel,
        stats: serializeCounter(stats),
      }
    }),
  )
  const byCampaign = sortCounters(
    [...campaigns.entries()].map(([key, stats]) => {
      const [source, medium, campaign, content] = splitKeyParts(key, 4)

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
      const [source, medium, campaign, content, city, region, countryCode] = splitKeyParts(key, 7)

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
  const byAdTarget = sortCounters(
    [...adTargets.entries()].map(([key, stats]) => {
      const [city, region, countryCode, area, adSet] = splitKeyParts(key, 5)

      return {
        city,
        region,
        countryCode,
        area,
        adSet,
        stats: serializeCounter(stats),
      }
    }),
  )
  const byCampaignAdTarget = sortCounters(
    [...campaignAdTargets.entries()].map(([key, stats]) => {
      const [source, medium, campaign, content, city, region, countryCode, area, adSet] =
        splitKeyParts(key, 9)

      return {
        source,
        medium,
        campaign,
        content,
        city,
        region,
        countryCode,
        area,
        adSet,
        stats: serializeCounter(stats),
      }
    }),
  )
  const topClicks = sortCounters(
    [...clicks.entries()].map(([key, stats]) => {
      const [label, href, path] = splitKeyParts(key, 3)

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
      const [provider, precisionLevel, colo, postalStatus, coordinateStatus] = splitKeyParts(key, 5)

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
  const bySession = [...sessions.values()]
    .map(serializeSession)
    .sort((first, second) => second.lastSeen.localeCompare(first.lastSeen))
  const lebanonCities = byLocation.filter(
    (item) => item.countryCode === 'LB' && isKnownPart(item.city),
  )
  const lebanonPreciseLocations = byPreciseLocation.filter(
    (item) =>
      item.countryCode === 'LB' &&
      (isKnownPart(item.city) ||
        isKnownPart(item.region) ||
        isKnownPart(item.postalCode) ||
        isKnownPart(item.timezone) ||
        isKnownPart(item.colo) ||
        item.latitude !== null ||
        item.longitude !== null),
  )

  return {
    generatedAt: new Date().toISOString(),
    storage,
    scannedEvents: records.length,
    matchedEvents: filteredRecords.length,
    filters,
    filterOptions: buildAnalyticsFilterOptions(records),
    stats: serializeCounter(total),
    byCountry,
    lebanonCities,
    lebanonPreciseLocations,
    byLocation,
    byPreciseLocation,
    byCampaign,
    byCampaignLocation,
    byAdTarget,
    byCampaignAdTarget,
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
    sessions: bySession,
  }
})
