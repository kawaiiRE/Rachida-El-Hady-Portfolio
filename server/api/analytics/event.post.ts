import { createError, defineEventHandler, getHeader, readBody } from 'h3'
import type { H3Event } from 'h3'
import { writeAnalyticsRecord } from '../../utils/analytics-storage'

const MAX_BODY_SIZE = 32_000
const MAX_STRING_LENGTH = 1_000
const MAX_ARRAY_LENGTH = 20
const MAX_OBJECT_KEYS = 60
const LEBANON_COORDINATE_BOUNDS = {
  minLatitude: 33.02,
  maxLatitude: 34.7,
  minLongitude: 35.05,
  maxLongitude: 36.65,
}
const LEBANON_LOCALITIES = [
  { city: 'Beirut', region: 'Beirut', latitude: 33.8938, longitude: 35.5018 },
  { city: 'Hamra', region: 'Beirut', latitude: 33.8954, longitude: 35.4823 },
  { city: 'Ras Beirut', region: 'Beirut', latitude: 33.9007, longitude: 35.4774 },
  { city: 'Verdun', region: 'Beirut', latitude: 33.8873, longitude: 35.4826 },
  { city: 'Achrafieh', region: 'Beirut', latitude: 33.8878, longitude: 35.5221 },
  { city: 'Gemmayzeh', region: 'Beirut', latitude: 33.8952, longitude: 35.5156 },
  { city: 'Mar Mikhael', region: 'Beirut', latitude: 33.8962, longitude: 35.5246 },
  { city: 'Badaro', region: 'Beirut', latitude: 33.8736, longitude: 35.5178 },
  { city: 'Baabda', region: 'Mount Lebanon', latitude: 33.8339, longitude: 35.5442 },
  { city: 'Hazmieh', region: 'Mount Lebanon', latitude: 33.8528, longitude: 35.5364 },
  { city: 'Furn El Chebbak', region: 'Mount Lebanon', latitude: 33.8721, longitude: 35.5288 },
  { city: 'Chiyah', region: 'Mount Lebanon', latitude: 33.8617, longitude: 35.5174 },
  { city: 'Haret Hreik', region: 'Mount Lebanon', latitude: 33.8543, longitude: 35.5012 },
  { city: 'Bourj Hammoud', region: 'Mount Lebanon', latitude: 33.8933, longitude: 35.5403 },
  { city: 'Sin El Fil', region: 'Mount Lebanon', latitude: 33.8781, longitude: 35.5357 },
  { city: 'Dekwaneh', region: 'Mount Lebanon', latitude: 33.8817, longitude: 35.5487 },
  { city: 'Jdeideh', region: 'Mount Lebanon', latitude: 33.9025, longitude: 35.5662 },
  { city: 'Zalka', region: 'Mount Lebanon', latitude: 33.9038, longitude: 35.5822 },
  { city: 'Jal El Dib', region: 'Mount Lebanon', latitude: 33.9172, longitude: 35.5891 },
  { city: 'Antelias', region: 'Mount Lebanon', latitude: 33.9203, longitude: 35.5941 },
  { city: 'Dbayeh', region: 'Mount Lebanon', latitude: 33.9436, longitude: 35.5899 },
  { city: 'Broummana', region: 'Mount Lebanon', latitude: 33.8867, longitude: 35.6331 },
  { city: 'Beit Mery', region: 'Mount Lebanon', latitude: 33.8628, longitude: 35.6086 },
  { city: 'Aley', region: 'Mount Lebanon', latitude: 33.8114, longitude: 35.5969 },
  { city: 'Bhamdoun', region: 'Mount Lebanon', latitude: 33.809, longitude: 35.6593 },
  { city: 'Jounieh', region: 'Mount Lebanon', latitude: 33.9808, longitude: 35.6178 },
  { city: 'Kaslik', region: 'Mount Lebanon', latitude: 33.982, longitude: 35.6172 },
  { city: 'Zouk Mikael', region: 'Mount Lebanon', latitude: 33.9689, longitude: 35.6152 },
  { city: 'Byblos', region: 'Mount Lebanon', latitude: 34.123, longitude: 35.6519 },
  { city: 'Batroun', region: 'North Lebanon', latitude: 34.2553, longitude: 35.6581 },
  { city: 'Tripoli', region: 'North Lebanon', latitude: 34.4367, longitude: 35.8497 },
  { city: 'Mina', region: 'North Lebanon', latitude: 34.4494, longitude: 35.8119 },
  { city: 'Zgharta', region: 'North Lebanon', latitude: 34.3978, longitude: 35.8956 },
  { city: 'Ehden', region: 'North Lebanon', latitude: 34.3079, longitude: 35.999 },
  { city: 'Amioun', region: 'North Lebanon', latitude: 34.2992, longitude: 35.8097 },
  { city: 'Halba', region: 'Akkar', latitude: 34.5422, longitude: 36.0797 },
  { city: 'Zahle', region: 'Bekaa', latitude: 33.8467, longitude: 35.902 },
  { city: 'Chtaura', region: 'Bekaa', latitude: 33.8192, longitude: 35.8536 },
  { city: 'Baalbek', region: 'Baalbek-Hermel', latitude: 34.0058, longitude: 36.2181 },
  { city: 'Hermel', region: 'Baalbek-Hermel', latitude: 34.3942, longitude: 36.3844 },
  { city: 'Rashaya', region: 'Bekaa', latitude: 33.5008, longitude: 35.8433 },
  { city: 'Saida', region: 'South Lebanon', latitude: 33.563, longitude: 35.3688 },
  { city: 'Jiyyeh', region: 'Mount Lebanon', latitude: 33.6742, longitude: 35.4253 },
  { city: 'Damour', region: 'Mount Lebanon', latitude: 33.7297, longitude: 35.4556 },
  { city: 'Jezzine', region: 'South Lebanon', latitude: 33.5417, longitude: 35.5844 },
  { city: 'Tyre', region: 'South Lebanon', latitude: 33.2704, longitude: 35.2038 },
  { city: 'Nabatieh', region: 'Nabatieh', latitude: 33.3789, longitude: 35.4839 },
  { city: 'Bint Jbeil', region: 'Nabatieh', latitude: 33.1196, longitude: 35.4336 },
  { city: 'Marjayoun', region: 'Nabatieh', latitude: 33.3603, longitude: 35.5917 },
  { city: 'Hasbaya', region: 'Nabatieh', latitude: 33.3978, longitude: 35.685 },
]

const cleanString = (value: unknown, maxLength = MAX_STRING_LENGTH): string => {
  if (typeof value !== 'string') return ''

  return value
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .trim()
    .slice(0, maxLength)
}

const roundCoordinate = (value: number): number => Math.round(value * 10_000) / 10_000

const roundDistance = (value: number): number => Math.round(value * 10) / 10

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value)

const getObjectNumber = (
  value: Record<string, unknown>,
  key: string,
  fallback: number | null = null,
): number | null => {
  const nextValue = value[key]
  const numberValue = typeof nextValue === 'number' ? nextValue : Number(nextValue)

  return Number.isFinite(numberValue) ? numberValue : fallback
}

const getNestedValue = (value: unknown, path: string[]): unknown =>
  path.reduce<unknown>((currentValue, key) => asObject(currentValue)[key], value)

const getDistanceKm = (
  firstLatitude: number,
  firstLongitude: number,
  secondLatitude: number,
  secondLongitude: number,
): number => {
  const earthRadiusKm = 6371
  const toRadians = (degrees: number): number => (degrees * Math.PI) / 180
  const latitudeDistance = toRadians(secondLatitude - firstLatitude)
  const longitudeDistance = toRadians(secondLongitude - firstLongitude)
  const firstLatitudeRadians = toRadians(firstLatitude)
  const secondLatitudeRadians = toRadians(secondLatitude)
  const haversine =
    Math.sin(latitudeDistance / 2) ** 2 +
    Math.cos(firstLatitudeRadians) *
      Math.cos(secondLatitudeRadians) *
      Math.sin(longitudeDistance / 2) ** 2

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
}

const isInsideLebanonBounds = (latitude: number, longitude: number): boolean =>
  latitude >= LEBANON_COORDINATE_BOUNDS.minLatitude &&
  latitude <= LEBANON_COORDINATE_BOUNDS.maxLatitude &&
  longitude >= LEBANON_COORDINATE_BOUNDS.minLongitude &&
  longitude <= LEBANON_COORDINATE_BOUNDS.maxLongitude

const getNearestLebanonLocality = (latitude: number, longitude: number) => {
  if (!isInsideLebanonBounds(latitude, longitude)) {
    return null
  }

  const nearest = LEBANON_LOCALITIES.map((locality) => ({
    ...locality,
    distanceKm: getDistanceKm(latitude, longitude, locality.latitude, locality.longitude),
  })).sort((first, second) => first.distanceKm - second.distanceKm)[0]

  if (!nearest) {
    return null
  }

  return {
    city: nearest.city,
    region: nearest.region,
    countryCode: 'LB',
    country: 'Lebanon',
    distanceKm: roundDistance(nearest.distanceKm),
  }
}

const cleanValue = (value: unknown, depth = 0): unknown => {
  if (depth > 6) return null

  if (typeof value === 'number' || typeof value === 'boolean' || value === null) {
    return value
  }

  if (typeof value === 'string') {
    return cleanString(value)
  }

  if (Array.isArray(value)) {
    return value.slice(0, MAX_ARRAY_LENGTH).map((item) => cleanValue(item, depth + 1))
  }

  if (typeof value === 'object' && value) {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .slice(0, MAX_OBJECT_KEYS)
        .map(([key, item]) => [cleanString(key, 80), cleanValue(item, depth + 1)]),
    )
  }

  return null
}

const getClientIp = (event: Parameters<typeof getHeader>[0]): string => {
  const forwardedFor = cleanString(getHeader(event, 'x-forwarded-for') || '')
    .split(',')
    .map((value) => value.trim())
    .find(Boolean)

  return (
    cleanString(getHeader(event, 'cf-connecting-ip') || '') ||
    cleanString(getHeader(event, 'x-real-ip') || '') ||
    forwardedFor ||
    cleanString(event.node.req.socket.remoteAddress || '')
  )
}

const createIpHash = async (ipAddress: string, salt: string): Promise<string> => {
  if (!ipAddress || !salt) {
    return ''
  }

  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(salt),
    {
      name: 'HMAC',
      hash: 'SHA-256',
    },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(ipAddress))

  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

const safeDecode = (value: string): string => {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

const getFirstHeader = (event: Parameters<typeof getHeader>[0], headers: string[]): string => {
  for (const header of headers) {
    const value = cleanString(getHeader(event, header) || '')

    if (value) {
      return cleanString(safeDecode(value))
    }
  }

  return ''
}

const getNumberHeader = (
  event: Parameters<typeof getHeader>[0],
  headers: string[],
): number | null => {
  const value = getFirstHeader(event, headers)

  if (!value) {
    return null
  }

  const parsedValue = Number.parseFloat(value)

  return Number.isFinite(parsedValue) ? parsedValue : null
}

const asObject = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : {}

const hasKeys = (value: Record<string, unknown>): boolean => Object.keys(value).length > 0

const getCloudflareRequestCf = (event: H3Event): Record<string, unknown> => {
  const context = asObject(event.context)
  const cloudflare = asObject(context.cloudflare)
  const platform = asObject(context._platform)
  const platformCloudflare = asObject(platform.cloudflare)
  const cloudflareRequest = asObject(cloudflare.request)
  const cloudflareEvent = asObject(cloudflare.event)
  const cloudflareEventRequest = asObject(cloudflareEvent.request)
  const platformRequest = asObject(platformCloudflare.request)
  const platformEvent = asObject(platformCloudflare.event)
  const platformEventRequest = asObject(platformEvent.request)
  const nodeRequest = asObject(event.node.req)
  const candidates = [
    asObject(context.cf),
    asObject(platform.cf),
    asObject(cloudflareRequest.cf),
    asObject(cloudflare.cf),
    asObject(platformRequest.cf),
    asObject(platformCloudflare.cf),
    asObject(cloudflareEventRequest.cf),
    asObject(platformEventRequest.cf),
    asObject(nodeRequest.cf),
  ]

  return candidates.find(hasKeys) || {}
}

const getCloudflareString = (cf: Record<string, unknown>, keys: string[]): string => {
  for (const key of keys) {
    const value = cf[key]

    if (typeof value === 'string' || typeof value === 'number') {
      const cleanedValue = cleanString(String(value), 120)

      if (cleanedValue) {
        return safeDecode(cleanedValue)
      }
    }
  }

  return ''
}

const getCloudflareNumber = (cf: Record<string, unknown>, keys: string[]): number | null => {
  const value = getCloudflareString(cf, keys)

  if (!value) {
    return null
  }

  const parsedValue = Number.parseFloat(value)

  return Number.isFinite(parsedValue) ? parsedValue : null
}

const getAppEngineCityLatLong = (
  event: Parameters<typeof getHeader>[0],
): { latitude: number | null; longitude: number | null } => {
  const [latitude, longitude] = getFirstHeader(event, ['x-appengine-citylatlong'])
    .split(',')
    .map((value) => Number.parseFloat(value.trim()))

  return {
    latitude: Number.isFinite(latitude) ? latitude : null,
    longitude: Number.isFinite(longitude) ? longitude : null,
  }
}

const getCloudflareColo = (
  event: Parameters<typeof getHeader>[0],
  cf: Record<string, unknown>,
): string => {
  const explicitColo = getFirstHeader(event, ['cf-colo'])

  if (explicitColo) {
    return explicitColo
  }

  const requestColo = getCloudflareString(cf, ['colo'])

  if (requestColo) {
    return requestColo.toUpperCase()
  }

  const ray = getFirstHeader(event, ['cf-ray'])
  const [, colo] = ray.split('-')

  return cleanString(colo || '', 20).toUpperCase()
}

const getGeoProvider = (
  event: Parameters<typeof getHeader>[0],
  cf: Record<string, unknown>,
): string => {
  if (getFirstHeader(event, ['x-vercel-ip-city', 'x-vercel-ip-country'])) return 'vercel'
  if (Object.keys(cf).length > 0) return 'cloudflare'
  if (getFirstHeader(event, ['cf-ipcountry', 'cf-ray', 'cf-ipcity'])) return 'cloudflare'
  if (getFirstHeader(event, ['cloudfront-viewer-country', 'cloudfront-viewer-city'])) {
    return 'cloudfront'
  }
  if (getFirstHeader(event, ['x-appengine-country', 'x-appengine-city'])) {
    return 'google-app-engine'
  }
  if (getFirstHeader(event, ['x-country-code', 'x-city'])) return 'generic-proxy'

  return ''
}

const getGeoValue = (
  event: H3Event,
  cf: Record<string, unknown>,
  headers: string[],
  cfKeys: string[],
): string => getFirstHeader(event, headers) || getCloudflareString(cf, cfKeys)

const getGeoPayload = (event: H3Event) => {
  const cloudflareCf = getCloudflareRequestCf(event)
  const appEngineCoordinates = getAppEngineCityLatLong(event)
  const latitude =
    getNumberHeader(event, [
      'x-vercel-ip-latitude',
      'cloudfront-viewer-latitude',
      'cf-iplatitude',
      'x-latitude',
    ]) ??
    getCloudflareNumber(cloudflareCf, ['latitude']) ??
    appEngineCoordinates.latitude
  const longitude =
    getNumberHeader(event, [
      'x-vercel-ip-longitude',
      'cloudfront-viewer-longitude',
      'cf-iplongitude',
      'x-longitude',
    ]) ??
    getCloudflareNumber(cloudflareCf, ['longitude']) ??
    appEngineCoordinates.longitude
  const city = getGeoValue(
    event,
    cloudflareCf,
    ['x-vercel-ip-city', 'cloudfront-viewer-city', 'cf-ipcity', 'x-appengine-city', 'x-city'],
    ['city'],
  )
  const region = getGeoValue(
    event,
    cloudflareCf,
    [
      'x-vercel-ip-country-region',
      'cloudfront-viewer-country-region-name',
      'cloudfront-viewer-country-region',
      'cf-region',
      'x-appengine-region',
      'x-region',
    ],
    ['region', 'regionCode'],
  )
  const regionCode = getCloudflareString(cloudflareCf, ['regionCode'])
  const countryCode = getGeoValue(
    event,
    cloudflareCf,
    [
      'x-vercel-ip-country',
      'cf-ipcountry',
      'cloudfront-viewer-country',
      'x-appengine-country',
      'x-country-code',
    ],
    ['country'],
  ).toUpperCase()
  const country = getFirstHeader(event, ['cloudfront-viewer-country-name', 'x-country-name'])
  const postalCode = getGeoValue(
    event,
    cloudflareCf,
    ['x-vercel-ip-postal-code', 'cloudfront-viewer-postal-code', 'cf-postal-code', 'x-postal-code'],
    ['postalCode'],
  )
  const timezone = getGeoValue(
    event,
    cloudflareCf,
    ['x-vercel-ip-timezone', 'cloudfront-viewer-time-zone', 'cf-timezone', 'x-timezone'],
    ['timezone'],
  )
  const metroCode = getGeoValue(
    event,
    cloudflareCf,
    ['cloudfront-viewer-metro-code', 'cf-metro-code', 'x-metro-code'],
    ['metroCode'],
  )
  const continent = getGeoValue(
    event,
    cloudflareCf,
    ['x-vercel-ip-continent', 'cf-ipcontinent'],
    ['continent'],
  )
  const colo = getCloudflareColo(event, cloudflareCf)
  const precision = postalCode
    ? 'postal'
    : city
      ? 'city'
      : region
        ? 'region'
        : countryCode || country
          ? 'country'
          : 'none'

  return {
    provider: getGeoProvider(event, cloudflareCf),
    precision,
    isCityLevel: Boolean(city),
    source: 'ip',
    countryCode,
    country,
    region,
    regionCode,
    city,
    postalCode,
    timezone,
    continent,
    latitude,
    longitude,
    accuracyMeters: null,
    metroCode,
    colo,
  }
}

const getBrowserGeoPayload = (body: Record<string, unknown>) => {
  const preciseLocation = asObject(getNestedValue(body, ['geo', 'precise']))
  const latitude = getObjectNumber(preciseLocation, 'latitude')
  const longitude = getObjectNumber(preciseLocation, 'longitude')

  if (!isFiniteNumber(latitude) || !isFiniteNumber(longitude)) {
    return null
  }

  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return null
  }

  const accuracyMeters = getObjectNumber(preciseLocation, 'accuracyMeters', 0) || 0

  return {
    source: cleanString(preciseLocation.source || 'browser-geolocation', 80),
    permission: cleanString(preciseLocation.permission || '', 40),
    capturedAt: cleanString(preciseLocation.capturedAt || '', 80),
    latitude: roundCoordinate(latitude),
    longitude: roundCoordinate(longitude),
    accuracyMeters: Math.max(0, Math.round(accuracyMeters)),
  }
}

const getBestGeoPayload = (
  ipGeo: ReturnType<typeof getGeoPayload>,
  browserGeo: ReturnType<typeof getBrowserGeoPayload>,
) => {
  if (!browserGeo) {
    return ipGeo
  }

  const nearestLocality = getNearestLebanonLocality(browserGeo.latitude, browserGeo.longitude)
  const hasHighAccuracy = browserGeo.accuracyMeters > 0 && browserGeo.accuracyMeters <= 2500
  const hasUsableAccuracy = browserGeo.accuracyMeters === 0 || browserGeo.accuracyMeters <= 15_000
  const precision = nearestLocality
    ? hasHighAccuracy
      ? 'browser-locality'
      : 'browser-coordinate'
    : hasUsableAccuracy
      ? 'browser-coordinate'
      : 'browser-coordinate-low'

  return {
    ...ipGeo,
    provider: 'browser-geolocation',
    precision,
    isCityLevel: Boolean(nearestLocality?.city),
    source: 'browser-geolocation',
    countryCode: nearestLocality?.countryCode || ipGeo.countryCode,
    country: nearestLocality?.country || ipGeo.country,
    region: nearestLocality?.region || '',
    city: nearestLocality?.city || '',
    postalCode: '',
    latitude: browserGeo.latitude,
    longitude: browserGeo.longitude,
    accuracyMeters: browserGeo.accuracyMeters,
    browserCapturedAt: browserGeo.capturedAt,
    browserPermission: browserGeo.permission,
    nearestLocalityDistanceKm: nearestLocality?.distanceKm ?? null,
    ipProvider: ipGeo.provider,
    ipPrecision: ipGeo.precision,
    ipCountryCode: ipGeo.countryCode,
    ipRegion: ipGeo.region,
    ipCity: ipGeo.city,
    ipLatitude: ipGeo.latitude,
    ipLongitude: ipGeo.longitude,
  }
}

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()
  const body = await readBody<Record<string, unknown>>(event)
  const serializedBody = JSON.stringify(body || {})

  if (serializedBody.length > MAX_BODY_SIZE) {
    throw createError({
      statusCode: 413,
      statusMessage: 'Analytics payload is too large.',
    })
  }

  const eventName = cleanString(body?.eventName || '', 80)

  if (!eventName) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Analytics eventName is required.',
    })
  }

  const clientIp = getClientIp(event)
  const ipHash = await createIpHash(clientIp, String(runtimeConfig.analyticsIpSalt || ''))
  const payload = cleanValue(body) as Record<string, unknown>
  const ipGeo = getGeoPayload(event)
  const browserGeo = getBrowserGeoPayload(payload)
  const record = {
    id: crypto.randomUUID(),
    receivedAt: new Date().toISOString(),
    eventName,
    source: 'portfolio-site',
    request: {
      userAgent: cleanString(getHeader(event, 'user-agent') || '', 500),
      acceptLanguage: cleanString(getHeader(event, 'accept-language') || '', 300),
      referrer: cleanString(getHeader(event, 'referer') || '', 500),
      host: cleanString(getHeader(event, 'host') || '', 200),
      geo: getBestGeoPayload(ipGeo, browserGeo),
      ipGeo: browserGeo ? ipGeo : undefined,
      ipHash,
    },
    payload,
  }

  let storage: 'd1' | 'file' | 'unconfigured' = 'unconfigured'

  try {
    storage = await writeAnalyticsRecord(event, record, {
      d1BindingName: String(runtimeConfig.analyticsD1Binding || ''),
      logPath: String(runtimeConfig.analyticsLogPath || ''),
    })
  } catch (error) {
    console.warn('[analytics] Failed to persist analytics event:', error)
  }

  return {
    ok: true,
    storage,
  }
})
