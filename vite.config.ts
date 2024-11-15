import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import UnoCSS from 'unocss/vite'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      UnoCSS(),
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
