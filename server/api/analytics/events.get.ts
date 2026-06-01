import { createError, defineEventHandler, getHeader, getQuery } from 'h3'
import { readAnalyticsRecords } from '../../utils/analytics-storage'
import {
  filterAnalyticsRecords,
  parseAnalyticsFilters,
  parseAnalyticsLimit,
} from '../../utils/analytics-report'

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

  const scanLimit = parseAnalyticsLimit(query.scanLimit || query.limit, 10_000, 50_000)
  const eventLimit = parseAnalyticsLimit(query.eventLimit, 200, 1_000)
  const filters = parseAnalyticsFilters(query)
  const { records, storage } = await readAnalyticsRecords(event, {
    d1BindingName: String(runtimeConfig.analyticsD1Binding || ''),
    logPath: String(runtimeConfig.analyticsLogPath || ''),
    limit: scanLimit,
  })
  const filteredRecords = filterAnalyticsRecords(records, filters)

  return {
    storage,
    scanned: records.length,
    matched: filteredRecords.length,
    count: Math.min(filteredRecords.length, eventLimit),
    filters,
    events: filteredRecords.slice(-eventLimit).reverse(),
  }
})
