<template>
  <div id="app">
    <ImageEditor :include-ui="useDefaultUI" :options="options"></ImageEditor>
  </div>
</template>

<script>
// 引入样式
import 'tui-image-editor/dist/tui-image-editor.css'
import 'tui-color-picker/dist/tui-color-picker.css'
// 引入组件
import ImageEditor from '@toast-ui/vue-image-editor/src/ImageEditor.vue'
import Logo from '@renderer/assets/images/bg.png'
import { locale_zh } from '@renderer/enums/draw'

export default {
  name: 'App',
  components: {
    ImageEditor
  },
  data() {
    return {
      useDefaultUI: true,
      options: {
        includeUI: {
          // 默认开启绘图的功能
          // initMenu: 'draw',
          // 支持的菜单
          menu: [
            // 'crop', // 裁切
            // 'flip', // 翻转
            // 'rotate', // 旋转
            'draw', // 添加绘画
            'shape', // 添加形状
            // 'icon', // 添加图标
            'text' // 添加文本
            // 'mask' // 添加覆盖
            // 'filter' // 添加滤镜
          ],
          locale: locale_zh,
          // 菜单位置在下面
          menuBarPosition: 'bottom',
          // 默认加载的图片
          loadImage: {
            // // 图片路径
            path: Logo,
            // 图片的名字，可以省略
            name: 'sample'
          }
        }
      }
    }
  }
}
</script>
