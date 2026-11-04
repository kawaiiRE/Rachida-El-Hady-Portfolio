import {
  getHeader,
  getRequestIP,
  getRequestURL,
  getRequestWebStream,
  setHeader,
  setResponseStatus,
  type H3Event,
} from 'h3'
import { useRuntimeConfig } from '#imports'
import { CONTACT_API } from '../../constants/contact'
import { ContactGatewayError, forwardContact, readLimitedBody } from './gateway'

export const handleContactGateway = async (event: H3Event, method: 'GET' | 'POST') => {
  setHeader(event, 'Cache-Control', 'no-store')
  try {
    const config = useRuntimeConfig(event)
    const ownOrigin = getRequestURL(event).origin
    const siteOrigin = new URL(config.public.siteUrl).origin
    if (method === 'POST') {
      const origin = getHeader(event, 'origin')
      if (
        origin !== ownOrigin ||
        (!import.meta.dev && ![siteOrigin, 'https://www.rachida.dev'].includes(origin))
      ) {
        throw new ContactGatewayError(403, 'BAD_REQUEST', 'Submit the form from this website.')
      }
      if (!/^application\/json(?:\s*;|$)/i.test(getHeader(event, 'content-type') || '')) {
        throw new ContactGatewayError(415, 'BAD_REQUEST', 'The form must use JSON.')
      }
      const size = getHeader(event, 'content-length')
      if (size && (!/^\d+$/.test(size) || Number(size) > CONTACT_API.bodyLimitBytes)) {
        throw new ContactGatewayError(413, 'PAYLOAD_TOO_LARGE', 'The message is too large.')
      }
    }
    // Nitro supplies this original platform request and cf metadata, not user input.
    const platformRequest = event.context.cloudflare?.request as Request | undefined
    const clientIp =
      event.context.cf && platformRequest
        ? platformRequest.headers.get('cf-connecting-ip') || ''
        : import.meta.dev
          ? getRequestIP(event) || ''
          : ''
    const body =
      method === 'POST'
        ? await readLimitedBody(getRequestWebStream(event), CONTACT_API.bodyLimitBytes)
        : undefined
    if (body !== undefined) {
      let parsed: unknown
      try {
        parsed = JSON.parse(body)
      } catch {
        throw new ContactGatewayError(400, 'BAD_REQUEST', 'The form contains invalid JSON.')
      }
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed))
        throw new ContactGatewayError(400, 'BAD_REQUEST', 'The form contains invalid JSON.')
    }
    const response = await forwardContact({
      method,
      origin: config.contactApiOrigin,
      token: config.contactGatewayToken,
      clientIp,
      body,
      production: !import.meta.dev,
    })
    setResponseStatus(event, response.status)
    if (response.retryAfter) setHeader(event, 'Retry-After', Number(response.retryAfter))
    return response.body
  } catch (error) {
    const known = error instanceof ContactGatewayError
    setResponseStatus(event, known ? error.status : 503)
    return {
      code: known ? error.code : 'MAIL_UNAVAILABLE',
      message: known ? error.message : 'The contact service is unavailable.',
    }
  }
}
