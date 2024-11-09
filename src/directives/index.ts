import type { App, Directive } from 'vue'
import throttle from './modules/throttle'

const directives: Record<string, Directive> = {
  throttle,
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
