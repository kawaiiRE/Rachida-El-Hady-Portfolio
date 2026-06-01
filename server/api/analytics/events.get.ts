import { readFile } from 'node:fs/promises'
import { isAbsolute, resolve } from 'node:path'
import { createError, defineEventHandler, getHeader, getQuery } from 'h3'

const getLogPath = (configuredPath: string): string => {
  if (!configuredPath) {
    return resolve(process.cwd(), '.data/analytics-events.jsonl')
  }

  return isAbsolute(configuredPath) ? configuredPath : resolve(process.cwd(), configuredPath)
}

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
  const logPath = getLogPath(String(runtimeConfig.analyticsLogPath || ''))

  try {
    const file = await readFile(logPath, 'utf8')
    const lines = file
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(-limit)

    return {
      count: lines.length,
      events: lines.map((line) => JSON.parse(line)),
    }
  } catch (error: unknown) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return {
        count: 0,
        events: [],
      }
    }

    throw error
  }
})
