import routers from './routes'

// 引入express框架
const express = require('express')
const app = express()

// 解析 JSON 请求体
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// 设置静态文件目录
const path = require('path')
app.use(express.static(path.join(__dirname, 'public')))

// 设置跨域
const cors = require('cors')
app.use(cors())

// 引入路由
app.use('/api', routers)

const PORT = 3000
// 保存服务器实例，以便在需要时可以访问
let serverInstance
export const startServer = function () {
  return new Promise((resolve) => {
    serverInstance = app.listen(PORT, () => {
      resolve(serverInstance)
    })
  })
}
// 用于关闭服务器
export const stopServer = function () {
  if (serverInstance) {
    serverInstance.close()
  }
}
