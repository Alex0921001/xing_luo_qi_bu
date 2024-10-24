const express = require('express')
const app = express()

// 设置静态文件目录
const path = require('path')
app.use(express.static(path.join(__dirname, 'public')))

// 设置跨域
const cors = require('cors')
app.use(cors())

// 导入路由模块
// const autoRouter = require('./routes/auto')
// const homeRouter = require('./routes/home')
// const noautoRouter = require('./routes/noauto')
// const userRouter = require('./routes/user')
// app.use('/auto', autoRouter)
// app.use('/home', homeRouter)
// app.use('/noauto', noautoRouter)
// app.use('/user', userRouter)

// 保存服务器实例，以便在需要时可以访问
let serverInstance
export const startServer = function () {
  return new Promise((resolve) => {
    serverInstance = app.listen(3000, () => {
      console.log('Server running on http://localhost:3000')
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
