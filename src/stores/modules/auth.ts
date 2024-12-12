import type { MenuInfo, MenuTree } from '@/types/system/menu'
import { getBreadcrumbList, recursiveTree } from '@/utils'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: (): State => ({
    menuList: [],
    MenuTreeList: [],
    roleKeys: [],
    permissions: [],
  }),
  getters: {
    getMenuList(state) {
      return state.menuList
    },
    getMenuTreeList(state) {
      return state.MenuTreeList
    },
    getRoleKeys(state) {
      return state.roleKeys
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
    setRoleKeys(roleKeys: string[]) {
      this.roleKeys = roleKeys
    },
    setPermissions(permissions: string[]) {
      this.permissions = permissions
    },
    getBreadcrumb(path: string) {
      return getBreadcrumbList<Partial<MenuTree>>(this.MenuTreeList, path)
    },
  },
})

interface State {
  menuList: MenuInfo[]
  MenuTreeList: MenuTree[]
  roleKeys: string[]
  permissions: string[]
}
