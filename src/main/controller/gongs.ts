import { connection } from '../database'

// 获取全部宫位
export const getGongsList = async function (_req, res) {
  const sql = `SELECT * FROM \`boxs\``

  const [data] = await connection.query(sql)

  res.send({
    code: 200,
    message: '搜索成功',
    data: data
  })
}
