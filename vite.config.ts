import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

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
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
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
