import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import pinia from '@/stores'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

/**
 * css样式
 */
import '@/styles/reset.scss'
import 'virtual:uno.css'

const app = createApp(App)

// 注册element plus 所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(pinia)
app.use(router)

app.mount('#app')
