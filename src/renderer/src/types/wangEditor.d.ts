// src/types/wangEditor.d.ts

declare module '@wangeditor/editor-for-vue' {
  // 导入 Vue 构造函数
  import { VueConstructor } from 'vue'

  // WangEditor 配置选项的接口
  export interface WangEditorOptions {
    // 这里填写 WangEditor 的配置选项类型
    placeholder?: string
    height?: number
    [key: string]: any // 允许扩展其他任意属性
  }

  // WangEditor 组件类
  export class WangEditor extends Vue {
    $refs: {
      editor: any // 假设你通过 ref 访问了 editor 实例
    }
    config: WangEditorOptions // 配置选项
    // 其他可能的方法或属性
  }

  // Toolbar 组件类
  export class Toolbar extends Vue {
    // Toolbar 组件的方法和属性
    $refs: {
      toolbar: any // 假设你通过 ref 访问了 toolbar 实例
    }
    // 其他可能的方法或属性
  }
  // Editor 组件类
  export class Editor extends Vue {
    // Editor 组件的方法和属性
    $refs: {
      Editor: any // 假设你通过 ref 访问了 Editor 实例
    }
    // 其他可能的方法或属性
  }
  // 导出 Vue 插件的 install 方法
  export const install: (vue: typeof VueConstructor) => void

  // 默认导出
  export default install
}
