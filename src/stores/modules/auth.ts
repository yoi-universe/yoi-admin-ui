import type { MenuInfo } from '@/types/system/menu'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: (): State => ({
    menuList: [],
    roles: [],
    permissions: [],
  }),
  getters: {
    getMenuList(state) {
      return state.menuList
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
  roles: string[]
  permissions: string[]
}
