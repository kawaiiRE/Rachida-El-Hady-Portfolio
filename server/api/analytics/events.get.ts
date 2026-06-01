import { createError, defineEventHandler, getHeader, getQuery } from 'h3'
import { readAnalyticsRecords } from '../../utils/analytics-storage'

const parseLimit = (value: unknown): number => {
  const limit = Number(value)

  if (!Number.isFinite(limit)) {
    return 100
  }

  return Math.min(500, Math.max(1, Math.round(limit)))
}

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()
  const adminToken = String(runtimeConfig.analyticsAdminToken || '')
  const query = getQuery(event)
  const requestToken =
    String(query.token || '') || String(getHeader(event, 'x-analytics-admin-token') || '')

  if (!adminToken) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Analytics export is not enabled.',
    })
  }

  if (requestToken !== adminToken) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Analytics export token is invalid.',
    })
  }

  const limit = parseLimit(query.limit)
  const { records, storage } = await readAnalyticsRecords(event, {
    d1BindingName: String(runtimeConfig.analyticsD1Binding || ''),
    logPath: String(runtimeConfig.analyticsLogPath || ''),
    limit,
  })

  return {
    storage,
    count: records.length,
    events: records,
  }
})
