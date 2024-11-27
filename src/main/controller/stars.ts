import { connection } from '../database'

// 获取全部星辰
export const getStarsList = async function (_req, res) {
  const { name, type, subType } = _req.body
  // 构建查询条件
  const conditions: string[] = []
  const params: string[] = []

  if (name) {
    conditions.push('`name` LIKE ?')
    params.push(`%${name}%`) // 使用通配符
  } else {
    conditions.push('`name` IS NOT NULL') // 或者使用合适的条件
  }

  if (type) {
    conditions.push('`type` = ?')
    params.push(type)
  }

  if (subType) {
    conditions.push('`subType` = ?')
    params.push(subType)
  }

  conditions.push('`isDeleted` = 0') // 此条件始终加上

  const sql = `SELECT * FROM \`stars\` WHERE ${conditions.join(' AND ')}`

  const [data] = await connection.query(sql, params)

  res.send({
    code: 200,
    message: '搜索成功',
    data: data
  })
}

// 获取星辰详情
export const getStarDetail = async function (_req, res) {
  const { Id } = _req.body
  const [data] = await connection.query(
    'SELECT * FROM `stars` WHERE `Id` = ? AND `isDeleted` = 0',
    [Id]
  )

  if (data.length === 0) {
    return res.status(404).send({
      code: 404,
      message: '星辰不存在',
      data: null
    })
  }

  res.send({
    code: 200,
    message: '获取成功',
    data: data[0]
  })
}

// 新增星辰
export const addStar = async function (_req, res) {
  const { name, type, subType, x, y, comment } = _req.body
  // 输入校验
  if (!name || !type || !subType || !x || !y) {
    return res.status(400).send({
      code: 400,
      message: '参数缺失',
      data: null
    })
  }

  try {
    await connection.query(
      'INSERT INTO `stars` (name, type, subType, x, y, comment) VALUES (?, ?, ?, ?, ?, ?)',
      [name, type, subType, x, y, comment]
    )

    res.send({
      code: 200,
      message: '新增成功',
      data: null
    })
  } catch (error) {
    console.error('插入数据失败:', error)
    res.status(500).send({
      code: 500,
      message: '服务器错误',
      data: null
    })
  }
}

// 更新星辰
export const updateStar = async function (_req, res) {
  const { Id, name, type, subType, x, y, comment } = _req.body
  try {
    await connection.query(
      'UPDATE `stars` SET `name` = ?, `type` = ?, `subType` = ?, `x` = ?, `y` = ?, `comment` = ? WHERE `Id` = ?',
      [name, type, subType, x, y, comment, Id]
    )
    res.send({
      code: 200,
      message: '更新成功',
      data: null
    })
  } catch (error) {
    console.error('插入数据失败:', error)
    res.status(500).send({
      code: 500,
      message: '服务器错误',
      data: null
    })
  }
}

// 删除星辰
export const deleteStar = async function (_req, res) {
  const { Id } = _req.body
  try {
    await connection.query('UPDATE `stars` SET `isDeleted` = 1 WHERE `Id` = ?', [Id])
    res.send({
      code: 200,
      message: '删除成功',
      data: null
    })
  } catch (error) {
    console.error('删除数据失败:', error)
    res.status(500).send({
      code: 500,
      message: '服务器错误',
      data: null
    })
  }
}
