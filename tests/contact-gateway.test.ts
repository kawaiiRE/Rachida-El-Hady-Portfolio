import { describe, expect, it } from 'vitest'
import { forwardContact, readLimitedBody } from '../server/contact/gateway'
const input = {
  method: 'GET' as const,
  origin: 'https://api.rachida.dev',
  token: 'test-server-only-gateway-token-at-least-32',
  clientIp: '192.0.2.1',
  production: true,
}
const challenge = {
  token: 'synthetic-token',
  expiresAt: '2030-01-01T00:00:00Z',
  minSubmitSeconds: 3,
}
describe('same-origin contact gateway', () => {
  it('constructs authenticated headers and allowlists response fields', async () => {
    let captured: RequestInit | undefined
    const result = await forwardContact(input, (async (url, init) => {
      expect(String(url)).toBe('https://api.rachida.dev/api/v1/contact/challenge')
      captured = init
      return Response.json({ ...challenge, private: 'must-not-leak' })
    }) as typeof fetch)
    expect(result.body).toEqual(challenge)
    expect(captured?.headers).toMatchObject({
      'x-rachida-client-ip': '192.0.2.1',
      'x-rachida-gateway-token': input.token,
    })
    expect(captured?.redirect).toBe('error')
    expect(JSON.stringify(result)).not.toContain(input.token)
  })
  it('refuses missing credentials, invalid addresses and insecure production origins', async () => {
    for (const patch of [
      { token: '' },
      { clientIp: 'forged' },
      { origin: 'http://api.rachida.dev' },
    ])
      await expect(forwardContact({ ...input, ...patch })).rejects.toMatchObject({ status: 503 })
  })
  it('does not expose upstream errors or retry submissions', async () => {
    let calls = 0
    await expect(
      forwardContact({ ...input, method: 'POST', body: '{}' }, (async () => {
        calls++
        return new Response('private detail', { status: 500 })
      }) as typeof fetch),
    ).rejects.toMatchObject({ status: 502, code: 'MAIL_UNAVAILABLE' })
    expect(calls).toBe(1)
  })
  it('preserves rate limits with safe messages', async () => {
    const result = await forwardContact(input, (async () =>
      Response.json(
        { code: 'RATE_LIMITED', message: 'untrusted detail' },
        { status: 429, headers: { 'retry-after': '60' } },
      )) as typeof fetch)
    expect(result).toEqual({
      status: 429,
      body: { code: 'RATE_LIMITED', message: 'Too many requests. Please try again later.' },
      retryAfter: '60',
    })
  })
  it('cancels an oversized stream', async () => {
    let cancelled = false
    const stream = new ReadableStream<Uint8Array>({
      pull(controller) {
        controller.enqueue(new Uint8Array(8193))
      },
      cancel() {
        cancelled = true
      },
    })
    await expect(readLimitedBody(stream, 8192)).rejects.toMatchObject({ status: 413 })
    expect(cancelled).toBe(true)
  })
})
