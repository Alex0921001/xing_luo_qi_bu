import routers from './routes'
import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import cors from 'cors'
import loggerMiddleware from './middleware'

// 引入express框架
const app = express()

// 解析 JSON 请求体
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')))

// 设置跨域
app.use(cors())

// 使用中间件
app.use(loggerMiddleware)

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
