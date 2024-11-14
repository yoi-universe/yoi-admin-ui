import type { RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'
import { HOME_URL } from '@/config'

export const layoutRouter: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'layout',
    component: Layout,
    redirect: HOME_URL,
    children: [],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
    },
  },
]

export const errorRouter: RouteRecordRaw[] = [
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/error/403.vue'),
    meta: {
      title: '403页面',
    },
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error/404.vue'),
    meta: {
      title: '404页面',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/error/404.vue'),
    meta: {
      title: '404页面',
    },
  },
]
