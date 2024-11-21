import { PINIA_PREFIX_KEY } from '@/config'
import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', {
  state: (): State => ({
    // 侧边栏是否折叠
    isCollapse: false,
    // 是否是暗黑模式
    isDark: false,
    // 语言
    language: 'zh_CN',
  }),
  actions: {
    setCollapse(isCollapse: boolean) {
      this.isCollapse = isCollapse
    },
    setDark(isDark: boolean) {
      this.isDark = isDark
    },
    setLanguage(language: string) {
      this.language = language
    },
  },
  persist: {
    key: PINIA_PREFIX_KEY + 'global',
    storage: localStorage,
  },
})

interface State {
  isCollapse: boolean
  isDark: boolean
  language: string
}
