import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', {
  state: (): State => ({
    isCollapse: false,
  }),
  actions: {
    setCollapse(isCollapse: boolean) {
      this.isCollapse = isCollapse
    },
  },
})

interface State {
  isCollapse: boolean
}
