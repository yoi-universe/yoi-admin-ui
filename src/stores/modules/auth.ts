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

// const staticMenu: MenuInfo[] = [
//   {
//     menuId: 1,
//     parentId: 0,
//     menuName: '首页',
//     path: '/home',
//     routeName: 'homePage',
//     component: 'views/home/index',
//     activeMenu: '',
//     query: '',
//     isLink: 0,
//     linkType: 0,
//     linkUrl: '',
//     isCache: 0,
//     menuType: 1,
//     perms: 'system:home',
//     icon: 'HomeFilled',
//     visible: 0,
//     status: 0,
//     sortNum: 1,
//   },
// ]

interface State {
  menuList: MenuInfo[]
  MenuTreeList: MenuTree[]
  roleKeys: string[]
  permissions: string[]
}
