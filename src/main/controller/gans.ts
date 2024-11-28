import { connection } from '../database'

// 获取全部天干
export const getGansList = async function (_req, res) {
  const sql = `SELECT * FROM \`gans\``

  const [data] = await connection.query(sql)

  res.send({
    code: 200,
    message: '搜索成功',
    data: data
  })
}
