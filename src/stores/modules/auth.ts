import type { MenuInfo, MenuTree } from '@/types/system/menu'
import { recursiveTree } from '@/utils'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: (): State => ({
    menuList: [],
    MenuTreeList: [],
    roles: [],
    permissions: [],
  }),
  getters: {
    getMenuList(state) {
      return state.menuList
    },
    getMenuTreeList(state) {
      return state.MenuTreeList
    },
    getRoles(state) {
      return state.roles
    },
    getPermissions(state) {
      return state.permissions
    },
  },
  actions: {
    setMenuList(menuList: MenuInfo[]) {
      this.menuList = menuList
      // 处理菜单树结构
      this.MenuTreeList = recursiveTree<MenuInfo, MenuTree>(menuList, 0)
    },
    setRoles(roles: string[]) {
      this.roles = roles
    },
    setPermissions(permissions: string[]) {
      this.permissions = permissions
    },
  },
})

interface State {
  menuList: MenuInfo[]
  MenuTreeList: MenuTree[]
  roles: string[]
  permissions: string[]
}
