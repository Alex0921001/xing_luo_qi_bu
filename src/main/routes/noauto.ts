import express from 'express'
import {
  getNoAutoList,
  getNoAutoById,
  createNoAuto,
  updateNoAuto,
  deleteNoAuto
} from '../controller/noauto'
const autoRouter = express.Router()

// 分页查询
autoRouter.post('/list', async function (_req, res) {
  await getNoAutoList(_req, res)
})
// 单条记录查询
autoRouter.post('/detail', async function (_req, res) {
  await getNoAutoById(_req, res)
})
// 创建
autoRouter.post('/create', async function (_req, res) {
  await createNoAuto(_req, res)
})
// 编辑
autoRouter.post('/update', async function (_req, res) {
  await updateNoAuto(_req, res)
})
// 删除
autoRouter.post('/delete', async function (_req, res) {
  await deleteNoAuto(_req, res)
})

export default autoRouter
