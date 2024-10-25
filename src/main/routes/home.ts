import express from 'express'
const homeRouter = express.Router()

homeRouter.get('/get', function (_req, res) {
  res.send('Index Page')
})

homeRouter.get('/about', function (_req, res) {
  res.send('About Page')
})

export default homeRouter
