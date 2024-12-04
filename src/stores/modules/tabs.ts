import { MENU_CACHE_YES } from '@/constants/system'
import type { TabInfo } from '@/types/tabs'
import { defineStore } from 'pinia'
import router from '@/router/index'
import { HOME_URL } from '@/config'

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
      if (isTab) return
      this.tabList.push(tab)
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
      this.tabList = this.tabList.filter(
        item =>
          item.path === reservePath || (!reservePath && item.path === HOME_URL),
      )
      const keepAliveList = this.tabList.filter(
        item => item.isCache === MENU_CACHE_YES,
      )
      this.keepAliveList = keepAliveList.map(item => `${item.name}Page`)
    },
    addKeepAliveList(name: string) {
      const componentName = `${name}Page` // 添加页面标识,防止名称与html默认名称冲突导致命名错误问题
      !this.keepAliveList.includes(componentName) &&
        this.keepAliveList.push(componentName)
    },
    removeKeepAliveList(name: string) {
      const componentName = `${name}Page`
      this.keepAliveList = this.keepAliveList.filter(
        item => item !== componentName,
      )
    },
  },
})

interface State {
  tabList: TabInfo[]
  keepAliveList: string[]
}
