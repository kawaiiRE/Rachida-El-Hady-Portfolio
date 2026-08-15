import { defineComponent } from 'vue'
import { TRACKPAL_MOBILE_PROJECT, TRACKPAL_WEB_PROJECT } from '~/constants/projects'

export default defineComponent({
  name: 'FeaturedCaseStudy',
  setup() {
    return { project: TRACKPAL_WEB_PROJECT, mobileProject: TRACKPAL_MOBILE_PROJECT }
  },
})
