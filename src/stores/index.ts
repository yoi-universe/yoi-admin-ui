import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(createPersistedState())

export * from './modules/global'
export * from './modules/user'
export * from './modules/auth'
export * from './modules/tabs'
export * from './modules/dict'

export default pinia
