import type { RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'
// import { HOME_URL } from '@/config'

export const layoutRouter: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'layout',
    component: Layout,
    // redirect: HOME_URL,
    children: [
      {
        path: '/dict_data/:dictType',
        name: 'dictDataPage',
        component: () => import('@/views/system/dict/data.vue'),
        meta: {
          parentId: 2,
          title: '字典数据',
          icon: 'Flag',
          visible: 1,
          isCache: 0,
          isLink: 0,
          linkType: 0,
          linkUrl: '',
          activeMenu: '/dict_type', // 默认选中哪个路由
        },
      },
      {
        path: '/personage',
        name: 'personagePage',
        component: () => import('@/views/personage/index.vue'),
        meta: {
          parentId: 0,
          title: '个人中心',
          icon: 'User',
          visible: 1,
          isCache: 1,
          isLink: 0,
          linkType: 0,
          linkUrl: '',
        },
      },
    ],
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
