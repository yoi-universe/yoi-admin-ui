import { MENU_CACHE_YES } from '@/constants/system'
import type { TabInfo } from '@/types/tabs'
import { defineStore } from 'pinia'
import router, { getFirstDynamicRoutes } from '@/router/index'
import {
  // HOME_URL,
  PINIA_PREFIX_KEY,
} from '@/config'

export const useTabsStore = defineStore('tabs', {
  state: (): State => ({
    tabList: [],
    keepAliveList: [],
  }),
  getters: {
    getTabsList(state) {
      return state.tabList
    },
  },
  actions: {
    /**
     * 添加tabs
     * @param tab tab对象
     */
    addTabs(tab: TabInfo) {
      // 查找是否已经存在
      const isTab = this.tabList.some(item => item.path === tab.path)
      !isTab && this.tabList.push(tab)
      tab.isCache === MENU_CACHE_YES && this.addKeepAliveList(tab.name)
    },
    /**
     * 删除tabs
     * @param path 路径
     * @param isCurrent 是否是当前页
     */
    delTabs(path: string, isCurrent: boolean) {
      const tabItem = this.tabList.find(item => item.path === path)
      tabItem?.isCache === MENU_CACHE_YES &&
        this.removeKeepAliveList(tabItem.name)
      const oldTabsList = this.tabList
      this.tabList = this.tabList.filter(item => item.path !== path)
      // 判断删除的是否是当前页，为当前页面，就选上一个或者下一个
      isCurrent &&
        oldTabsList.forEach((item, index) => {
          if (item.path !== path) return
          const nextTab = oldTabsList[index + 1] || oldTabsList[index - 1]
          if (!nextTab) return
          router.push(nextTab.path)
        })
    },
    /**
     * 删除多个tabs
     * @param reservePath 保留的path
     */
    delManyTabs(reservePath?: string) {
      // this.tabList = this.tabList.filter(
      //   item =>
      //     item.path === reservePath || (!reservePath && item.path === HOME_URL),
      // )
      const firstRoutes = getFirstDynamicRoutes()
      this.tabList = this.tabList.filter(
        item =>
          item.path === reservePath ||
          (!reservePath && item.path === firstRoutes?.path),
      )
      const keepAliveList = this.tabList.filter(
        item => item.isCache === MENU_CACHE_YES,
      )
      this.keepAliveList = keepAliveList.map(item => item.name)
    },
    addKeepAliveList(name: string) {
      !this.keepAliveList.includes(name) && this.keepAliveList.push(name)
    },
    removeKeepAliveList(name: string) {
      this.keepAliveList = this.keepAliveList.filter(item => item !== name)
    },
  },
  persist: {
    key: PINIA_PREFIX_KEY + 'tabs',
    storage: localStorage,
    pick: ['tabList'],
  },
})

interface State {
  tabList: TabInfo[]
  keepAliveList: string[]
}
