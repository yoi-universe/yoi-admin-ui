import { getUserInfoApi, getUserMenuApi } from '@/api/auth'
import { useAuthStore, useUserStore } from '@/stores'
import router from '..'
import { LOGIN_URL } from '@/config'

export const initDynamicRouter = async () => {
  const modules = import.meta.glob('@/views/**/*.vue')

  const authStore = useAuthStore()
  const userStore = useUserStore()
  try {
    // 获取路由
    const res = await Promise.all([getUserMenuApi(), getUserInfoApi()])
    const menuList = res[0].data
    const userInfo = res[1].data

    authStore.setMenuList(menuList)
    authStore.setRoleKeys(userInfo.roleKeys)
    authStore.setPermissions(userInfo.permissions)
    userStore.setUserInfo(userInfo.loginUser)

    // 判断是否有菜单权限
    if (!authStore.getMenuList.length) {
      userStore.setToken('')
      router.replace(LOGIN_URL)
      // router.replace('/403')
      return Promise.reject('菜单权限为空')
    }

    // 添加动态路由
    authStore.getMenuList.forEach(item => {
      // 默认值为 404 页面
      let componentUrl = '/src/views/error/404.vue'
      if (item.component) {
        const componentString = item.component.replace(/^\/+/, '') // 过滤字符串前面所有 '/' 字符
        const componentPath = componentString.replace(/\.\w+$/, '') // 过滤掉后缀名，为了让 import 加入 .vue ，不然会有警告提示...
        const url = '/src/' + componentPath + '.vue'
        modules[url] ? (componentUrl = url) : componentUrl
      }
      const route = {
        path: item.path,
        name: item.routeName,
        component: modules[componentUrl],
        meta: {
          dynamic: true,
          parentId: item.parentId,
          title: item.menuName,
          icon: item.icon,
          menuType: item.menuType,
          visible: item.visible,
          isCache: item.isCache,
          isLink: item.isLink,
          linkType: item.linkType,
          linkUrl: item.linkUrl,
          activeMenu: item.activeMenu,
        },
      }
      router.addRoute('layout', route)
    })
  } catch (error) {
    console.log(error)
    // 获取用户登录信息请求出错时
    userStore.setToken('')
    router.replace(LOGIN_URL)
    return Promise.reject(error)
  }
}
