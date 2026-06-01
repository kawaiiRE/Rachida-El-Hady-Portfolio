import type { AnalyticsRecord } from './analytics-storage'

export interface AnalyticsFilters {
  from: string
  to: string
  eventName: string
  countryCode: string
  region: string
  city: string
  postalCode: string
  colo: string
  utmSource: string
  utmMedium: string
  utmCampaign: string
  adCity: string
  adRegion: string
  adCountry: string
  pagePath: string
  device: string
  precision: string
  provider: string
  referrerHost: string
  outbound: string
  q: string
}

export interface AnalyticsFacts {
  eventName: string
  receivedAt: string
  timestamp: number
  visitorId: string
  sessionId: string
  city: string
  region: string
  regionCode: string
  countryCode: string
  country: string
  postalCode: string
  timezone: string
  continent: string
  latitude: number | null
  longitude: number | null
  accuracyMeters: number | null
  geoSource: string
  nearestLocalityDistanceKm: number | null
  metroCode: string
  colo: string
  precision: string
  provider: string
  pagePath: string
  pageFullPath: string
  pageTitle: string
  utmSource: string
  utmMedium: string
  utmCampaign: string
  utmContent: string
  adTargetCountryCode: string
  adTargetCountry: string
  adTargetRegion: string
  adTargetCity: string
  adTargetArea: string
  adTargetAdSet: string
  clickLabel: string
  clickHref: string
  isOutbound: boolean
  referrer: string
  referrerHost: string
  userAgent: string
  language: string
  device: string
  engagementSeconds: number
  scrollDepth: number
}

export interface AnalyticsFilterOption {
  value: string
  label: string
  count: number
}

const EMPTY_FILTERS: AnalyticsFilters = {
  from: '',
  to: '',
  eventName: '',
  countryCode: '',
  region: '',
  city: '',
  postalCode: '',
  colo: '',
  utmSource: '',
  utmMedium: '',
  utmCampaign: '',
  adCity: '',
  adRegion: '',
  adCountry: '',
  pagePath: '',
  device: '',
  precision: '',
  provider: '',
  referrerHost: '',
  outbound: '',
  q: '',
}

const getQueryString = (query: Record<string, unknown>, key: keyof AnalyticsFilters): string => {
  const value = query[key]
  const normalizedValue = Array.isArray(value) ? value[0] : value
  const text = String(normalizedValue || '').trim()

  return text === 'all' ? '' : text.slice(0, 240)
}

const asObject = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : {}

const getNestedValue = (value: unknown, path: string[]): unknown =>
  path.reduce<unknown>((currentValue, key) => asObject(currentValue)[key], value)

const getStringValue = (value: unknown, path: string[]): string => {
  const nextValue = getNestedValue(value, path)

  return typeof nextValue === 'string' ? nextValue.trim() : ''
}

const getNumberValue = (value: unknown, path: string[]): number => {
  const nextValue = getNestedValue(value, path)
  const numberValue = typeof nextValue === 'number' ? nextValue : Number(nextValue)

  return Number.isFinite(numberValue) ? numberValue : 0
}

const getNullableNumberValue = (value: unknown, path: string[]): number | null => {
  const nextValue = getNestedValue(value, path)

  if (nextValue === '' || nextValue === null || nextValue === undefined) {
    return null
  }

  const numberValue = typeof nextValue === 'number' ? nextValue : Number(nextValue)

  return Number.isFinite(numberValue) ? numberValue : null
}

const getBooleanValue = (value: unknown, path: string[]): boolean => {
  const nextValue = getNestedValue(value, path)

  return nextValue === true || nextValue === 'true' || nextValue === 1 || nextValue === '1'
}

const normalize = (value: unknown): string => String(value || '').trim()

const normalizeLower = (value: unknown): string => normalize(value).toLowerCase()

const normalizeKeyPart = (value: unknown, fallback = 'unknown'): string => {
  const normalized = normalize(value)

  return normalized && !['undefined', 'null'].includes(normalized.toLowerCase())
    ? normalized
    : fallback
}

const isKnownValue = (value: string): boolean => {
  const normalized = normalizeLower(value)

  return Boolean(normalized && !['unknown', 'undefined', 'null'].includes(normalized))
}

const parseDateBound = (value: string, endOfDay: boolean): number => {
  if (!value) {
    return 0
  }

  const normalizedValue = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? `${value}T${endOfDay ? '23:59:59.999' : '00:00:00.000'}`
    : value
  const timestamp = new Date(normalizedValue).getTime()

  return Number.isFinite(timestamp) ? timestamp : 0
}

const getReferrerHost = (value: string): string => {
  if (!value) {
    return ''
  }

  try {
    return new URL(value).hostname.replace(/^www\./, '')
  } catch {
    return value.replace(/^www\./, '')
  }
}

const getDeviceType = (record: AnalyticsRecord): string => {
  const userAgent = getStringValue(record, ['request', 'userAgent']).toLowerCase()
  const viewportWidth = getNumberValue(record, ['payload', 'environment', 'viewport', 'width'])
  const touchPoints = getNumberValue(record, ['payload', 'environment', 'touchPoints'])

  if (/bot|crawl|spider|slurp|preview/i.test(userAgent)) {
    return 'bot'
  }

  if (
    /ipad|tablet/i.test(userAgent) ||
    (viewportWidth >= 768 && viewportWidth <= 1180 && touchPoints > 0)
  ) {
    return 'tablet'
  }

  if (/mobi|iphone|android/i.test(userAgent) || (viewportWidth > 0 && viewportWidth < 768)) {
    return 'mobile'
  }

  if (userAgent || viewportWidth) {
    return 'desktop'
  }

  return 'unknown'
}

const getPrimaryLanguage = (record: AnalyticsRecord): string => {
  const language =
    getStringValue(record, ['payload', 'environment', 'language']) ||
    getStringValue(record, ['request', 'acceptLanguage']).split(',')[0]

  return language.trim()
}

const matchesExact = (actualValue: string, filterValue: string): boolean =>
  !filterValue || normalizeLower(actualValue) === normalizeLower(filterValue)

const matchesSearch = (facts: AnalyticsFacts, query: string): boolean => {
  const normalizedQuery = normalizeLower(query)

  if (!normalizedQuery) {
    return true
  }

  return [
    facts.eventName,
    facts.city,
    facts.region,
    facts.regionCode,
    facts.countryCode,
    facts.country,
    facts.postalCode,
    facts.timezone,
    facts.geoSource,
    facts.colo,
    facts.precision,
    facts.provider,
    facts.pagePath,
    facts.pageFullPath,
    facts.pageTitle,
    facts.utmSource,
    facts.utmMedium,
    facts.utmCampaign,
    facts.utmContent,
    facts.adTargetCountryCode,
    facts.adTargetCountry,
    facts.adTargetRegion,
    facts.adTargetCity,
    facts.adTargetArea,
    facts.adTargetAdSet,
    facts.clickLabel,
    facts.clickHref,
    facts.referrer,
    facts.referrerHost,
    facts.device,
    facts.language,
  ].some((value) => normalizeLower(value).includes(normalizedQuery))
}

const makeOptions = (
  records: AnalyticsRecord[],
  getter: (record: AnalyticsRecord) => string,
): AnalyticsFilterOption[] => {
  const counts = new Map<string, number>()

  for (const record of records) {
    const value = normalize(getter(record))

    if (!isKnownValue(value)) {
      continue
    }

    counts.set(value, (counts.get(value) || 0) + 1)
  }

  return [...counts.entries()]
    .map(([value, count]) => ({ value, label: value, count }))
    .sort((first, second) => second.count - first.count || first.label.localeCompare(second.label))
    .slice(0, 250)
}

export const parseAnalyticsLimit = (value: unknown, fallback: number, max: number): number => {
  const limit = Number(Array.isArray(value) ? value[0] : value)

  if (!Number.isFinite(limit)) {
    return fallback
  }

  return Math.min(max, Math.max(1, Math.round(limit)))
}

export const parseAnalyticsFilters = (query: Record<string, unknown>): AnalyticsFilters => ({
  ...EMPTY_FILTERS,
  from: getQueryString(query, 'from'),
  to: getQueryString(query, 'to'),
  eventName: getQueryString(query, 'eventName'),
  countryCode: getQueryString(query, 'countryCode').toUpperCase(),
  region: getQueryString(query, 'region'),
  city: getQueryString(query, 'city'),
  postalCode: getQueryString(query, 'postalCode'),
  colo: getQueryString(query, 'colo').toUpperCase(),
  utmSource: getQueryString(query, 'utmSource'),
  utmMedium: getQueryString(query, 'utmMedium'),
  utmCampaign: getQueryString(query, 'utmCampaign'),
  adCity: getQueryString(query, 'adCity'),
  adRegion: getQueryString(query, 'adRegion'),
  adCountry: getQueryString(query, 'adCountry').toUpperCase(),
  pagePath: getQueryString(query, 'pagePath'),
  device: getQueryString(query, 'device'),
  precision: getQueryString(query, 'precision'),
  provider: getQueryString(query, 'provider'),
  referrerHost: getQueryString(query, 'referrerHost'),
  outbound: getQueryString(query, 'outbound'),
  q: getQueryString(query, 'q'),
})

export const getAnalyticsFacts = (record: AnalyticsRecord): AnalyticsFacts => {
  const receivedAt = normalize(record.receivedAt)
  const timestamp = new Date(receivedAt).getTime()
  const referrer =
    getStringValue(record, ['request', 'referrer']) ||
    getStringValue(record, ['payload', 'page', 'referrer'])
  const countryCode =
    getStringValue(record, ['request', 'geo', 'countryCode']) ||
    getStringValue(record, ['request', 'geo', 'country'])
  const engagementMs = getNumberValue(record, ['payload', 'engagement', 'timeOnPageMs'])

  return {
    eventName: normalize(record.eventName),
    receivedAt,
    timestamp: Number.isFinite(timestamp) ? timestamp : 0,
    visitorId: getStringValue(record, ['payload', 'visitor', 'visitorId']),
    sessionId: getStringValue(record, ['payload', 'visitor', 'sessionId']),
    city: getStringValue(record, ['request', 'geo', 'city']),
    region: getStringValue(record, ['request', 'geo', 'region']),
    regionCode: getStringValue(record, ['request', 'geo', 'regionCode']),
    countryCode: countryCode.toUpperCase(),
    country: getStringValue(record, ['request', 'geo', 'country']),
    postalCode: getStringValue(record, ['request', 'geo', 'postalCode']),
    timezone: getStringValue(record, ['request', 'geo', 'timezone']),
    continent: getStringValue(record, ['request', 'geo', 'continent']),
    latitude: getNullableNumberValue(record, ['request', 'geo', 'latitude']),
    longitude: getNullableNumberValue(record, ['request', 'geo', 'longitude']),
    accuracyMeters: getNullableNumberValue(record, ['request', 'geo', 'accuracyMeters']),
    geoSource: getStringValue(record, ['request', 'geo', 'source']),
    nearestLocalityDistanceKm: getNullableNumberValue(record, [
      'request',
      'geo',
      'nearestLocalityDistanceKm',
    ]),
    metroCode: getStringValue(record, ['request', 'geo', 'metroCode']),
    colo: getStringValue(record, ['request', 'geo', 'colo']),
    precision: getStringValue(record, ['request', 'geo', 'precision']),
    provider: getStringValue(record, ['request', 'geo', 'provider']),
    pagePath: getStringValue(record, ['payload', 'page', 'path']),
    pageFullPath: getStringValue(record, ['payload', 'page', 'fullPath']),
    pageTitle: getStringValue(record, ['payload', 'page', 'title']),
    utmSource: getStringValue(record, ['payload', 'page', 'utm', 'source']),
    utmMedium: getStringValue(record, ['payload', 'page', 'utm', 'medium']),
    utmCampaign: getStringValue(record, ['payload', 'page', 'utm', 'campaign']),
    utmContent: getStringValue(record, ['payload', 'page', 'utm', 'content']),
    adTargetCountryCode: getStringValue(record, [
      'payload',
      'page',
      'adTarget',
      'countryCode',
    ]).toUpperCase(),
    adTargetCountry: getStringValue(record, ['payload', 'page', 'adTarget', 'country']),
    adTargetRegion: getStringValue(record, ['payload', 'page', 'adTarget', 'region']),
    adTargetCity: getStringValue(record, ['payload', 'page', 'adTarget', 'city']),
    adTargetArea: getStringValue(record, ['payload', 'page', 'adTarget', 'area']),
    adTargetAdSet: getStringValue(record, ['payload', 'page', 'adTarget', 'adSet']),
    clickLabel: getStringValue(record, ['payload', 'click', 'label']),
    clickHref: getStringValue(record, ['payload', 'click', 'href']),
    isOutbound:
      getBooleanValue(record, ['payload', 'click', 'isOutbound']) ||
      getBooleanValue(record, ['payload', 'click', 'outbound']),
    referrer,
    referrerHost: getReferrerHost(referrer),
    userAgent: getStringValue(record, ['request', 'userAgent']),
    language: getPrimaryLanguage(record),
    device: getDeviceType(record),
    engagementSeconds: engagementMs ? Math.round(engagementMs / 1000) : 0,
    scrollDepth: getNumberValue(record, ['payload', 'engagement', 'maxScrollDepth']),
  }
}

export const getAnalyticsLocationKey = (record: AnalyticsRecord): string => {
  const facts = getAnalyticsFacts(record)

  return [
    normalizeKeyPart(facts.city),
    normalizeKeyPart(facts.region),
    normalizeKeyPart(facts.countryCode || facts.country),
  ].join('|')
}

export const getAnalyticsPreciseLocationKey = (record: AnalyticsRecord): string => {
  const facts = getAnalyticsFacts(record)

  return [
    normalizeKeyPart(facts.city),
    normalizeKeyPart(facts.region || facts.regionCode),
    normalizeKeyPart(facts.countryCode || facts.country),
    normalizeKeyPart(facts.postalCode),
    normalizeKeyPart(facts.timezone),
    normalizeKeyPart(facts.colo),
    normalizeKeyPart(facts.latitude ?? ''),
    normalizeKeyPart(facts.longitude ?? ''),
    normalizeKeyPart(facts.accuracyMeters ?? ''),
    normalizeKeyPart(facts.nearestLocalityDistanceKm ?? ''),
    normalizeKeyPart(facts.provider),
    normalizeKeyPart(facts.precision),
  ].join('|')
}

export const getAnalyticsGeoQualityKey = (record: AnalyticsRecord): string => {
  const facts = getAnalyticsFacts(record)

  return [
    normalizeKeyPart(facts.provider),
    normalizeKeyPart(facts.precision),
    normalizeKeyPart(facts.colo),
    facts.postalCode ? 'postal' : 'no-postal',
    facts.latitude !== null && facts.longitude !== null ? 'coordinates' : 'no-coordinates',
  ].join('|')
}

export const getAnalyticsCampaignKey = (record: AnalyticsRecord): string => {
  const facts = getAnalyticsFacts(record)

  return [
    normalizeKeyPart(facts.utmSource),
    normalizeKeyPart(facts.utmMedium),
    normalizeKeyPart(facts.utmCampaign),
    normalizeKeyPart(facts.utmContent),
  ].join('|')
}

export const getAnalyticsAdTargetKey = (record: AnalyticsRecord): string => {
  const facts = getAnalyticsFacts(record)

  return [
    normalizeKeyPart(facts.adTargetCity),
    normalizeKeyPart(facts.adTargetRegion),
    normalizeKeyPart(facts.adTargetCountryCode || facts.adTargetCountry),
    normalizeKeyPart(facts.adTargetArea),
    normalizeKeyPart(facts.adTargetAdSet),
  ].join('|')
}

export const getAnalyticsClickKey = (record: AnalyticsRecord): string => {
  const facts = getAnalyticsFacts(record)

  return [
    normalizeKeyPart(facts.clickLabel),
    normalizeKeyPart(facts.clickHref),
    normalizeKeyPart(facts.pagePath),
  ].join('|')
}

export const filterAnalyticsRecords = (
  records: AnalyticsRecord[],
  filters: AnalyticsFilters,
): AnalyticsRecord[] => {
  const fromTimestamp = parseDateBound(filters.from, false)
  const toTimestamp = parseDateBound(filters.to, true)

  return records.filter((record) => {
    const facts = getAnalyticsFacts(record)

    if (fromTimestamp && facts.timestamp < fromTimestamp) return false
    if (toTimestamp && facts.timestamp > toTimestamp) return false
    if (!matchesExact(facts.eventName, filters.eventName)) return false
    if (!matchesExact(facts.countryCode, filters.countryCode)) return false
    if (!matchesExact(facts.region, filters.region)) return false
    if (!matchesExact(facts.city, filters.city)) return false
    if (!matchesExact(facts.postalCode, filters.postalCode)) return false
    if (!matchesExact(facts.colo, filters.colo)) return false
    if (!matchesExact(facts.utmSource, filters.utmSource)) return false
    if (!matchesExact(facts.utmMedium, filters.utmMedium)) return false
    if (!matchesExact(facts.utmCampaign, filters.utmCampaign)) return false
    if (!matchesExact(facts.adTargetCity, filters.adCity)) return false
    if (!matchesExact(facts.adTargetRegion, filters.adRegion)) return false
    if (!matchesExact(facts.adTargetCountryCode || facts.adTargetCountry, filters.adCountry)) {
      return false
    }
    if (!matchesExact(facts.pagePath, filters.pagePath)) return false
    if (!matchesExact(facts.device, filters.device)) return false
    if (!matchesExact(facts.precision, filters.precision)) return false
    if (!matchesExact(facts.provider, filters.provider)) return false
    if (!matchesExact(facts.referrerHost, filters.referrerHost)) return false

    if (filters.outbound === 'true' && !facts.isOutbound) return false
    if (filters.outbound === 'false' && facts.isOutbound) return false

    return matchesSearch(facts, filters.q)
  })
}

export const buildAnalyticsFilterOptions = (records: AnalyticsRecord[]) => ({
  eventNames: makeOptions(records, (record) => getAnalyticsFacts(record).eventName),
  countryCodes: makeOptions(records, (record) => getAnalyticsFacts(record).countryCode),
  regions: makeOptions(records, (record) => getAnalyticsFacts(record).region),
  cities: makeOptions(records, (record) => getAnalyticsFacts(record).city),
  postalCodes: makeOptions(records, (record) => getAnalyticsFacts(record).postalCode),
  colos: makeOptions(records, (record) => getAnalyticsFacts(record).colo),
  utmSources: makeOptions(records, (record) => getAnalyticsFacts(record).utmSource),
  utmMediums: makeOptions(records, (record) => getAnalyticsFacts(record).utmMedium),
  utmCampaigns: makeOptions(records, (record) => getAnalyticsFacts(record).utmCampaign),
  adCities: makeOptions(records, (record) => getAnalyticsFacts(record).adTargetCity),
  adRegions: makeOptions(records, (record) => getAnalyticsFacts(record).adTargetRegion),
  adCountries: makeOptions(
    records,
    (record) =>
      getAnalyticsFacts(record).adTargetCountryCode || getAnalyticsFacts(record).adTargetCountry,
  ),
  pagePaths: makeOptions(records, (record) => getAnalyticsFacts(record).pagePath),
  devices: makeOptions(records, (record) => getAnalyticsFacts(record).device),
  precision: makeOptions(records, (record) => getAnalyticsFacts(record).precision),
  providers: makeOptions(records, (record) => getAnalyticsFacts(record).provider),
  referrerHosts: makeOptions(records, (record) => getAnalyticsFacts(record).referrerHost),
})
