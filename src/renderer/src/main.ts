import './assets/main.css'
import './assets/tailwind.css'

import { createApp } from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import './assets/iconfont/iconfont.css'
import './assets/iconfont/iconfont.js'

const app = createApp(App)
app.use(Antd)
app.mount('#app')
