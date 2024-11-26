import mysql2 from 'mysql2/promise'
import { config } from './config'

let connection // 声明一个全局变量
// 创建与数据库的连接
const connectDB = async () => {
  if (!connection) {
    // 检查是否已有连接
    connection = await mysql2.createConnection({
      ...config
    })
  }
  return connection
}

export { connectDB, connection }
