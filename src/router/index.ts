import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
  type NavigationGuardNext,
  type RouteLocationNormalized,
  type RouteLocationNormalizedLoaded,
  type RouterHistory,
} from 'vue-router'
import { errorRouter, layoutRouter } from './modules/staticRouter'
import { useAuthStore, useUserStore } from '@/stores'
import nProgress from 'nprogress'
import getPageTitle from '@/utils/getPageTitle'
import { LOGIN_URL, WHITE_URL_LIST } from '@/config'
import { elMsgWarning } from '@/utils/elMsg'
import { initDynamicRouter } from './modules/dynamicRouter'

nProgress.configure({
  showSpinner: false, // 关闭加载图标
})

// .env 配置文件读取
const mode = import.meta.env.VITE_ROUTER_MODE

// 路由模式
const routerMode: RouterMode = {
  hash: () => createWebHashHistory(),
  history: () => createWebHistory(),
}

const router = createRouter({
  history: routerMode[mode](),
  routes: [...layoutRouter, ...errorRouter],
  scrollBehavior() {
    return { left: 0, top: 0 }
  },
})

/**
 * 前置路由
 */
router.beforeEach(
  async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalizedLoaded,
    next: NavigationGuardNext,
  ) => {
    const userStore = useUserStore()
    const authStore = useAuthStore()

    // 进度条开始
    nProgress.start()

    // 页面标题
    document.title = getPageTitle(to.meta)

    // 判断访问的是否是登录页
    if (to.path === LOGIN_URL) {
      // 判断是否有token
      if (userStore.getToken) {
        return next(from.fullPath)
      } else {
        elMsgWarning('您未登录，或者登录已经超时，请先登录！')
      }
      // 重置路由
      authStore.getMenuList.forEach(route => {
        const { routeName } = route
        if (routeName && router.hasRoute(routeName)) {
          router.removeRoute(routeName)
        }
      })
      return next()
    }

    // 判断访问的是否是白名单地址
    if (WHITE_URL_LIST.includes(to.path)) return next()

    // 判断是否有token
    if (!userStore.getToken) return next({ path: LOGIN_URL, replace: true })

    // 判断是否有菜单，没有就初始化
    if (!authStore.getMenuList.length) {
      await initDynamicRouter()
      return next({ ...to, replace: true })
    }

    next()
  },
)

/**
 * 跳转错误
 */
router.onError(error => {
  // 结束进度条
  nProgress.done()
  console.warn('路由错误', error)
})

/**
 * 后置路由
 */
router.afterEach(
  (to: RouteLocationNormalized, from: RouteLocationNormalizedLoaded) => {
    // 结束进度条
    nProgress.done()
  },
)

export default router

interface RouterMode {
  [key: string]: () => RouterHistory
}
