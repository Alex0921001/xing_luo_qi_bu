import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import vueSetupExtend from 'unplugin-vue-setup-extend-plus/vite'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@render': resolve('src/renderer/src')
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
