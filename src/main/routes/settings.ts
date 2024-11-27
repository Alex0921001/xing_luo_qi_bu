import express from 'express'
const settingsRouter = express.Router()

settingsRouter.get('/get', function (_req, res) {
  res.send('Index Page')
})

settingsRouter.get('/about', function (_req, res) {
  res.send('About Page')
})

export default settingsRouter
