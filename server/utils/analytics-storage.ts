import type { H3Event } from 'h3'

export type AnalyticsRecord = {
  id: string
  receivedAt: string
  eventName: string
  source: string
  request?: Record<string, unknown>
  payload?: Record<string, unknown>
}

type D1Result<T = unknown> = {
  results?: T[]
}

type D1PreparedStatement = {
  bind: (...values: unknown[]) => D1PreparedStatement
  all: <T = unknown>() => Promise<D1Result<T>>
  run: () => Promise<unknown>
}

type D1Database = {
  prepare: (query: string) => D1PreparedStatement
}

const DEFAULT_LOG_PATH = '.data/analytics-events.jsonl'
const DEFAULT_D1_BINDING = 'ANALYTICS_DB'
const MAX_READ_LIMIT = 50_000

const ANALYTICS_SCHEMA_STATEMENTS = [
  `
    CREATE TABLE IF NOT EXISTS analytics_events (
      id TEXT PRIMARY KEY,
      received_at TEXT NOT NULL,
      event_name TEXT NOT NULL,
      source TEXT NOT NULL,
      visitor_id TEXT,
      session_id TEXT,
      country_code TEXT,
      region TEXT,
      city TEXT,
      page_path TEXT,
      page_full_path TEXT,
      utm_source TEXT,
      utm_medium TEXT,
      utm_campaign TEXT,
      utm_content TEXT,
      click_label TEXT,
      click_href TEXT,
      record_json TEXT NOT NULL
    )
  `,
  'CREATE INDEX IF NOT EXISTS idx_analytics_events_received_at ON analytics_events (received_at)',
  'CREATE INDEX IF NOT EXISTS idx_analytics_events_location ON analytics_events (country_code, region, city)',
  'CREATE INDEX IF NOT EXISTS idx_analytics_events_campaign ON analytics_events (utm_source, utm_medium, utm_campaign, utm_content)',
  'CREATE INDEX IF NOT EXISTS idx_analytics_events_event_name ON analytics_events (event_name)',
]

let schemaReady: Promise<void> | null = null

const importNodeModule = async <T>(specifier: string): Promise<T> =>
  import(/* @vite-ignore */ specifier) as Promise<T>

const getNestedValue = (value: unknown, path: string[]): unknown =>
  path.reduce<unknown>((currentValue, key) => {
    if (!currentValue || typeof currentValue !== 'object') {
      return undefined
    }

    return (currentValue as Record<string, unknown>)[key]
  }, value)

const getStringValue = (value: unknown, path: string[]): string => {
  const nextValue = getNestedValue(value, path)

  return typeof nextValue === 'string' ? nextValue : ''
}

const getCloudflareEnv = (event: H3Event): Record<string, unknown> => {
  const eventContext = event.context as {
    cloudflare?: { env?: Record<string, unknown> }
    _platform?: { cloudflare?: { env?: Record<string, unknown> } }
  }
  const globalEnv = (globalThis as typeof globalThis & { __env__?: Record<string, unknown> })
    .__env__

  return eventContext.cloudflare?.env || eventContext._platform?.cloudflare?.env || globalEnv || {}
}

const isCloudflareRuntime = (event: H3Event): boolean => {
  const eventContext = event.context as {
    cloudflare?: unknown
    _platform?: { cloudflare?: unknown }
  }

  return Boolean(
    eventContext.cloudflare ||
    eventContext._platform?.cloudflare ||
    (globalThis as typeof globalThis & { __env__?: Record<string, unknown> }).__env__,
  )
}

const getD1Database = (event: H3Event, bindingName = DEFAULT_D1_BINDING): D1Database | null => {
  const binding = getCloudflareEnv(event)[bindingName]

  if (binding && typeof binding === 'object' && 'prepare' in binding) {
    return binding as D1Database
  }

  return null
}

const getLogPath = async (configuredPath: string): Promise<string> => {
  const { isAbsolute, resolve } = await importNodeModule<typeof import('node:path')>('node:path')
  const logPath = configuredPath || DEFAULT_LOG_PATH

  return isAbsolute(logPath) ? logPath : resolve(process.cwd(), logPath)
}

const parseLimit = (limit: number): number => {
  if (!Number.isFinite(limit)) {
    return 100
  }

  return Math.min(MAX_READ_LIMIT, Math.max(1, Math.round(limit)))
}

const ensureAnalyticsSchema = async (db: D1Database) => {
  schemaReady =
    schemaReady ||
    (async () => {
      for (const statement of ANALYTICS_SCHEMA_STATEMENTS) {
        await db.prepare(statement).run()
      }
    })()

  await schemaReady
}

const parseRecord = (recordJson: string): AnalyticsRecord | null => {
  try {
    return JSON.parse(recordJson) as AnalyticsRecord
  } catch {
    return null
  }
}

const readLocalAnalyticsRecords = async (
  configuredLogPath: string,
  limit: number,
): Promise<AnalyticsRecord[]> => {
  const { readFile } = await importNodeModule<typeof import('node:fs/promises')>('node:fs/promises')
  const logPath = await getLogPath(configuredLogPath)

  try {
    const file = await readFile(logPath, 'utf8')

    return file
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(-parseLimit(limit))
      .flatMap((line) => {
        const record = parseRecord(line)

        return record ? [record] : []
      })
  } catch (error: unknown) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return []
    }

    throw error
  }
}

const writeLocalAnalyticsRecord = async (record: AnalyticsRecord, configuredLogPath: string) => {
  const { appendFile, mkdir } =
    await importNodeModule<typeof import('node:fs/promises')>('node:fs/promises')
  const { dirname } = await importNodeModule<typeof import('node:path')>('node:path')
  const logPath = await getLogPath(configuredLogPath)

  await mkdir(dirname(logPath), { recursive: true })
  await appendFile(logPath, `${JSON.stringify(record)}\n`, 'utf8')
}

const insertD1AnalyticsRecord = async (db: D1Database, record: AnalyticsRecord) => {
  await ensureAnalyticsSchema(db)

  await db
    .prepare(
      `
        INSERT INTO analytics_events (
          id,
          received_at,
          event_name,
          source,
          visitor_id,
          session_id,
          country_code,
          region,
          city,
          page_path,
          page_full_path,
          utm_source,
          utm_medium,
          utm_campaign,
          utm_content,
          click_label,
          click_href,
          record_json
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
    )
    .bind(
      record.id,
      record.receivedAt,
      record.eventName,
      record.source,
      getStringValue(record, ['payload', 'visitor', 'visitorId']),
      getStringValue(record, ['payload', 'visitor', 'sessionId']),
      getStringValue(record, ['request', 'geo', 'countryCode']),
      getStringValue(record, ['request', 'geo', 'region']),
      getStringValue(record, ['request', 'geo', 'city']),
      getStringValue(record, ['payload', 'page', 'path']),
      getStringValue(record, ['payload', 'page', 'fullPath']),
      getStringValue(record, ['payload', 'page', 'utm', 'source']),
      getStringValue(record, ['payload', 'page', 'utm', 'medium']),
      getStringValue(record, ['payload', 'page', 'utm', 'campaign']),
      getStringValue(record, ['payload', 'page', 'utm', 'content']),
      getStringValue(record, ['payload', 'click', 'label']),
      getStringValue(record, ['payload', 'click', 'href']),
      JSON.stringify(record),
    )
    .run()
}

const readD1AnalyticsRecords = async (
  db: D1Database,
  limit: number,
): Promise<AnalyticsRecord[]> => {
  await ensureAnalyticsSchema(db)

  const result = await db
    .prepare(
      `
        SELECT record_json
        FROM analytics_events
        ORDER BY received_at DESC
        LIMIT ?
      `,
    )
    .bind(parseLimit(limit))
    .all<{ record_json: string }>()

  return (result.results || [])
    .flatMap((row) => {
      const record = parseRecord(row.record_json)

      return record ? [record] : []
    })
    .reverse()
}

export const writeAnalyticsRecord = async (
  event: H3Event,
  record: AnalyticsRecord,
  options: {
    d1BindingName?: string
    logPath?: string
  },
): Promise<'d1' | 'file' | 'unconfigured'> => {
  const db = getD1Database(event, options.d1BindingName || DEFAULT_D1_BINDING)

  if (db) {
    await insertD1AnalyticsRecord(db, record)

    return 'd1'
  }

  if (isCloudflareRuntime(event)) {
    console.warn(
      `[analytics] Cloudflare D1 binding "${options.d1BindingName || DEFAULT_D1_BINDING}" was not found. Analytics event was not persisted.`,
    )

    return 'unconfigured'
  }

  await writeLocalAnalyticsRecord(record, options.logPath || DEFAULT_LOG_PATH)

  return 'file'
}

export const readAnalyticsRecords = async (
  event: H3Event,
  options: {
    d1BindingName?: string
    logPath?: string
    limit: number
  },
): Promise<{ storage: 'd1' | 'file' | 'unconfigured'; records: AnalyticsRecord[] }> => {
  const db = getD1Database(event, options.d1BindingName || DEFAULT_D1_BINDING)

  if (db) {
    return {
      storage: 'd1',
      records: await readD1AnalyticsRecords(db, options.limit),
    }
  }

  if (isCloudflareRuntime(event)) {
    return {
      storage: 'unconfigured',
      records: [],
    }
  }

  return {
    storage: 'file',
    records: await readLocalAnalyticsRecords(options.logPath || DEFAULT_LOG_PATH, options.limit),
  }
}
