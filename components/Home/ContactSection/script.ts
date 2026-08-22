import { defineComponent, ref, onMounted } from 'vue'
import { APP_LINKS } from '~/constants/routes'

type EmailJsClient = typeof import('@emailjs/browser').default

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

interface FormData {
  name: string
  email: string
  message: string
}

export default defineComponent({
  name: 'ContactSection',
  props: {},
  emits: [],
  setup() {
    // -------------------- State --------------------
    const config = useRuntimeConfig()
    const contactItems = homeContactItems
    const formData = ref<FormData>({
      name: '',
      email: '',
      message: '',
    })

    const isLoading = ref(false)
    const successMessage = ref('')
    const errorMessage = ref('')
    let emailClient: EmailJsClient | null = null

    // -------------------- Computed --------------------

    // -------------------- Methods --------------------
    const getEmailJSConfig = () => ({
      publicKey: config.public.emailjsPublicKey as string,
      serviceId: config.public.emailjsServiceId as string,
      templateId: config.public.emailjsTemplateId as string,
    })

    // Initialize EmailJS
    const initializeEmailJS = async (): Promise<EmailJsClient | null> => {
      const { publicKey } = getEmailJSConfig()

      if (!publicKey) {
        console.error(
          'EmailJS public key is missing. Check NUXT_PUBLIC_EMAILJS_PUBLIC_KEY in the deployment environment.',
        )
        return null
      }

      if (!emailClient) {
        const emailModule = await import('@emailjs/browser')
        emailClient = emailModule.default
        emailClient.init({ publicKey })
      }

      return emailClient
    }

    // Send form
    const sendMessage = async () => {
      if (!formData.value.name || !formData.value.email || !formData.value.message) {
        errorMessage.value = 'Please fill in all fields'
        return
      }

      isLoading.value = true
      errorMessage.value = ''
      successMessage.value = ''

      try {
        const { publicKey, serviceId, templateId } = getEmailJSConfig()

        if (!publicKey || !serviceId || !templateId) {
          throw new Error('EmailJS configuration is missing')
        }

        const client = await initializeEmailJS()

        if (!client) {
          throw new Error('EmailJS client could not be initialized')
        }

        await client.send(
          serviceId,
          templateId,
          {
            from_name: formData.value.name,
            to_name: 'Rachida',
            email: formData.value.email,
            from_email: formData.value.email,
            to_email: 'elhadyrachida71@gmail.com',
            message: formData.value.message,
          },
          { publicKey },
        )

        successMessage.value = 'Message sent successfully!'
        formData.value = { name: '', email: '', message: '' }

        // Clear success message after 5 seconds
        setTimeout(() => {
          successMessage.value = ''
        }, 5000)
      } catch (error) {
        console.error('EmailJS error:', error)
        // -------------------- Lifecycle --------------------
        errorMessage.value = 'Failed to send the message. Please try again.'
      } finally {
        isLoading.value = false
      }
    }

    onMounted(() => {
      void initializeEmailJS()
    })

    return {
      contactItems,
      formData,
      isLoading,
      successMessage,
      errorMessage,
      APP_LINKS,
      sendMessage,
    }
  },
})
