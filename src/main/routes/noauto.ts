import express from 'express'
const noautoRouter = express.Router()

noautoRouter.get('/get', function (_req, res) {
  res.send('Index Page')
})

noautoRouter.get('/about', function (_req, res) {
  res.send('About Page')
})

export default noautoRouter
