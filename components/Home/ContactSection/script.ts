import { defineComponent } from 'vue'
import { APP_LINKS } from '~/constants/routes'
import { CONTACT_API, CONTACT_LIMITS } from '~/constants/contact'
import { useContactForm } from '~/composables/useContactForm'

interface HomeContactItem {
  id: string
  label: string
  value: string
  href: string
  isIcon?: boolean
  color?: string
  hoverColor?: string
}

export const homeContactItems: HomeContactItem[] = [
  {
    id: 'email',
    label: 'Email',
    value: 'elhadyrachida71@gmail.com',
    href: 'mailto:elhadyrachida71@gmail.com',
  },
  {
    id: 'phone',
    label: 'Call on Dial',
    value: '+961 81977603',
    href: 'tel:+96181977603',
    isIcon: true,
  },
  {
    id: 'whatsapp',
    label: 'Message on WhatsApp',
    value: '+961 81977603',
    href: 'https://wa.me/96181977603',
    isIcon: true,
    color: 'var(--social-whatsapp)',
  },
  {
    id: 'github',
    label: 'GitHub',
    value: 'github.com/kawaiiRE',
    href: 'https://github.com/kawaiiRE',
    isIcon: true,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    value: 'linkedin.com/in/rachida-el-hady',
    href: 'https://www.linkedin.com/in/rachida-el-hady-8a5251223/',
    isIcon: true,
    color: 'var(--social-linkedin)',
  },
]

export default defineComponent({
  name: 'ContactSection',
  props: {},
  emits: [],
  setup() {
    // -------------------- Composables --------------------
    const { fields, fieldErrors, isSubmitting, successMessage, errorMessage, prepare, submit } =
      useContactForm()

    // -------------------- State --------------------
    const contactItems = homeContactItems

    // -------------------- Methods --------------------
    // Covers the visitor whose token request failed while the page was still loading.
    const onFormFocus = () => {
      void prepare()
    }

    return {
      contactItems,
      fields,
      fieldErrors,
      isSubmitting,
      successMessage,
      errorMessage,
      honeypotField: CONTACT_API.honeypotField,
      limits: CONTACT_LIMITS,
      APP_LINKS,
      onFormFocus,
      sendMessage: submit,
    }
  },
})
