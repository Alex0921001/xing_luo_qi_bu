import express from 'express'
import { getAutoList, getAutoById, createAuto, updateAuto, deleteAuto } from '../controller/auto'
const autoRouter = express.Router()

// 分页查询
autoRouter.post('/list', async function (_req, res) {
  await getAutoList(_req, res)
})
// 单条记录查询
autoRouter.post('/detail', async function (_req, res) {
  await getAutoById(_req, res)
})
// 创建
autoRouter.post('/create', async function (_req, res) {
  await createAuto(_req, res)
})
// 编辑
autoRouter.post('/update', async function (_req, res) {
  await updateAuto(_req, res)
})
// 删除
autoRouter.post('/delete', async function (_req, res) {
  await deleteAuto(_req, res)
})

export default autoRouter
