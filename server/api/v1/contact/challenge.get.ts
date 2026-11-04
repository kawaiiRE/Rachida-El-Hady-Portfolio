import { handleContactGateway } from '../../../contact/handler'
export default defineEventHandler((event) => handleContactGateway(event, 'GET'))
