import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(createPersistedState())

export * from './modules/user'
export * from './modules/auth'

export default pinia
