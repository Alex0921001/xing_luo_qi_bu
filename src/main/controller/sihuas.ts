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

// 获取四化表内容
export const getSihuasTable = async function (_req, res) {
  const sql = `
    SELECT sihuas.* ,gans.name AS ganName, xiangs.name AS xiangName, stars.name AS starName
    FROM sihuas
    LEFT JOIN gans  ON sihuas.ganId = gans.Id
    LEFT JOIN xiangs ON sihuas.xiangId = xiangs.Id
    LEFT JOIN stars ON sihuas.starId = stars.Id;
  `

  const [data] = await connection.query(sql)

  res.send({
    code: 200,
    message: '搜索成功',
    data: data
  })
}

// 更新四化表的内容
export const updateSihuas = async function (req, res) {
  const { Id, moneyId, powerId, cultureId, dangerId } = req.body
  const arr = [moneyId, powerId, cultureId, dangerId]
  // 原写法用 forEach + async，没法等待更新完成就先返回响应，这里改成顺序 await
  for (let index = 0; index < arr.length; index++) {
    const xiangId = index + 1
    const sql = `
    UPDATE sihuas
    SET starId = ?
    WHERE ganId = ? AND xiangId = ?
  `
    await connection.query(sql, [arr[index], Id, xiangId])
  }

  res.send({
    code: 200,
    message: '更新成功',
    data: null
  })
}
