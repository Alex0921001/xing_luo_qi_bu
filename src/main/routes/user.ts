import express from 'express'
const userRouter = express.Router()

userRouter.get('/get', function (_req, res) {
  res.send('Index Page')
})

userRouter.get('/about', function (_req, res) {
  res.send('About Page')
})

export default userRouter
