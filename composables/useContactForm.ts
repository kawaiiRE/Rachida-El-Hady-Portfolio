import { onMounted, ref } from 'vue'
import { useRuntimeConfig } from '#imports'
import { CONTACT_LIMITS, CONTACT_MESSAGES } from '~/constants/contact'
import {
  contactChallengeWaitSeconds,
  isContactChallengeUsable,
  requestContactChallenge,
  submitContactMessage,
  type ContactChallenge,
} from '~/lib/contact-api'

export interface ContactFormFields {
  name: string
  email: string
  subject: string
  message: string
  /** The honeypot. Bound so a script that fills it in is detected server-side. */
  website: string
}

const emptyFields = (): ContactFormFields => ({
  name: '',
  email: '',
  subject: '',
  message: '',
  website: '',
})

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

/**
 * Drives the contact form against `api.rachida.dev`.
 *
 * The endpoint is a two-step flow: a signed, single-use token is fetched when the form is
 * shown and sent back with the message, which is what makes the server's minimum
 * time-to-submit check trustworthy. A token is spent by an accepted submission and by a
 * delivery failure, so a fresh one is fetched whenever the previous one can no longer be
 * used. Nothing is stored server-side, so a refusal is always reported as "not sent".
 */
export const useContactForm = () => {
  const runtimeConfig = useRuntimeConfig()
  const baseUrl = String(runtimeConfig.public.contactApiBaseUrl || '').replace(/\/+$/, '')

  const fields = ref<ContactFormFields>(emptyFields())
  const fieldErrors = ref<Record<string, string>>({})
  const isSubmitting = ref(false)
  const successMessage = ref('')
  const errorMessage = ref('')

  const challenge = ref<ContactChallenge | null>(null)
  const challengeIssuedAt = ref(0)
  const isPreparing = ref(false)

  const clearMessages = () => {
    successMessage.value = ''
    errorMessage.value = ''
    fieldErrors.value = {}
  }

  const loadChallenge = async (): Promise<boolean> => {
    if (!baseUrl) return false

    isPreparing.value = true
    try {
      const result = await requestContactChallenge({ baseUrl })
      if (!result.ok) {
        challenge.value = null
        challengeIssuedAt.value = 0
        return false
      }

      challenge.value = result.challenge
      challengeIssuedAt.value = Date.now()
      return true
    } finally {
      isPreparing.value = false
    }
  }

  /** Called when the form is first shown and before each submission that needs a token. */
  const prepare = async (): Promise<boolean> => {
    if (isContactChallengeUsable(challenge.value)) return true
    return loadChallenge()
  }

  const validate = (): boolean => {
    const name = fields.value.name.trim()
    const email = fields.value.email.trim()
    const subject = fields.value.subject.trim()
    const message = fields.value.message.trim()
    const errors: Record<string, string> = {}

    if (!name || !email || !message) {
      errorMessage.value = CONTACT_MESSAGES.incomplete
      return false
    }

    if (name.length < CONTACT_LIMITS.nameMin) errors.name = 'Tell me your name.'
    if (name.length > CONTACT_LIMITS.nameMax) errors.name = 'That name is too long.'
    if (email.length > CONTACT_LIMITS.emailMax) errors.email = 'That email address is too long.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email address.'
    if (subject && subject.length < CONTACT_LIMITS.subjectMin) {
      errors.subject = 'That subject is too short.'
    }
    if (subject.length > CONTACT_LIMITS.subjectMax) errors.subject = 'That subject is too long.'
    if (message.length < CONTACT_LIMITS.messageMin) errors.message = 'Please write a little more.'
    if (message.length > CONTACT_LIMITS.messageMax) errors.message = 'That message is too long.'

    if (Object.keys(errors).length > 0) {
      fieldErrors.value = errors
      errorMessage.value = CONTACT_MESSAGES.validation
      return false
    }

    return true
  }

  /**
   * The token carries its issue time and is refused until it is old enough. Waiting out the
   * remainder is better than answering a visitor who typed quickly with a refusal.
   */
  const waitForChallengeWindow = async () => {
    const current = challenge.value
    if (!current) return

    const waitSeconds = Math.min(
      contactChallengeWaitSeconds(current, challengeIssuedAt.value),
      current.minSubmitSeconds + 1,
    )
    if (waitSeconds > 0) await sleep(waitSeconds * 1000)
  }

  const submit = async (): Promise<void> => {
    if (isSubmitting.value) return

    clearMessages()
    if (!validate()) return

    isSubmitting.value = true
    try {
      if (!(await prepare())) {
        errorMessage.value = CONTACT_MESSAGES.challengeUnavailable
        return
      }

      const token = challenge.value?.token
      if (!token) {
        errorMessage.value = CONTACT_MESSAGES.challengeUnavailable
        return
      }

      await waitForChallengeWindow()

      const subject = fields.value.subject.trim()
      const result = await submitContactMessage(
        {
          name: fields.value.name.trim(),
          email: fields.value.email.trim(),
          ...(subject ? { subject } : {}),
          message: fields.value.message.trim(),
          honeypot: fields.value.website,
        },
        token,
        { baseUrl },
      )

      if (result.ok) {
        // The token is single-use, so the next message needs a new one.
        challenge.value = null
        challengeIssuedAt.value = 0
        fields.value = emptyFields()
        successMessage.value = CONTACT_MESSAGES.success
        void loadChallenge()
        return
      }

      errorMessage.value = result.message
      if (result.fieldErrors) fieldErrors.value = result.fieldErrors
      if (result.refreshChallenge) {
        challenge.value = null
        challengeIssuedAt.value = 0
        void loadChallenge()
      }
    } finally {
      isSubmitting.value = false
    }
  }

  onMounted(() => {
    void prepare()
  })

  return {
    fields,
    fieldErrors,
    isSubmitting,
    isPreparing,
    successMessage,
    errorMessage,
    prepare,
    submit,
  }
}
