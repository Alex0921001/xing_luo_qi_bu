import { connection } from '../database'

// 分页获取列表内容
export const getNoAutoList = async function (req, res) {
  const { name, sex, tag, comment, pageIndex, pageSize } = req.body // 从请求中获取查询参数

  // 构建动态查询条件
  let sql = `SELECT * FROM \`noautolist\` WHERE 1=1` // 1=1 是为了方便添加后续的 AND 条件
  const params: any[] = []

  // 根据查询参数构建条件
  if (name) {
    // 原写法用等号配模糊串，搜索永远不命中，顺手改成 LIKE
    sql += ` AND name LIKE ?`
    params.push(`%${name}%`)
  }
  if (sex) {
    sql += ` AND sex = ?`
    params.push(sex)
  }
  if (tag) {
    sql += ` AND tag LIKE ?`
    params.push(`%${tag}%`)
  }
  if (comment) {
    sql += ` AND comment LIKE ?`
    params.push(`%${comment}%`) // 使用通配符进行模糊查询
  }

  // 获取总记录数
  const totalSql = `SELECT COUNT(*) as total FROM \`noautolist\` WHERE 1=1`
  const [totalData] = await connection.query(totalSql, params) // 使用参数化查询

  // 处理分页
  const limit = parseInt(pageSize) || 10 // 每页大小，默认为10
  const offset = ((parseInt(pageIndex) || 1) - 1) * limit // 计算偏移量，默认为第一页
  sql += ` LIMIT ? OFFSET ?`
  params.push(limit, offset)

  const [data] = await connection.query(sql, params) // 使用参数化查询

  res.send({
    code: 200,
    message: '搜索成功',
    data: {
      list: data,
      total: totalData[0].total
    }
  })
}

// 根据 ID 获取单条数据的函数
export const getNoAutoById = async function (req, res) {
  const { Id } = req.body // 从请求参数中获取 ID

  // 构建 SQL 查询语句
  const sql = `SELECT * FROM \`noautolist\` WHERE Id = ?`

  try {
    const [data] = await connection.query(sql, [Id]) // 执行查询操作
    if (data.length > 0) {
      res.send({
        code: 200,
        message: '数据获取成功',
        data: data[0] // 返回查询到的第一条记录
      })
    } else {
      res.send({
        code: 404,
        message: '未找到相关数据'
      })
    }
  } catch (error: any) {
    res.send({
      code: 500,
      message: '数据获取失败',
      error: error.message // 返回错误信息
    })
  }
}

// 创建数据的函数
export const createNoAuto = async function (req, res) {
  const { name, sex, tag, comment, settings, shengniangan } = req.body // 解构获取表单数据

  const sql = `
    INSERT INTO \`noautolist\` (name, sex, tag, comment, settings, shengniangan)
    VALUES (?, ?, ?, ? ,?, ? )`

  const params = [name, sex, tag, comment, settings, shengniangan] // 将数据放入数组中

  try {
    const [data] = await connection.query(sql, params) // 执行插入操作
    res.send({
      code: 200,
      message: '搜索成功',
      data: data
    })
  } catch (error: any) {
    res.send({
      code: 500,
      message: '数据创建失败',
      error: error.message // 返回错误信息
    })
  }
}

// 更新数据的函数
export const updateNoAuto = async function (req, res) {
  const { name, sex, tag, comment, settings, Id, shengniangan } = req.body // 解构获取更新内容

  // 构建动态更新语句
  const updates: any[] = []
  const params: any[] = []

  if (name !== undefined) {
    updates.push(`name = ?`)
    params.push(name)
  }
  if (sex !== undefined) {
    updates.push(`sex = ?`)
    params.push(sex)
  }
  if (tag !== undefined) {
    updates.push(`tag = ?`)
    params.push(tag)
  }
  if (comment !== undefined) {
    updates.push(`comment = ?`)
    params.push(comment)
  }
  if (settings !== undefined) {
    updates.push(`settings = ?`)
    params.push(settings)
  }
  if (shengniangan !== undefined) {
    updates.push(`shengniangan = ?`)
    params.push(shengniangan)
  }

  // 确保至少有一个字段需要更新
  if (updates.length === 0) {
    return res.send({
      code: 400,
      message: '没有要更新的数据'
    })
  }

  // 构建 SQL 更新语句
  const sql = `UPDATE \`noautolist\` SET ${updates.join(', ')} WHERE Id = ?`
  params.push(Id) // 将 ID 添加到参数中

  try {
    const [data] = await connection.query(sql, params) // 执行更新操作
    res.send({
      code: 200,
      message: '数据更新成功',
      data: data // 返回更新结果
    })
  } catch (error: any) {
    res.send({
      code: 500,
      message: '数据更新失败',
      error: error.message // 返回错误信息
    })
  }
}

// 删除数据的函数
export const deleteNoAuto = async function (req, res) {
  const { Id } = req.body // 从请求参数中获取 ID

  // 构建 SQL 删除语句
  const sql = `DELETE FROM \`noautolist\` WHERE Id = ?`

  try {
    const [data] = await connection.query(sql, [Id]) // 执行删除操作
    if (data.affectedRows > 0) {
      res.send({
        code: 200,
        message: '数据删除成功'
      })
    } else {
      res.send({
        code: 404,
        message: '未找到要删除的数据'
      })
    }
  } catch (error: any) {
    res.send({
      code: 500,
      message: '数据删除失败',
      error: error.message // 返回错误信息
    })
  }
}
