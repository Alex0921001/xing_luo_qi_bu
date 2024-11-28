import express from 'express'
import { getStarsList, getStarDetail, addStar, updateStar, deleteStar } from '../controller/stars'
import { getGongsList } from '../controller/gongs'
import { getGansList } from '../controller/gans'
import { getDizhisList } from '../controller/dizhis'
import { getSihuasList, getSihuasTable, updateSihuas } from '../controller/sihuas'

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

// 获取宫位列表
settingsRouter.post('/box/list', async function (_req, res) {
  await getGongsList(_req, res)
})

// 获取天干列表
settingsRouter.post('/gan/list', async function (_req, res) {
  await getGansList(_req, res)
})

// 获取地支列表
settingsRouter.post('/dizhi/list', async function (_req, res) {
  await getDizhisList(_req, res)
})

// 获取四化列表
settingsRouter.post('/sihua/list', async function (_req, res) {
  await getSihuasList(_req, res)
})

// 获取四化表内容
settingsRouter.post('/sihua/table', async function (_req, res) {
  await getSihuasTable(_req, res)
})

// 更新四化表的内容
settingsRouter.post('/sihua/update', async function (_req, res) {
  await updateSihuas(_req, res)
})

export default settingsRouter
