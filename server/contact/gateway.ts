import { isIP } from 'node:net'
import { CONTACT_API } from '../../constants/contact'

export class ContactGatewayError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message)
  }
}

export const readLimitedBody = async (
  stream: ReadableStream<Uint8Array> | null | undefined,
  maximum: number,
): Promise<string> => {
  if (!stream) return ''
  const reader = stream.getReader()
  const chunks: Uint8Array[] = []
  let length = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      length += value.byteLength
      if (length > maximum) {
        await reader.cancel()
        throw new ContactGatewayError(413, 'PAYLOAD_TOO_LARGE', 'The message is too large.')
      }
      chunks.push(value)
    }
  } finally {
    reader.releaseLock()
  }
  const bytes = new Uint8Array(length)
  let offset = 0
  for (const chunk of chunks) {
    bytes.set(chunk, offset)
    offset += chunk.byteLength
  }
  return new TextDecoder().decode(bytes)
}

interface GatewayInput {
  method: 'GET' | 'POST'
  origin: string
  token: string
  clientIp: string
  body?: string
  production: boolean
}
export interface GatewayResponse {
  status: number
  body: Record<string, unknown>
  retryAfter?: string
}

export const forwardContact = async (
  input: GatewayInput,
  request: typeof fetch = fetch,
): Promise<GatewayResponse> => {
  const origin = new URL(input.origin)
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(origin.hostname)
  if (
    (origin.protocol !== 'https:' && !(local && !input.production)) ||
    origin.pathname !== '/' ||
    origin.search ||
    origin.hash ||
    origin.username ||
    origin.password ||
    !/^[A-Za-z0-9_-]{32,128}$/.test(input.token) ||
    !isIP(input.clientIp)
  ) {
    throw new ContactGatewayError(
      503,
      'CHALLENGE_UNAVAILABLE',
      'The contact service is unavailable.',
    )
  }
  if (input.body && new TextEncoder().encode(input.body).byteLength > CONTACT_API.bodyLimitBytes) {
    throw new ContactGatewayError(413, 'PAYLOAD_TOO_LARGE', 'The message is too large.')
  }
  let stage = 'fetch'
  let upstreamStatus: number | undefined
  try {
    const response = await request(
      new URL(input.method === 'GET' ? CONTACT_API.challengePath : CONTACT_API.submitPath, origin),
      {
        method: input.method,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'x-rachida-gateway-token': input.token,
          'x-rachida-client-ip': input.clientIp,
        },
        ...(input.method === 'POST' ? { body: input.body } : {}),
        // Workers supports manual/follow only. Reject redirects without forwarding secrets.
        redirect: 'manual',
        signal: AbortSignal.timeout(10_000),
      },
    )
    upstreamStatus = response.status
    if (response.status >= 300 && response.status < 400) throw new Error('Redirect refused')
    stage = 'read-json'
    if (!response.ok && ![400, 413, 429, 502, 503].includes(response.status)) {
      console.error('contact_gateway_upstream_failure', { status: response.status })
    }
    const value: unknown = JSON.parse(await readLimitedBody(response.body, 16 * 1024))
    stage = 'validate-response'
    if (!value || typeof value !== 'object' || Array.isArray(value))
      throw new Error('Invalid response')
    const data = value as Record<string, unknown>
    if (response.ok) {
      if (
        input.method === 'GET' &&
        response.status === 200 &&
        typeof data.token === 'string' &&
        data.token.length > 0 &&
        data.token.length <= 256 &&
        typeof data.expiresAt === 'string' &&
        Number.isFinite(Date.parse(data.expiresAt)) &&
        typeof data.minSubmitSeconds === 'number' &&
        Number.isInteger(data.minSubmitSeconds) &&
        data.minSubmitSeconds >= 0 &&
        data.minSubmitSeconds <= 600
      ) {
        return {
          status: 200,
          body: {
            token: data.token,
            expiresAt: data.expiresAt,
            minSubmitSeconds: data.minSubmitSeconds,
          },
        }
      }
      if (
        input.method === 'POST' &&
        response.status === 202 &&
        data.status === 'received' &&
        typeof data.reference === 'string' &&
        data.reference.length <= 128
      ) {
        return { status: 202, body: { status: 'received', reference: data.reference } }
      }
      throw new Error('Invalid response')
    }
    const messages: Record<string, string> = {
      VALIDATION_ERROR: 'Please check the form details.',
      CHALLENGE_INVALID: 'Refresh the form and try again.',
      SUBMITTED_TOO_FAST: 'Please wait a moment and try again.',
      PAYLOAD_TOO_LARGE: 'The message is too large.',
      RATE_LIMITED: 'Too many requests. Please try again later.',
      MAIL_UNAVAILABLE: 'Delivery could not be confirmed. Please try again later.',
    }
    const code = typeof data.code === 'string' ? data.code : ''
    if (!messages[code] || ![400, 413, 429, 502, 503].includes(response.status))
      throw new Error('Invalid response')
    const retryAfter = response.headers.get('retry-after')
    return {
      status: response.status,
      body: { code, message: messages[code] },
      ...(retryAfter && /^\d{1,5}$/.test(retryAfter) ? { retryAfter } : {}),
    }
  } catch (error) {
    // Never log request headers, body, URL or error messages containing upstream data.
    console.error('contact_gateway_request_failed', {
      kind: error instanceof Error ? error.name : 'UnknownError',
      stage,
      status: upstreamStatus,
    })
    throw new ContactGatewayError(
      502,
      'MAIL_UNAVAILABLE',
      'The contact service is unavailable. Your message was not confirmed sent.',
    )
  }
}
