import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
// keepAlive 组件 name
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
import UnoCSS from 'unocss/vite'
// 引入svg需要的插件
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    plugins: [
      vue(),
      vueSetupExtend(),
      UnoCSS(),
      createSvgIconsPlugin({
        // 配置SVG图片
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]',
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler', // or 'modern'
          additionalData: `
          @use "@/styles/variable.scss" as *;
          `, // sass v1.8 不再支持全局内置函数 @import ，请使用 @use 替代。
        },
      },
    },
    server: {
      host: '0.0.0.0', // 允许本机IP访问 0.0.0.0
      port: 5173, // 端口号
      hmr: true, // 热更新
      open: false, // 自动打开
      proxy: {
        // 代理跨域
        [env.VITE_API_PREFIX]: {
          // 配置哪个环境下的
          target: env.VITE_BASE_URL,
          rewrite: path =>
            path.replace(new RegExp('^' + env.VITE_API_PREFIX), ''), // 路径重写
          // 允许跨域
          changeOrigin: true,
        },
      },
    },
  }
})
