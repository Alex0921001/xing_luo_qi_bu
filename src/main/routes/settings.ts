import express from 'express'
import { getStarsList, getStarDetail, addStar, updateStar, deleteStar } from '../controller/stars'

const settingsRouter = express.Router()

// 获取全部星辰
settingsRouter.post('/star/list', async function (_req, res) {
  await getStarsList(_req, res)
})

// 获取星辰详情
settingsRouter.post('/star/detail', async function (_req, res) {
  await getStarDetail(_req, res)
})
// 新增星辰
settingsRouter.post('/star/add', async function (_req, res) {
  await addStar(_req, res)
})
// 修改星辰
settingsRouter.post('/star/update', async function (_req, res) {
  await updateStar(_req, res)
})
// 删除星辰
settingsRouter.post('/star/delete', async function (_req, res) {
  await deleteStar(_req, res)
})

export default settingsRouter
