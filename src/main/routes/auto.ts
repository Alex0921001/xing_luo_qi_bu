import express from 'express'
const autoRouter = express.Router()

autoRouter.get('/get', function (_req, res) {
  res.send('Index Page')
})

autoRouter.get('/about', function (_req, res) {
  res.send('About Page')
})

export default autoRouter
