import { connection } from '../database'

// 获取全部四化列表
export const getSihuasList = async function (_req, res) {
  const sql = `SELECT * FROM \`xiangs\``

  const [data] = await connection.query(sql)

  res.send({
    code: 200,
    message: '搜索成功',
    data: data
  })
}
