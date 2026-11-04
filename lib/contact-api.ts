import { CONTACT_API, CONTACT_MESSAGES, type ContactErrorCode } from '~/constants/contact'

export interface ContactChallenge {
  token: string
  /** ISO timestamp after which the token is refused as expired. */
  expiresAt: string
  /** Seconds that must pass between the token being issued and the submission. */
  minSubmitSeconds: number
}

export interface ContactMessageInput {
  name: string
  email: string
  subject?: string
  message: string
  /**
   * The honeypot field, forwarded exactly as the form holds it. A person leaves it empty,
   * so a value here is how the server recognises a script and discards the submission.
   */
  honeypot?: string
}

export type ContactChallengeResult =
  | { ok: true; challenge: ContactChallenge }
  | { ok: false; code: ContactErrorCode; message: string }

export type ContactSubmitResult =
  | { ok: true; reference: string }
  | {
      ok: false
      code: ContactErrorCode
      message: string
      fieldErrors?: Record<string, string>
      /** Whether sending the same message again could succeed. */
      retryable: boolean
      /** Whether the token is spent or rejected, so a new one is needed before retrying. */
      refreshChallenge: boolean
    }

interface ApiErrorBody {
  message?: unknown
  code?: unknown
  fieldErrors?: unknown
}

export interface ContactApiOptions {
  baseUrl: string
  /** Injected so the client can be driven in tests without a browser. */
  fetchImpl?: typeof fetch
}

const KNOWN_CODES = new Set<string>([
  'VALIDATION_ERROR',
  'CHALLENGE_INVALID',
  'SUBMITTED_TOO_FAST',
  'PAYLOAD_TOO_LARGE',
  'RATE_LIMITED',
  'MAIL_UNAVAILABLE',
  'BAD_REQUEST',
  'INTERNAL_ERROR',
])

const resolveUrl = (baseUrl: string, path: string): string =>
  `${baseUrl.replace(/\/+$/, '')}${path}`

const readJson = async (response: Response): Promise<unknown> => {
  try {
    return await response.json()
  } catch {
    return null
  }
}

const asRecord = (value: unknown): Record<string, unknown> | null =>
  typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : null

const readFieldErrors = (value: unknown): Record<string, string> | undefined => {
  const record = asRecord(value)
  if (!record) return undefined

  const fieldErrors: Record<string, string> = {}
  for (const [field, message] of Object.entries(record)) {
    if (typeof message === 'string' && message.length > 0) fieldErrors[field] = message
  }

  return Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined
}

/**
 * The API returns a message that is already safe to show, so it is preferred. The local
 * fallback covers a proxy error page or any body that is not the documented shape.
 */
const readErrorBody = (body: unknown, status: number) => {
  const record = asRecord(body) as ApiErrorBody | null
  const rawCode = typeof record?.code === 'string' ? record.code : ''
  const code: ContactErrorCode = KNOWN_CODES.has(rawCode)
    ? (rawCode as ContactErrorCode)
    : status === 429
      ? 'RATE_LIMITED'
      : status === 413
        ? 'PAYLOAD_TOO_LARGE'
        : status >= 500
          ? 'MAIL_UNAVAILABLE'
          : 'BAD_REQUEST'
  const apiMessage = typeof record?.message === 'string' ? record.message.trim() : ''

  return { code, apiMessage, fieldErrors: readFieldErrors(record?.fieldErrors) }
}

const FALLBACKS: Record<ContactErrorCode, string> = {
  VALIDATION_ERROR: CONTACT_MESSAGES.validation,
  CHALLENGE_INVALID: CONTACT_MESSAGES.challengeInvalid,
  SUBMITTED_TOO_FAST: CONTACT_MESSAGES.tooFast,
  PAYLOAD_TOO_LARGE: CONTACT_MESSAGES.tooLong,
  RATE_LIMITED: CONTACT_MESSAGES.rateLimited,
  MAIL_UNAVAILABLE: CONTACT_MESSAGES.mailUnavailable,
  BAD_REQUEST: CONTACT_MESSAGES.unexpected,
  INTERNAL_ERROR: CONTACT_MESSAGES.unexpected,
  NETWORK_ERROR: CONTACT_MESSAGES.networkError,
  CHALLENGE_UNAVAILABLE: CONTACT_MESSAGES.challengeUnavailable,
}

/**
 * Refusals that leave the message undelivered but are worth retrying as-is, and whether
 * the challenge token survived them. The token is verified after validation and claimed
 * before delivery, so only a refusal at or after that point consumes it.
 */
const RETRY_POLICY: Record<ContactErrorCode, { retryable: boolean; refreshChallenge: boolean }> = {
  VALIDATION_ERROR: { retryable: false, refreshChallenge: false },
  PAYLOAD_TOO_LARGE: { retryable: false, refreshChallenge: false },
  BAD_REQUEST: { retryable: false, refreshChallenge: true },
  SUBMITTED_TOO_FAST: { retryable: true, refreshChallenge: false },
  RATE_LIMITED: { retryable: false, refreshChallenge: false },
  CHALLENGE_INVALID: { retryable: true, refreshChallenge: true },
  MAIL_UNAVAILABLE: { retryable: true, refreshChallenge: true },
  INTERNAL_ERROR: { retryable: true, refreshChallenge: true },
  NETWORK_ERROR: { retryable: true, refreshChallenge: false },
  CHALLENGE_UNAVAILABLE: { retryable: true, refreshChallenge: true },
}

const failure = (
  code: ContactErrorCode,
  message?: string,
  fieldErrors?: Record<string, string>,
): Extract<ContactSubmitResult, { ok: false }> => ({
  ok: false,
  code,
  message: message && message.length > 0 ? message : FALLBACKS[code],
  ...(fieldErrors ? { fieldErrors } : {}),
  ...RETRY_POLICY[code],
})

export const isContactChallengeUsable = (
  challenge: ContactChallenge | null,
  now: number = Date.now(),
): challenge is ContactChallenge => {
  if (!challenge) return false
  const expiresAt = Date.parse(challenge.expiresAt)
  return Number.isFinite(expiresAt) && expiresAt > now
}

/** Seconds still to wait before the token will be accepted, 0 once it is old enough. */
export const contactChallengeWaitSeconds = (
  challenge: ContactChallenge,
  issuedAt: number,
  now: number = Date.now(),
): number => Math.max(0, Math.ceil((issuedAt + challenge.minSubmitSeconds * 1000 - now) / 1000))

export const requestContactChallenge = async (
  options: ContactApiOptions,
): Promise<ContactChallengeResult> => {
  const request = options.fetchImpl ?? fetch

  let response: Response
  try {
    response = await request(resolveUrl(options.baseUrl, CONTACT_API.challengePath), {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(15_000),
    })
  } catch {
    return {
      ok: false,
      code: 'CHALLENGE_UNAVAILABLE',
      message: FALLBACKS.CHALLENGE_UNAVAILABLE,
    }
  }

  const body = await readJson(response)

  if (!response.ok) {
    const { code, apiMessage } = readErrorBody(body, response.status)
    const isRateLimited = code === 'RATE_LIMITED'
    return {
      ok: false,
      code: isRateLimited ? 'RATE_LIMITED' : 'CHALLENGE_UNAVAILABLE',
      message: isRateLimited
        ? apiMessage || FALLBACKS.RATE_LIMITED
        : FALLBACKS.CHALLENGE_UNAVAILABLE,
    }
  }

  const record = asRecord(body)
  const token = typeof record?.token === 'string' ? record.token : ''
  const expiresAt = typeof record?.expiresAt === 'string' ? record.expiresAt : ''
  const minSubmitSeconds =
    typeof record?.minSubmitSeconds === 'number' && Number.isFinite(record.minSubmitSeconds)
      ? record.minSubmitSeconds
      : 0

  if (!token || !expiresAt) {
    return {
      ok: false,
      code: 'CHALLENGE_UNAVAILABLE',
      message: FALLBACKS.CHALLENGE_UNAVAILABLE,
    }
  }

  return { ok: true, challenge: { token, expiresAt, minSubmitSeconds } }
}

export const submitContactMessage = async (
  input: ContactMessageInput,
  challengeToken: string,
  options: ContactApiOptions,
): Promise<ContactSubmitResult> => {
  const request = options.fetchImpl ?? fetch
  const payload = {
    name: input.name,
    email: input.email,
    ...(input.subject ? { subject: input.subject } : {}),
    message: input.message,
    challenge: challengeToken,
    // Empty for a person; forwarded so the server can discard a script that filled it in.
    [CONTACT_API.honeypotField]: input.honeypot ?? '',
  }
  const body = JSON.stringify(payload)

  if (new TextEncoder().encode(body).length > CONTACT_API.bodyLimitBytes) {
    return failure('PAYLOAD_TOO_LARGE')
  }

  let response: Response
  try {
    response = await request(resolveUrl(options.baseUrl, CONTACT_API.submitPath), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body,
      signal: AbortSignal.timeout(15_000),
    })
  } catch {
    return failure('NETWORK_ERROR')
  }

  const responseBody = await readJson(response)

  if (!response.ok) {
    const { code, apiMessage, fieldErrors } = readErrorBody(responseBody, response.status)
    return failure(code, apiMessage, fieldErrors)
  }

  const record = asRecord(responseBody)
  const reference = typeof record?.reference === 'string' ? record.reference : ''
  if (record?.status !== 'received') return failure('INTERNAL_ERROR')

  return { ok: true, reference }
}
