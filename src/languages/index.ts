import { createI18n } from 'vue-i18n'
import { getBrowserLang, importMessages } from './tools'

const i18n = createI18n({
  // Use Composition API, Set to false
  allowComposition: true,
  legacy: false,
  locale: getBrowserLang(),
  messages: importMessages(),
})

export const { t } = i18n.global
export default i18n
