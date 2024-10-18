const express = require('express')
const app = express()
const autoRouter = require('./routes/auto')
const homeRouter = require('./routes/home')
const noautoRouter = require('./routes/noauto')
const userRouter = require('./routes/user')

app.use('/auto', autoRouter)
app.use('/home', homeRouter)
app.use('/noauto', noautoRouter)
app.use('/user', userRouter)

app.listen(3000, function () {
  console.log('Server started on port 3000')
})
