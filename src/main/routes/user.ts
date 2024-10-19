// routes/index.js
const express = require('express')
const router = express.Router()

router.get('/', function (_req, res) {
  res.send('Index Page')
})

router.get('/about', function (_req, res) {
  res.send('About Page')
})

module.exports = router
export {}
