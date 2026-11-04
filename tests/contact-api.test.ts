import { describe, expect, it } from 'vitest'
import { CONTACT_API, CONTACT_MESSAGES } from '~/constants/contact'
import {
  contactChallengeWaitSeconds,
  isContactChallengeUsable,
  requestContactChallenge,
  submitContactMessage,
} from '~/lib/contact-api'

const BASE_URL = 'https://api.example.test'

const jsonResponse = (status: number, body: unknown): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

interface Capture {
  url: string
  init?: RequestInit
}

const stubFetch = (response: Response | (() => never), capture: Capture[] = []) =>
  (async (url: string | URL | Request, init?: RequestInit) => {
    capture.push({ url: String(url), init })
    if (typeof response === 'function') response()
    return response
  }) as unknown as typeof fetch

const message = {
  name: 'Jordan Vale',
  email: 'jordan@example.com',
  message: 'A message long enough to pass the minimum length the API enforces.',
}

describe('requestContactChallenge', () => {
  it('reads the token, expiry, and minimum submit delay', async () => {
    const capture: Capture[] = []
    const result = await requestContactChallenge({
      baseUrl: `${BASE_URL}/`,
      fetchImpl: stubFetch(
        jsonResponse(200, {
          token: '1.1761000000000.nonce.signature',
          expiresAt: '2099-01-01T00:00:00.000Z',
          minSubmitSeconds: 3,
        }),
        capture,
      ),
    })

    expect(result).toEqual({
      ok: true,
      challenge: {
        token: '1.1761000000000.nonce.signature',
        expiresAt: '2099-01-01T00:00:00.000Z',
        minSubmitSeconds: 3,
      },
    })
    expect(capture[0]?.url).toBe(`${BASE_URL}${CONTACT_API.challengePath}`)
  })

  it('reports an unreachable API without claiming anything was sent', async () => {
    const result = await requestContactChallenge({
      baseUrl: BASE_URL,
      fetchImpl: stubFetch(() => {
        throw new TypeError('Failed to fetch')
      }),
    })

    expect(result).toEqual({
      ok: false,
      code: 'CHALLENGE_UNAVAILABLE',
      message: CONTACT_MESSAGES.challengeUnavailable,
    })
  })

  it('surfaces a rate limit on the challenge route as a rate limit', async () => {
    const result = await requestContactChallenge({
      baseUrl: BASE_URL,
      fetchImpl: stubFetch(
        jsonResponse(429, {
          message: 'Too many requests. Try again in 1 minute.',
          code: 'RATE_LIMITED',
          requestId: 'req-1',
        }),
      ),
    })

    expect(result).toMatchObject({
      ok: false,
      code: 'RATE_LIMITED',
      message: 'Too many requests. Try again in 1 minute.',
    })
  })

  it('refuses a success body that is missing the token', async () => {
    const result = await requestContactChallenge({
      baseUrl: BASE_URL,
      fetchImpl: stubFetch(jsonResponse(200, { expiresAt: '2099-01-01T00:00:00.000Z' })),
    })

    expect(result).toMatchObject({ ok: false, code: 'CHALLENGE_UNAVAILABLE' })
  })
})

describe('submitContactMessage', () => {
  it('sends the contract payload with an empty honeypot and no empty subject', async () => {
    const capture: Capture[] = []
    const result = await submitContactMessage({ ...message, subject: '' }, 'token-1', {
      baseUrl: BASE_URL,
      fetchImpl: stubFetch(jsonResponse(202, { status: 'received', reference: 'req-42' }), capture),
    })

    expect(result).toEqual({ ok: true, reference: 'req-42' })
    expect(capture[0]?.url).toBe(`${BASE_URL}${CONTACT_API.submitPath}`)
    expect(capture[0]?.init?.method).toBe('POST')
    expect(JSON.parse(String(capture[0]?.init?.body))).toEqual({
      name: message.name,
      email: message.email,
      message: message.message,
      challenge: 'token-1',
      [CONTACT_API.honeypotField]: '',
    })
  })

  it('includes a subject when one was given', async () => {
    const capture: Capture[] = []
    await submitContactMessage({ ...message, subject: 'New project' }, 'token-1', {
      baseUrl: BASE_URL,
      fetchImpl: stubFetch(jsonResponse(202, { status: 'received', reference: 'req-43' }), capture),
    })

    expect(JSON.parse(String(capture[0]?.init?.body)).subject).toBe('New project')
  })

  it('forwards a filled honeypot so the server can discard the submission', async () => {
    const capture: Capture[] = []
    await submitContactMessage({ ...message, honeypot: 'https://spam.example' }, 'token-1', {
      baseUrl: BASE_URL,
      fetchImpl: stubFetch(jsonResponse(202, { status: 'received', reference: 'req-44' }), capture),
    })

    expect(JSON.parse(String(capture[0]?.init?.body))[CONTACT_API.honeypotField]).toBe(
      'https://spam.example',
    )
  })

  it('keeps the token for a submission the server judged too fast', async () => {
    const result = await submitContactMessage(message, 'token-1', {
      baseUrl: BASE_URL,
      fetchImpl: stubFetch(
        jsonResponse(400, {
          message: 'That was submitted a little too quickly. Please try again in a moment.',
          code: 'SUBMITTED_TOO_FAST',
          requestId: 'req-2',
        }),
      ),
    })

    expect(result).toEqual({
      ok: false,
      code: 'SUBMITTED_TOO_FAST',
      message: 'That was submitted a little too quickly. Please try again in a moment.',
      retryable: true,
      refreshChallenge: false,
    })
  })

  it('asks for a new token when the challenge was rejected', async () => {
    const result = await submitContactMessage(message, 'token-1', {
      baseUrl: BASE_URL,
      fetchImpl: stubFetch(
        jsonResponse(400, {
          message: 'Your form session has expired. Please reload the page and try again.',
          code: 'CHALLENGE_INVALID',
          requestId: 'req-3',
        }),
      ),
    })

    expect(result).toMatchObject({
      ok: false,
      code: 'CHALLENGE_INVALID',
      retryable: true,
      refreshChallenge: true,
    })
  })

  it('reports a rate limit as not sent and not retryable now', async () => {
    const result = await submitContactMessage(message, 'token-1', {
      baseUrl: BASE_URL,
      fetchImpl: stubFetch(
        jsonResponse(429, { message: '', code: 'RATE_LIMITED', requestId: 'req-4' }),
      ),
    })

    expect(result).toMatchObject({
      ok: false,
      code: 'RATE_LIMITED',
      message: CONTACT_MESSAGES.rateLimited,
      retryable: false,
      refreshChallenge: false,
    })
  })

  it('reports a delivery failure as undelivered and worth retrying', async () => {
    const result = await submitContactMessage(message, 'token-1', {
      baseUrl: BASE_URL,
      fetchImpl: stubFetch(
        jsonResponse(502, {
          message: 'The message could not be sent. Please try again later.',
          code: 'MAIL_UNAVAILABLE',
          requestId: 'req-5',
        }),
      ),
    })

    expect(result).toMatchObject({
      ok: false,
      code: 'MAIL_UNAVAILABLE',
      retryable: true,
      refreshChallenge: true,
    })
    expect(result.ok).toBe(false)
  })

  it('passes field errors through for a validation refusal', async () => {
    const result = await submitContactMessage(message, 'token-1', {
      baseUrl: BASE_URL,
      fetchImpl: stubFetch(
        jsonResponse(400, {
          message: 'Some of the details you entered are not valid.',
          code: 'VALIDATION_ERROR',
          requestId: 'req-6',
          fieldErrors: { email: 'Enter a valid email address.', name: 1 },
        }),
      ),
    })

    expect(result).toMatchObject({
      ok: false,
      code: 'VALIDATION_ERROR',
      fieldErrors: { email: 'Enter a valid email address.' },
      refreshChallenge: false,
    })
  })

  it('refuses an oversized body before contacting the API', async () => {
    const capture: Capture[] = []
    const result = await submitContactMessage(
      { ...message, message: 'x'.repeat(CONTACT_API.bodyLimitBytes + 1) },
      'token-1',
      {
        baseUrl: BASE_URL,
        fetchImpl: stubFetch(
          jsonResponse(202, { status: 'received', reference: 'never' }),
          capture,
        ),
      },
    )

    expect(result).toMatchObject({ ok: false, code: 'PAYLOAD_TOO_LARGE', retryable: false })
    expect(capture).toHaveLength(0)
  })

  it('reports a dropped connection without claiming delivery', async () => {
    const result = await submitContactMessage(message, 'token-1', {
      baseUrl: BASE_URL,
      fetchImpl: stubFetch(() => {
        throw new TypeError('Failed to fetch')
      }),
    })

    expect(result).toMatchObject({
      ok: false,
      code: 'NETWORK_ERROR',
      message: CONTACT_MESSAGES.networkError,
      retryable: true,
    })
  })

  it('treats a 200 body that is not a receipt as a failure', async () => {
    const result = await submitContactMessage(message, 'token-1', {
      baseUrl: BASE_URL,
      fetchImpl: stubFetch(jsonResponse(200, { status: 'queued' })),
    })

    expect(result).toMatchObject({ ok: false, code: 'INTERNAL_ERROR' })
  })

  it('falls back to a safe message when a proxy returns a non-JSON error page', async () => {
    const result = await submitContactMessage(message, 'token-1', {
      baseUrl: BASE_URL,
      fetchImpl: stubFetch(new Response('<html>502</html>', { status: 502 })),
    })

    expect(result).toMatchObject({
      ok: false,
      code: 'MAIL_UNAVAILABLE',
      message: CONTACT_MESSAGES.mailUnavailable,
    })
  })
})

describe('challenge freshness helpers', () => {
  const challenge = {
    token: 'token-1',
    expiresAt: '2026-01-01T00:30:00.000Z',
    minSubmitSeconds: 3,
  }
  const issuedAt = Date.parse('2026-01-01T00:00:00.000Z')

  it('treats a token as usable only before it expires', () => {
    expect(isContactChallengeUsable(challenge, issuedAt)).toBe(true)
    expect(isContactChallengeUsable(challenge, Date.parse('2026-01-01T00:30:01.000Z'))).toBe(false)
    expect(isContactChallengeUsable(null, issuedAt)).toBe(false)
    expect(isContactChallengeUsable({ ...challenge, expiresAt: 'not-a-date' }, issuedAt)).toBe(
      false,
    )
  })

  it('reports the remaining wait before the token is old enough', () => {
    expect(contactChallengeWaitSeconds(challenge, issuedAt, issuedAt)).toBe(3)
    expect(contactChallengeWaitSeconds(challenge, issuedAt, issuedAt + 1500)).toBe(2)
    expect(contactChallengeWaitSeconds(challenge, issuedAt, issuedAt + 3000)).toBe(0)
    expect(contactChallengeWaitSeconds(challenge, issuedAt, issuedAt + 60_000)).toBe(0)
  })
})
