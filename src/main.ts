import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import pinia from '@/stores'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import i18n from '@/languages'

/**
 * css样式
 */
import '@/styles/index.scss' // 全局样式
import 'nprogress/nprogress.css' // 进度条
import 'element-plus/theme-chalk/el-message.css' // 消息提示样式
import 'element-plus/theme-chalk/dark/css-vars.css' // element plus dark 样式
import 'virtual:uno.css' // UnoCss

/**
 * 自定义全局指令
 */
import YoiDirectives from '@/directives/index'

const app = createApp(App)

// 注册element plus 所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(pinia)
app.use(router)
app.use(i18n)
app.use(YoiDirectives)

app.mount('#app')
