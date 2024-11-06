import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
  type RouterHistory,
} from 'vue-router'
import { errorRouter, layoutRouter } from './modules/staticRouter'

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

export default router

interface RouterMode {
  [key: string]: () => RouterHistory
}
