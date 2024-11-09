import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import pinia from '@/stores'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

/**
 * css样式
 */
import '@/styles/reset.scss'
import 'element-plus/theme-chalk/el-message.css'
import 'virtual:uno.css'

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
app.use(YoiDirectives)

app.mount('#app')
