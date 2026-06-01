import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import { useHead } from '#imports'

type AnalyticsTab = 'overview' | 'geo' | 'acquisition' | 'behavior' | 'sessions' | 'events'
type AnalyticsStorage = 'd1' | 'file' | 'unconfigured'
type SortMetric = 'uniqueVisitors' | 'uniqueSessions' | 'pageViews' | 'clicks' | 'events'
type FilterKey = keyof AnalyticsFilters

interface AnalyticsStats {
  events: number
  uniqueVisitors: number
  uniqueSessions: number
  pageViews: number
  clicks: number
  formSubmits: number
  engagements: number
  avgEngagementSeconds: number
  avgScrollDepth: number
  clickRate: number
}

interface AnalyticsFilters {
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
  pagePath: string
  device: string
  precision: string
  provider: string
  referrerHost: string
  outbound: string
  q: string
}

interface AnalyticsFilterOption {
  value: string
  label: string
  count: number
}

interface AnalyticsFilterOptions {
  eventNames: AnalyticsFilterOption[]
  countryCodes: AnalyticsFilterOption[]
  regions: AnalyticsFilterOption[]
  cities: AnalyticsFilterOption[]
  postalCodes: AnalyticsFilterOption[]
  colos: AnalyticsFilterOption[]
  utmSources: AnalyticsFilterOption[]
  utmMediums: AnalyticsFilterOption[]
  utmCampaigns: AnalyticsFilterOption[]
  pagePaths: AnalyticsFilterOption[]
  devices: AnalyticsFilterOption[]
  precision: AnalyticsFilterOption[]
  providers: AnalyticsFilterOption[]
  referrerHosts: AnalyticsFilterOption[]
}

interface AnalyticsLocationRow {
  city: string
  region: string
  countryCode: string
  postalCode?: string
  timezone?: string
  colo?: string
  latitude?: number | null
  longitude?: number | null
  provider?: string
  precision?: string
  stats: AnalyticsStats
}

interface AnalyticsCountryRow {
  countryCode: string
  stats: AnalyticsStats
}

interface AnalyticsGeoQualityRow {
  provider: string
  precision: string
  colo: string
  hasPostalCode: boolean
  hasCoordinates: boolean
  stats: AnalyticsStats
}

interface AnalyticsCampaignRow {
  source: string
  medium: string
  campaign: string
  content: string
  stats: AnalyticsStats
}

interface AnalyticsCampaignLocationRow extends AnalyticsCampaignRow {
  city: string
  region: string
  countryCode: string
}

interface AnalyticsClickRow {
  label: string
  href: string
  path: string
  stats: AnalyticsStats
}

interface AnalyticsNamedRow {
  name: string
  stats: AnalyticsStats
}

interface AnalyticsPageRow {
  path: string
  stats: AnalyticsStats
}

interface AnalyticsReferrerRow {
  host: string
  stats: AnalyticsStats
}

interface AnalyticsDayRow {
  date: string
  stats: AnalyticsStats
}

interface AnalyticsHourRow {
  hour: string
  stats: AnalyticsStats
}

interface AnalyticsHourPoint extends AnalyticsHourRow {
  x: number
  y: number
}

interface AnalyticsSessionRow {
  sessionId: string
  visitorId: string
  firstSeen: string
  lastSeen: string
  durationSeconds: number
  city: string
  region: string
  countryCode: string
  postalCode: string
  colo: string
  precision: string
  provider: string
  device: string
  referrerHost: string
  source: string
  medium: string
  campaign: string
  entryPage: string
  exitPage: string
  pages: string[]
  stats: AnalyticsStats
}

interface AnalyticsSummary {
  generatedAt: string
  storage: AnalyticsStorage
  scannedEvents: number
  matchedEvents: number
  filters: AnalyticsFilters
  filterOptions: AnalyticsFilterOptions
  stats: AnalyticsStats
  byCountry: AnalyticsCountryRow[]
  lebanonCities: AnalyticsLocationRow[]
  lebanonPreciseLocations: AnalyticsLocationRow[]
  byLocation: AnalyticsLocationRow[]
  byPreciseLocation: AnalyticsLocationRow[]
  byCampaign: AnalyticsCampaignRow[]
  byCampaignLocation: AnalyticsCampaignLocationRow[]
  topClicks: AnalyticsClickRow[]
  byPage: AnalyticsPageRow[]
  byReferrer: AnalyticsReferrerRow[]
  byEvent: AnalyticsNamedRow[]
  byDevice: AnalyticsNamedRow[]
  byLanguage: AnalyticsNamedRow[]
  byDay: AnalyticsDayRow[]
  byHour: AnalyticsHourRow[]
  precision: AnalyticsNamedRow[]
  providers: AnalyticsNamedRow[]
  geoQuality: AnalyticsGeoQualityRow[]
  sessions: AnalyticsSessionRow[]
}

interface AnalyticsEvent {
  id: string
  receivedAt: string
  eventName: string
  request?: {
    referrer?: string
    geo?: {
      city?: string
      region?: string
      countryCode?: string
      country?: string
      postalCode?: string
      timezone?: string
      latitude?: number | null
      longitude?: number | null
      colo?: string
      precision?: string
      provider?: string
    }
  }
  payload?: {
    page?: {
      title?: string
      path?: string
      fullPath?: string
      referrer?: string
      utm?: {
        source?: string
        medium?: string
        campaign?: string
        content?: string
      }
    }
    click?: {
      label?: string
      href?: string
      isOutbound?: boolean
    }
    form?: {
      label?: string
    }
    engagement?: {
      timeOnPageMs?: number
      maxScrollDepth?: number
    }
    environment?: {
      language?: string
      viewport?: {
        width?: number
        height?: number
      }
    }
  }
}

interface AnalyticsEventsResponse {
  storage: AnalyticsStorage
  scanned: number
  matched: number
  count: number
  filters: AnalyticsFilters
  events: AnalyticsEvent[]
}

interface AnalyticsListItem {
  label: string
  value: string
  meta?: string
  percentage: number
}

const TOKEN_STORAGE_KEY = 'portfolio:analytics:admin-token'

const defaultFilters = (): AnalyticsFilters => ({
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
  pagePath: '',
  device: '',
  precision: '',
  provider: '',
  referrerHost: '',
  outbound: '',
  q: '',
})

const emptyFilterOptions = (): AnalyticsFilterOptions => ({
  eventNames: [],
  countryCodes: [],
  regions: [],
  cities: [],
  postalCodes: [],
  colos: [],
  utmSources: [],
  utmMediums: [],
  utmCampaigns: [],
  pagePaths: [],
  devices: [],
  precision: [],
  providers: [],
  referrerHosts: [],
})

const tabs: { id: AnalyticsTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'geo', label: 'Geo' },
  { id: 'acquisition', label: 'Acquisition' },
  { id: 'behavior', label: 'Behavior' },
  { id: 'sessions', label: 'Sessions' },
  { id: 'events', label: 'Events' },
]

const quickRanges = [
  { id: 'today', label: 'Today', days: 0 },
  { id: '7d', label: '7D', days: 7 },
  { id: '30d', label: '30D', days: 30 },
  { id: '90d', label: '90D', days: 90 },
  { id: 'all', label: 'All', days: null },
]

const filterLabels: Record<FilterKey, string> = {
  from: 'From',
  to: 'To',
  eventName: 'Event',
  countryCode: 'Country',
  region: 'Region',
  city: 'City',
  postalCode: 'Postal',
  colo: 'Edge',
  utmSource: 'Source',
  utmMedium: 'Medium',
  utmCampaign: 'Campaign',
  pagePath: 'Page',
  device: 'Device',
  precision: 'Precision',
  provider: 'Provider',
  referrerHost: 'Referrer',
  outbound: 'Outbound',
  q: 'Search',
}

const formatNumber = (value: number): string => new Intl.NumberFormat('en-US').format(value || 0)

const formatCountLabel = (value: number, singular: string, plural = `${singular}s`): string =>
  `${formatNumber(value)} ${value === 1 ? singular : plural}`

const formatPercent = (value: number): string => `${value || 0}%`

const formatSeconds = (value: number): string => {
  if (!value) {
    return '0s'
  }

  if (value < 60) {
    return `${value}s`
  }

  const minutes = Math.floor(value / 60)
  const seconds = value % 60

  return seconds ? `${minutes}m ${seconds}s` : `${minutes}m`
}

const formatDateInput = (date: Date): string => {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')

  return `${year}-${month}-${day}`
}

const getPercentage = (value: number, total: number): number => {
  if (!total || !value) {
    return 0
  }

  return Math.max(4, Math.min(100, Math.round((value / total) * 100)))
}

const cleanPart = (value: unknown): string => {
  const cleanedValue = String(value ?? '').trim()

  return cleanedValue && !['unknown', 'undefined', 'null'].includes(cleanedValue.toLowerCase())
    ? cleanedValue
    : ''
}

const joinParts = (parts: string[], fallback: string): string => {
  const label = parts.map(cleanPart).filter(Boolean).join(', ')

  return label || fallback
}

const formatEventName = (value: string): string =>
  (cleanPart(value) || 'unknown')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .trim()

const formatOptionLabel = (option: AnalyticsFilterOption): string =>
  `${option.label} (${formatNumber(option.count)})`

const optionValue = (value: unknown): string => cleanPart(value) || 'unknown'

const getLocationLabel = (row: AnalyticsLocationRow | AnalyticsCampaignLocationRow): string => {
  const location = joinParts([row.city, row.region], '')
  const country = getCountryLabelFromCode(row.countryCode, '')

  return location
    ? joinParts([row.city, row.region, country], location)
    : getCountryLabelFromCode(row.countryCode, 'Unknown location')
}

const getCountryName = (countryCode: string): string => {
  const code = cleanPart(countryCode).toUpperCase()

  if (!code) {
    return ''
  }

  try {
    return new Intl.DisplayNames(['en'], { type: 'region' }).of(code) || code
  } catch {
    return code
  }
}

const getCountryLabelFromCode = (countryCode: unknown, fallback = 'Unknown country'): string => {
  const code = cleanPart(countryCode).toUpperCase()
  const name = getCountryName(code)

  if (name && code && name !== code) {
    return `${name} (${code})`
  }

  return code || fallback
}

const getCountryLabel = (row: AnalyticsCountryRow | AnalyticsLocationRow): string =>
  getCountryLabelFromCode(row.countryCode)

const isKnownCountryRow = (row: AnalyticsCountryRow): boolean => Boolean(cleanPart(row.countryCode))

const getKnownCountryRows = (rows: AnalyticsCountryRow[]): AnalyticsCountryRow[] =>
  rows.filter(isKnownCountryRow)

const formatPrecisionLabel = (value: unknown): string => {
  const precision = cleanPart(value)

  if (precision === 'postal') return 'Postal-level'
  if (precision === 'city') return 'City-level'
  if (precision === 'region') return 'Region-level'
  if (precision === 'country') return 'Country-level only'
  if (precision === 'none') return 'No geo data'

  return optionValue(value)
}

const formatProviderLabel = (value: unknown): string => cleanPart(value) || 'No provider'

const formatEdgeLabel = (value: unknown): string => cleanPart(value) || 'No edge'

const formatCoordinate = (value: number | null | undefined): string =>
  typeof value === 'number' && Number.isFinite(value) ? value.toFixed(3) : ''

const getCoordinateLabel = (row: AnalyticsLocationRow): string => {
  const latitude = formatCoordinate(row.latitude)
  const longitude = formatCoordinate(row.longitude)

  return latitude && longitude ? `${latitude}, ${longitude}` : ''
}

const getPreciseLocationMeta = (row: AnalyticsLocationRow): string =>
  [
    cleanPart(row.postalCode || '') ? `postal ${cleanPart(row.postalCode || '')}` : '',
    cleanPart(row.timezone || ''),
    cleanPart(row.colo || '') ? `edge ${cleanPart(row.colo || '')}` : '',
    getCoordinateLabel(row),
  ]
    .filter(Boolean)
    .join(' - ') || 'No finer fields'

const getSessionLocation = (row: AnalyticsSessionRow): string =>
  getLocationLabel({
    city: row.city,
    region: row.region,
    countryCode: row.countryCode,
    stats: row.stats,
  })

const getSessionCampaign = (row: AnalyticsSessionRow): string =>
  joinParts([row.source, row.medium, row.campaign], 'Direct or untagged')

const getSessionGeoNote = (row: AnalyticsSessionRow): string =>
  [
    cleanPart(row.precision) ? formatPrecisionLabel(row.precision) : '',
    cleanPart(row.provider) ? formatProviderLabel(row.provider) : '',
    cleanPart(row.postalCode) ? `postal ${cleanPart(row.postalCode)}` : '',
    cleanPart(row.colo) ? `edge ${cleanPart(row.colo)}` : '',
  ]
    .filter(Boolean)
    .join(' / ')

const getSessionPages = (row: AnalyticsSessionRow): string =>
  row.pages.map(optionValue).join(', ') || optionValue(row.entryPage) || 'unknown'

const shortId = (value: string): string => {
  const cleanedValue = cleanPart(value)

  return cleanedValue ? cleanedValue.slice(0, 10) : 'unknown'
}

const getCampaignLabel = (row: AnalyticsCampaignRow): string =>
  joinParts([row.source, row.medium, row.campaign], 'Direct or untagged')

const getCampaignMeta = (row: AnalyticsCampaignRow): string =>
  [
    cleanPart(row.content) ? `content: ${cleanPart(row.content)}` : '',
    `${formatNumber(row.stats.uniqueSessions)} sessions`,
    `${formatNumber(row.stats.pageViews)} views`,
    `${formatNumber(row.stats.clicks)} clicks`,
  ]
    .filter(Boolean)
    .join(' - ')

const getClickLabel = (row: AnalyticsClickRow): string =>
  cleanPart(row.label) || cleanPart(row.href) || 'Unlabeled click'

const getClickMeta = (row: AnalyticsClickRow): string =>
  joinParts([row.path, row.href], `${formatNumber(row.stats.events)} click events`)

const getSortableValue = (stats: AnalyticsStats, metric: SortMetric): number => stats[metric] || 0

const getRowKey = (row: AnalyticsLocationRow): string =>
  [
    row.city,
    row.region,
    row.countryCode,
    row.postalCode,
    row.timezone,
    row.colo,
    row.latitude,
    row.longitude,
    row.provider,
    row.precision,
  ]
    .map((value) => String(value ?? ''))
    .join('|')

const sortByMetric = <T extends { stats: AnalyticsStats }>(rows: T[], metric: SortMetric): T[] =>
  [...rows].sort((first, second) => {
    const metricDiff =
      getSortableValue(second.stats, metric) - getSortableValue(first.stats, metric)

    if (metricDiff) {
      return metricDiff
    }

    return second.stats.events - first.stats.events
  })

const makeListItems = <T extends { stats: AnalyticsStats }>(
  rows: T[],
  total: number,
  getLabel: (row: T) => string,
  getMeta: (row: T) => string,
  getValue: (stats: AnalyticsStats) => number = (stats) => stats.uniqueVisitors,
  formatValue: (value: number) => string = formatNumber,
): AnalyticsListItem[] =>
  rows.slice(0, 8).map((row) => {
    const value = getValue(row.stats)

    return {
      label: getLabel(row),
      value: formatValue(value),
      meta: `${getMeta(row)} - ${formatNumber(row.stats.events)} events`,
      percentage: getPercentage(value, total),
    }
  })

const escapeCsv = (value: unknown): string => {
  const text = String(value ?? '')

  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`
  }

  return text
}

export default defineComponent({
  name: 'AnalyticsPage',
  setup() {
    useHead({
      title: 'Analytics | Rachida El Hady',
      meta: [{ name: 'robots', content: 'noindex,nofollow' }],
    })

    const tokenInput = ref('')
    const adminToken = ref('')
    const limit = ref(10000)
    const eventLimit = ref(250)
    const activeTab = ref<AnalyticsTab>('overview')
    const sortMetric = ref<SortMetric>('uniqueVisitors')
    const isLoading = ref(false)
    const errorMessage = ref('')
    const summary = ref<AnalyticsSummary | null>(null)
    const eventsResponse = ref<AnalyticsEventsResponse | null>(null)
    const draftFilters = ref<AnalyticsFilters>(defaultFilters())
    const appliedFilters = ref<AnalyticsFilters>(defaultFilters())

    const hasToken = computed(() => Boolean(adminToken.value))
    const filterOptions = computed(() => summary.value?.filterOptions || emptyFilterOptions())

    const storageLabel = computed(() => {
      if (!summary.value) {
        return ''
      }

      const labels: Record<AnalyticsStorage, string> = {
        d1: 'Cloudflare D1',
        file: 'Local file',
        unconfigured: 'Storage missing',
      }

      return labels[summary.value.storage]
    })

    const storageClass = computed(() => ({
      'analytics-page__status--ready': summary.value?.storage === 'd1',
      'analytics-page__status--local': summary.value?.storage === 'file',
      'analytics-page__status--warning': summary.value?.storage === 'unconfigured',
    }))

    const metrics = computed(() => {
      const stats = summary.value?.stats

      if (!stats || !summary.value) {
        return []
      }

      const knownCountries = getKnownCountryRows(summary.value.byCountry || [])
      const topCountries = knownCountries.slice(0, 3).map(getCountryLabel).join(', ')

      return [
        {
          label: 'Visitors',
          value: formatNumber(stats.uniqueVisitors),
          sub: `${formatNumber(summary.value.matchedEvents)} matched events`,
        },
        {
          label: 'Sessions',
          value: formatNumber(stats.uniqueSessions),
          sub: `${formatNumber(stats.pageViews)} page views`,
        },
        {
          label: 'Countries',
          value: formatNumber(knownCountries.length),
          sub: topCountries || `${formatNumber(stats.events)} events without country data`,
        },
        {
          label: 'Page Views',
          value: formatNumber(stats.pageViews),
          sub: `${formatNumber(stats.engagements)} engagement pings`,
        },
        {
          label: 'Clicks',
          value: formatNumber(stats.clicks),
          sub: `${formatPercent(stats.clickRate)} click rate`,
        },
        {
          label: 'Avg Time',
          value: formatSeconds(stats.avgEngagementSeconds),
          sub: `${formatPercent(stats.avgScrollDepth)} avg scroll`,
        },
      ]
    })

    const activeFilterChips = computed(() =>
      (Object.entries(appliedFilters.value) as [FilterKey, string][])
        .filter(([, value]) => Boolean(value))
        .map(([key, value]) => ({
          key,
          label: filterLabels[key],
          value: key === 'eventName' ? formatEventName(value) : value,
        })),
    )

    const tableLimit = computed(() =>
      activeTab.value === 'events' || activeTab.value === 'sessions' ? 100 : 40,
    )
    const totalVisitors = computed(() => summary.value?.stats.uniqueVisitors || 0)
    const totalSessions = computed(() => summary.value?.stats.uniqueSessions || 0)
    const totalClicks = computed(() => summary.value?.stats.clicks || 0)
    const maxDayEvents = computed(() =>
      Math.max(...(summary.value?.byDay || []).map((row) => row.stats.events), 0),
    )
    const maxHourEvents = computed(() =>
      Math.max(...hourRows.value.map((row) => row.stats.events), 0),
    )

    const lebanonCityRows = computed(() =>
      makeListItems(
        sortByMetric(summary.value?.lebanonCities || [], sortMetric.value),
        totalSessions.value || totalVisitors.value,
        getLocationLabel,
        (row) =>
          `${formatNumber(row.stats.uniqueSessions)} sessions - ${formatNumber(row.stats.pageViews)} views`,
        (stats) => stats.uniqueSessions || stats.uniqueVisitors,
        (value) => formatCountLabel(value, 'session'),
      ),
    )

    const countryRows = computed(() =>
      makeListItems(
        sortByMetric(getKnownCountryRows(summary.value?.byCountry || []), sortMetric.value),
        totalSessions.value || totalVisitors.value,
        getCountryLabel,
        (row) =>
          `${formatNumber(row.stats.uniqueSessions)} sessions - ${formatNumber(row.stats.uniqueVisitors)} visitors - ${formatNumber(row.stats.events)} events`,
        (stats) => stats.uniqueSessions || stats.uniqueVisitors,
        (value) => formatCountLabel(value, 'session'),
      ),
    )

    const campaignRows = computed(() =>
      makeListItems(
        sortByMetric(summary.value?.byCampaign || [], sortMetric.value),
        totalSessions.value || totalVisitors.value,
        getCampaignLabel,
        getCampaignMeta,
        (stats) => stats.uniqueSessions || stats.uniqueVisitors,
        (value) => formatCountLabel(value, 'session'),
      ),
    )

    const clickRows = computed(() =>
      makeListItems(
        sortByMetric(summary.value?.topClicks || [], 'events'),
        totalClicks.value,
        getClickLabel,
        getClickMeta,
        (stats) => stats.events,
        (value) => formatCountLabel(value, 'click'),
      ),
    )

    const pageRows = computed(() =>
      makeListItems(
        sortByMetric(summary.value?.byPage || [], sortMetric.value),
        totalSessions.value || totalVisitors.value,
        (row) => optionValue(row.path),
        (row) =>
          `${formatNumber(row.stats.uniqueSessions)} sessions - ${formatNumber(row.stats.pageViews)} views - ${formatPercent(row.stats.clickRate)} click rate`,
        (stats) => stats.uniqueSessions || stats.uniqueVisitors,
        (value) => formatCountLabel(value, 'session'),
      ),
    )

    const precisionRows = computed(() =>
      makeListItems(
        sortByMetric(summary.value?.precision || [], 'events'),
        summary.value?.matchedEvents || 0,
        (row) => formatPrecisionLabel(row.name),
        (row) =>
          `${formatNumber(row.stats.uniqueSessions)} sessions - ${formatNumber(row.stats.pageViews)} views`,
        (stats) => stats.events,
        (value) => formatCountLabel(value, 'event'),
      ),
    )

    const locationTableRows = computed(() =>
      sortByMetric(summary.value?.byLocation || [], sortMetric.value).slice(0, tableLimit.value),
    )
    const countryTableRows = computed(() =>
      sortByMetric(getKnownCountryRows(summary.value?.byCountry || []), sortMetric.value).slice(
        0,
        tableLimit.value,
      ),
    )
    const preciseLocationTableRows = computed(() =>
      sortByMetric(summary.value?.byPreciseLocation || [], sortMetric.value).slice(
        0,
        tableLimit.value,
      ),
    )
    const lebanonTableRows = computed(() =>
      sortByMetric(summary.value?.lebanonCities || [], sortMetric.value).slice(0, tableLimit.value),
    )
    const lebanonPreciseTableRows = computed(() =>
      sortByMetric(summary.value?.lebanonPreciseLocations || [], sortMetric.value).slice(
        0,
        tableLimit.value,
      ),
    )
    const campaignTableRows = computed(() =>
      sortByMetric(summary.value?.byCampaign || [], sortMetric.value).slice(0, tableLimit.value),
    )
    const campaignLocationTableRows = computed(() =>
      sortByMetric(summary.value?.byCampaignLocation || [], sortMetric.value).slice(
        0,
        tableLimit.value,
      ),
    )
    const pageTableRows = computed(() =>
      sortByMetric(summary.value?.byPage || [], sortMetric.value).slice(0, tableLimit.value),
    )
    const referrerTableRows = computed(() =>
      sortByMetric(summary.value?.byReferrer || [], sortMetric.value).slice(0, tableLimit.value),
    )
    const clickTableRows = computed(() =>
      sortByMetric(summary.value?.topClicks || [], 'events').slice(0, tableLimit.value),
    )
    const eventTypeTableRows = computed(() =>
      sortByMetric(summary.value?.byEvent || [], sortMetric.value).slice(0, tableLimit.value),
    )
    const deviceTableRows = computed(() =>
      sortByMetric(summary.value?.byDevice || [], sortMetric.value).slice(0, tableLimit.value),
    )
    const languageTableRows = computed(() =>
      sortByMetric(summary.value?.byLanguage || [], sortMetric.value).slice(0, tableLimit.value),
    )
    const providerTableRows = computed(() =>
      sortByMetric(summary.value?.providers || [], 'events').slice(0, tableLimit.value),
    )
    const geoQualityTableRows = computed(() =>
      sortByMetric(summary.value?.geoQuality || [], 'events').slice(0, tableLimit.value),
    )
    const sessionTableRows = computed(() => summary.value?.sessions || [])
    const geoMissingNotice = computed(() => {
      if (!summary.value || !summary.value.matchedEvents) {
        return ''
      }

      const knownCountries = getKnownCountryRows(summary.value.byCountry || [])

      if (knownCountries.length) {
        return ''
      }

      return summary.value.storage === 'file'
        ? 'These are local analytics records, so Cloudflare city and country fields are not present yet.'
        : 'Matched events do not include country or city fields yet. Cloudflare geo will appear here once requests include those fields.'
    })
    const recentEvents = computed(() => eventsResponse.value?.events || [])
    const dayRows = computed(() => summary.value?.byDay || [])
    const hourRows = computed(() => {
      const currentRows = new Map((summary.value?.byHour || []).map((row) => [row.hour, row]))
      const zeroStats: AnalyticsStats = {
        events: 0,
        uniqueVisitors: 0,
        uniqueSessions: 0,
        pageViews: 0,
        clicks: 0,
        formSubmits: 0,
        engagements: 0,
        avgEngagementSeconds: 0,
        avgScrollDepth: 0,
        clickRate: 0,
      }

      return Array.from({ length: 24 }, (_, hour) => {
        const key = hour.toString().padStart(2, '0')

        return currentRows.get(key) || { hour: key, stats: zeroStats }
      })
    })
    const hourChartPoints = computed<AnalyticsHourPoint[]>(() => {
      const maxEvents = maxHourEvents.value || 1

      return hourRows.value.map((row, index) => ({
        ...row,
        x: Math.round((index / 23) * 1000) / 10,
        y: Math.round((92 - (row.stats.events / maxEvents) * 84) * 10) / 10,
      }))
    })
    const hourPolylinePoints = computed(() =>
      hourChartPoints.value.map((point) => `${point.x},${point.y}`).join(' '),
    )
    const hourAreaPoints = computed(() => {
      const points = hourPolylinePoints.value

      return points ? `0,100 ${points} 100,100` : ''
    })
    const hourAxisLabels = computed(() => {
      const maxEvents = maxHourEvents.value

      return [maxEvents, Math.round(maxEvents / 2), 0]
    })

    const buildAnalyticsQuery = (includeEventLimit = false): string => {
      const params = new URLSearchParams()

      params.set('limit', String(limit.value))
      if (includeEventLimit) {
        params.set('eventLimit', String(eventLimit.value))
      }

      for (const [key, value] of Object.entries(appliedFilters.value)) {
        if (value) {
          params.set(key, value)
        }
      }

      return params.toString()
    }

    const fetchWithToken = async <T>(url: string): Promise<T> => {
      const response = await fetch(url, {
        headers: {
          'x-analytics-admin-token': adminToken.value,
        },
      })

      if (!response.ok) {
        throw new Error(
          response.status === 403
            ? 'That analytics token is not valid.'
            : `Analytics request failed (${response.status}).`,
        )
      }

      return (await response.json()) as T
    }

    const loadAnalytics = async () => {
      if (!adminToken.value) {
        return
      }

      isLoading.value = true
      errorMessage.value = ''

      try {
        const [summaryData, eventsData] = await Promise.all([
          fetchWithToken<AnalyticsSummary>(`/api/analytics/summary?${buildAnalyticsQuery()}`),
          fetchWithToken<AnalyticsEventsResponse>(
            `/api/analytics/events?${buildAnalyticsQuery(true)}`,
          ),
        ])

        summary.value = summaryData
        eventsResponse.value = eventsData
      } catch (error) {
        errorMessage.value = error instanceof Error ? error.message : 'Unable to load analytics.'
      } finally {
        isLoading.value = false
      }
    }

    const saveToken = () => {
      const nextToken = tokenInput.value.trim()

      if (!nextToken) {
        return
      }

      adminToken.value = nextToken
      localStorage.setItem(TOKEN_STORAGE_KEY, nextToken)
      loadAnalytics()
    }

    const clearToken = () => {
      adminToken.value = ''
      tokenInput.value = ''
      summary.value = null
      eventsResponse.value = null
      localStorage.removeItem(TOKEN_STORAGE_KEY)
    }

    const applyFilters = () => {
      appliedFilters.value = { ...draftFilters.value }
      loadAnalytics()
    }

    const resetFilters = () => {
      draftFilters.value = defaultFilters()
      appliedFilters.value = defaultFilters()
      loadAnalytics()
    }

    const clearFilter = (key: FilterKey) => {
      draftFilters.value[key] = ''
      appliedFilters.value[key] = ''
      loadAnalytics()
    }

    const setQuickRange = (days: number | null) => {
      if (days === null) {
        draftFilters.value.from = ''
        draftFilters.value.to = ''
        applyFilters()
        return
      }

      const today = new Date()
      const from = new Date()
      from.setDate(today.getDate() - days)

      draftFilters.value.from = formatDateInput(from)
      draftFilters.value.to = formatDateInput(today)
      applyFilters()
    }

    const formatDate = (value: string): string => {
      if (!value) {
        return 'unknown'
      }

      const date = new Date(value)

      if (Number.isNaN(date.getTime())) {
        return value
      }

      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date)
    }

    const formatDay = (value: string): string => {
      const date = new Date(`${value}T00:00:00`)

      if (Number.isNaN(date.getTime())) {
        return value
      }

      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
      }).format(date)
    }

    const formatLocation = (event: AnalyticsEvent): string =>
      joinParts([event.request?.geo?.city || '', event.request?.geo?.region || ''], '') ||
      getCountryLabelFromCode(
        event.request?.geo?.countryCode || event.request?.geo?.country || '',
        'Unknown location',
      )

    const formatGeoDetail = (event: AnalyticsEvent): string => {
      const geo = event.request?.geo
      const latitude = formatCoordinate(geo?.latitude)
      const longitude = formatCoordinate(geo?.longitude)

      return (
        [
          cleanPart(geo?.precision) ? formatPrecisionLabel(geo?.precision || '') : '',
          cleanPart(geo?.provider) ? formatProviderLabel(geo?.provider || '') : '',
          cleanPart(geo?.postalCode) ? `postal ${cleanPart(geo?.postalCode)}` : '',
          cleanPart(geo?.colo) ? `edge ${cleanPart(geo?.colo)}` : '',
          latitude && longitude ? `${latitude}, ${longitude}` : '',
        ]
          .filter(Boolean)
          .join(' - ') || 'none'
      )
    }

    const formatEventDetail = (event: AnalyticsEvent): string => {
      if (event.eventName === 'site_click') {
        return joinParts(
          [event.payload?.click?.label || '', event.payload?.click?.href || ''],
          'click',
        )
      }

      if (event.eventName === 'form_submit') {
        return event.payload?.form?.label || 'form submit'
      }

      if (event.eventName === 'page_engagement') {
        const timeOnPageSeconds = Math.round((event.payload?.engagement?.timeOnPageMs || 0) / 1000)
        const scrollDepth = event.payload?.engagement?.maxScrollDepth || 0

        return `${formatSeconds(timeOnPageSeconds)} - ${scrollDepth}% scroll`
      }

      const utm = event.payload?.page?.utm
      const campaign = joinParts([utm?.source || '', utm?.medium || '', utm?.campaign || ''], '')

      return campaign || event.payload?.page?.fullPath || event.payload?.page?.path || 'page view'
    }

    const getDayHeight = (row: AnalyticsDayRow): string =>
      `${getPercentage(row.stats.events, maxDayEvents.value)}%`

    const isHourTick = (hour: string): boolean => ['00', '06', '12', '18', '23'].includes(hour)

    const exportEventsCsv = () => {
      const rows = recentEvents.value.map((event) => [
        event.receivedAt,
        event.eventName,
        formatLocation(event),
        event.request?.geo?.postalCode || '',
        event.request?.geo?.colo || '',
        event.request?.geo?.precision || '',
        event.request?.geo?.provider || '',
        event.payload?.page?.path || '',
        event.payload?.page?.utm?.source || '',
        event.payload?.page?.utm?.medium || '',
        event.payload?.page?.utm?.campaign || '',
        formatEventDetail(event),
      ])
      const csv = [
        [
          'receivedAt',
          'eventName',
          'location',
          'postalCode',
          'edgeColo',
          'geoLevel',
          'geoProvider',
          'pagePath',
          'utmSource',
          'utmMedium',
          'utmCampaign',
          'detail',
        ],
        ...rows,
      ]
        .map((row) => row.map(escapeCsv).join(','))
        .join('\n')
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')

      anchor.href = url
      anchor.download = `portfolio-analytics-${formatDateInput(new Date())}.csv`
      anchor.click()
      URL.revokeObjectURL(url)
    }

    watch([limit, eventLimit], () => {
      if (adminToken.value) {
        loadAnalytics()
      }
    })

    onMounted(() => {
      const savedToken = localStorage.getItem(TOKEN_STORAGE_KEY) || ''

      if (!savedToken) {
        return
      }

      tokenInput.value = savedToken
      adminToken.value = savedToken
      loadAnalytics()
    })

    return {
      activeFilterChips,
      activeTab,
      applyFilters,
      campaignLocationTableRows,
      campaignRows,
      campaignTableRows,
      clearFilter,
      clearToken,
      clickRows,
      clickTableRows,
      countryRows,
      countryTableRows,
      dayRows,
      deviceTableRows,
      draftFilters,
      errorMessage,
      eventLimit,
      eventTypeTableRows,
      exportEventsCsv,
      filterOptions,
      formatDate,
      formatDay,
      formatEventDetail,
      formatEventName,
      formatGeoDetail,
      formatProviderLabel,
      formatEdgeLabel,
      formatLocation,
      formatNumber,
      formatOptionLabel,
      formatPercent,
      formatPrecisionLabel,
      formatSeconds,
      getCampaignLabel,
      getCampaignMeta,
      getClickLabel,
      getClickMeta,
      getCountryLabel,
      getDayHeight,
      getPreciseLocationMeta,
      getLocationLabel,
      getRowKey,
      getSessionCampaign,
      getSessionGeoNote,
      getSessionLocation,
      getSessionPages,
      geoQualityTableRows,
      geoMissingNotice,
      hasToken,
      hourAreaPoints,
      hourAxisLabels,
      hourChartPoints,
      hourPolylinePoints,
      hourRows,
      isLoading,
      isHourTick,
      languageTableRows,
      lebanonCityRows,
      lebanonPreciseTableRows,
      lebanonTableRows,
      limit,
      loadAnalytics,
      locationTableRows,
      metrics,
      pageRows,
      pageTableRows,
      optionValue,
      preciseLocationTableRows,
      precisionRows,
      providerTableRows,
      quickRanges,
      recentEvents,
      referrerTableRows,
      resetFilters,
      saveToken,
      setQuickRange,
      sessionTableRows,
      shortId,
      sortMetric,
      storageClass,
      storageLabel,
      summary,
      tabs,
      tokenInput,
    }
  },
})
