/**
 * Mirrors the published `api.rachida.dev` contract (`api-contract.json`, revision
 * `2026-10-24.1`). The server is the authority; these values exist so the form can refuse
 * obviously invalid input before spending a single-use challenge token on it.
 */
export const CONTACT_API = {
  /** Overridden with `NUXT_PUBLIC_CONTACT_API_BASE_URL` when pointing at another instance. */
  defaultBaseUrl: 'https://api.rachida.dev',
  challengePath: '/api/v1/contact/challenge',
  submitPath: '/api/v1/contact',
  /** Hidden field a person never fills in. Any value means a script filled it in. */
  honeypotField: 'website',
  /** The server caps the body at 8 KiB; staying under it keeps the refusal client-side. */
  bodyLimitBytes: 8 * 1024,
} as const

export const CONTACT_LIMITS = {
  nameMin: 2,
  nameMax: 80,
  emailMax: 254,
  subjectMin: 3,
  subjectMax: 120,
  messageMin: 10,
  messageMax: 4000,
} as const

/**
 * Every refusal the contact route can answer with, per the contract's `errorCodes`, plus
 * the two network-level outcomes the browser has to describe on its own.
 */
export const CONTACT_ERROR_CODES = [
  'VALIDATION_ERROR',
  'CHALLENGE_INVALID',
  'SUBMITTED_TOO_FAST',
  'PAYLOAD_TOO_LARGE',
  'RATE_LIMITED',
  'MAIL_UNAVAILABLE',
  'BAD_REQUEST',
  'INTERNAL_ERROR',
  'NETWORK_ERROR',
  'CHALLENGE_UNAVAILABLE',
] as const

export type ContactErrorCode = (typeof CONTACT_ERROR_CODES)[number]

/**
 * What the visitor reads for each outcome. The API already returns a visitor-safe message
 * for most refusals and it is preferred when present; these are the fallbacks and the two
 * cases the API never gets to answer. Nothing here claims the message was delivered unless
 * the API accepted it, because a failed send is not stored and has to be retried.
 */
export const CONTACT_MESSAGES = {
  success:
    'Thank you — your message is on its way to Rachida. She will reply to the address you gave.',
  incomplete: 'Please fill in your name, email, and message.',
  tooLong: 'That message is longer than the form accepts. Please shorten it and try again.',
  challengeUnavailable:
    'The form could not be prepared, so nothing was sent. Check your connection and reload the page.',
  networkError:
    'Your message could not be sent because the connection failed. Nothing was delivered — please try again.',
  rateLimited:
    'You have reached the limit of 5 messages an hour from this connection. Nothing was sent this time; please try again later or email Rachida directly.',
  mailUnavailable:
    'The mail service did not accept the message, so it was not delivered and it is not saved. Please try again in a few minutes, or email Rachida directly.',
  tooFast: 'That was submitted a little too quickly. Please take a moment and send it again.',
  challengeInvalid:
    'Your form session expired before the message was sent. The form has been refreshed — please send it again.',
  validation: 'Some of the details are not valid. Please check the fields and try again.',
  unexpected:
    'Something went wrong and the message was not sent. Please try again, or email Rachida directly.',
} as const
