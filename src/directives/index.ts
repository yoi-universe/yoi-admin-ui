import type { App, Directive } from 'vue'
import throttle from './modules/throttle'
import debounce from './modules/debounce'
import auth from './modules/auth'

const directives: Record<string, Directive> = {
  throttle,
  debounce,
  auth,
}

const install = (app: App) => {
  Object.keys(directives).forEach((key: string) => {
    const directive = directives[key]
    app.directive(key, directive)
  })
}

export default {
  install,
}
