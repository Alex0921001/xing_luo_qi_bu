import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import vueSetupExtend from 'unplugin-vue-setup-extend-plus/vite'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@main': resolve('src/main')
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000/api',
          changeOrigin: true, // 是否改变请求域名
          rewrite: (path) => path.replace(/^\/api/, '') //将原有请求路径中的api替换为''
        }
      }
    },
    css: {
      preprocessorOptions: {
        less: {
          math: 'always', // 括号内才使用数学计算
          globalVars: {
            // 全局变量
            mainColor: 'red'
          }
        }
      }
    },
    plugins: [
      vue(),
      AutoImport({
        // 在哪些文件里可以直接引入
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/,
          /\.md$/ // .md
        ],
        imports: ['vue', 'vue-router', 'pinia', '@vueuse/core'],
        dirs: ['./src/renderer/src/components', './src/renderer/src/utils'],
        dts: './src/renderer/src/auto-imports.d.ts',
        eslintrc: {
          enabled: true,
          filepath: './.eslintrc-auto-import.json',
          globalsPropValue: true
        }
      }),
      // name 可以写在 script 标签上
      vueSetupExtend({})
    ]
  }
})
