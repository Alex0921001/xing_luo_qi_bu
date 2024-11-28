import { connection } from '../database'

// 获取全部宫位
export const getDizhisList = async function (_req, res) {
  const sql = `SELECT * FROM \`dizhis\``

  const [data] = await connection.query(sql)

  res.send({
    code: 200,
    message: '搜索成功',
    data: data
  })
}
