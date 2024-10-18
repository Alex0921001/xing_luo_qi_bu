// routes/index.js
const express = require('express')
const router = express.Router()

router.get('/get', function (req, res) {
  //通过 req.query 获取客户端通过查询字符串，发送到服务器的数据
  const query = req.query
  //调用 res.send() 方法，向客户端响应处理的结果
  res.send({
    stats: 0, //0 表示处理成功，1 表示处理失败
    msg: 'Get 请求成功', // 状态描述
    data: query //需要响应给客户端的数据
  })
})

module.exports = router
export {}
