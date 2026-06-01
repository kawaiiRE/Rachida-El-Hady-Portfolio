import { createHmac } from 'node:crypto'
import { createError, defineEventHandler, getHeader, readBody } from 'h3'
import { writeAnalyticsRecord } from '../../utils/analytics-storage'

const MAX_BODY_SIZE = 32_000
const MAX_STRING_LENGTH = 1_000
const MAX_ARRAY_LENGTH = 20
const MAX_OBJECT_KEYS = 60

const cleanString = (value: unknown, maxLength = MAX_STRING_LENGTH): string => {
  if (typeof value !== 'string') return ''

  return value
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .trim()
    .slice(0, maxLength)
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

const createIpHash = (ipAddress: string, salt: string): string => {
  if (!ipAddress || !salt) {
    return ''
  }

  return createHmac('sha256', salt).update(ipAddress).digest('hex')
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

const getCloudflareColo = (event: Parameters<typeof getHeader>[0]): string => {
  const explicitColo = getFirstHeader(event, ['cf-colo'])

  if (explicitColo) {
    return explicitColo
  }

  const ray = getFirstHeader(event, ['cf-ray'])
  const [, colo] = ray.split('-')

  return cleanString(colo || '', 20).toUpperCase()
}

const getGeoProvider = (event: Parameters<typeof getHeader>[0]): string => {
  if (getFirstHeader(event, ['x-vercel-ip-city', 'x-vercel-ip-country'])) return 'vercel'
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

const getGeoPayload = (event: Parameters<typeof getHeader>[0]) => {
  const appEngineCoordinates = getAppEngineCityLatLong(event)
  const latitude =
    getNumberHeader(event, [
      'x-vercel-ip-latitude',
      'cloudfront-viewer-latitude',
      'cf-iplatitude',
      'x-latitude',
    ]) ?? appEngineCoordinates.latitude
  const longitude =
    getNumberHeader(event, [
      'x-vercel-ip-longitude',
      'cloudfront-viewer-longitude',
      'cf-iplongitude',
      'x-longitude',
    ]) ?? appEngineCoordinates.longitude
  const city = getFirstHeader(event, [
    'x-vercel-ip-city',
    'cloudfront-viewer-city',
    'cf-ipcity',
    'x-appengine-city',
    'x-city',
  ])
  const region = getFirstHeader(event, [
    'x-vercel-ip-country-region',
    'cloudfront-viewer-country-region-name',
    'cloudfront-viewer-country-region',
    'cf-region',
    'x-appengine-region',
    'x-region',
  ])
  const countryCode = getFirstHeader(event, [
    'x-vercel-ip-country',
    'cf-ipcountry',
    'cloudfront-viewer-country',
    'x-appengine-country',
    'x-country-code',
  ]).toUpperCase()
  const country = getFirstHeader(event, ['cloudfront-viewer-country-name', 'x-country-name'])
  const postalCode = getFirstHeader(event, [
    'x-vercel-ip-postal-code',
    'cloudfront-viewer-postal-code',
    'cf-postal-code',
    'x-postal-code',
  ])
  const timezone = getFirstHeader(event, [
    'x-vercel-ip-timezone',
    'cloudfront-viewer-time-zone',
    'cf-timezone',
    'x-timezone',
  ])
  const metroCode = getFirstHeader(event, [
    'cloudfront-viewer-metro-code',
    'cf-metro-code',
    'x-metro-code',
  ])
  const continent = getFirstHeader(event, ['x-vercel-ip-continent', 'cf-ipcontinent'])
  const colo = getCloudflareColo(event)
  const precision = city ? 'city' : region ? 'region' : countryCode || country ? 'country' : 'none'

  return {
    provider: getGeoProvider(event),
    precision,
    isCityLevel: Boolean(city),
    countryCode,
    country,
    region,
    city,
    postalCode,
    timezone,
    continent,
    latitude,
    longitude,
    metroCode,
    colo,
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
      geo: getGeoPayload(event),
      ipHash: createIpHash(clientIp, String(runtimeConfig.analyticsIpSalt || '')),
    },
    payload: cleanValue(body) as Record<string, unknown>,
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
