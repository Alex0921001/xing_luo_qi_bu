import express from 'express'
import { connection } from '../database'

const noautoRouter = express.Router()

noautoRouter.get('/get', function (_req, res) {
  res.send('Index Page')
})

noautoRouter.get('/about', async function (_req, res) {
  const [data] = await connection.query('SELECT * FROM `xiangs`')
  const resp = {
    data,
    message: 'About Page',
    code: 200
  }
  res.send(resp)
})

export default noautoRouter
