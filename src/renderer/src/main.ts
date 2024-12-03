import './assets/main.css'
import './assets/tailwind.css'

import { createApp } from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import './assets/iconfont/iconfont.css'
import './assets/iconfont/iconfont.js'
import { setupRouter } from './router'
import VxeUITable from 'vxe-table'
import 'vxe-table/lib/style.css'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(Antd)
app.use(VxeUITable)
// 安装router
setupRouter(app)
app.mount('#app')
