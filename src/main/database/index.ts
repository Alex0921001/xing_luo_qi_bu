import fs from 'fs'
import path from 'path'
import { app } from 'electron'
import initSqlJs from 'sql.js'
import { SCHEMA_SQL } from './schema'
import { SEED_DIZHIS, SEED_GANS, SEED_GONGS, SEED_SIHUAS, SEED_STARS, SEED_XIANGS } from './seed'

// sql.js 是 WASM 版 SQLite，不需要本地编译，跨平台打包不会踩原生模块的坑
// 数据库是一个普通文件，放在用户数据目录，卸载重装不丢，也方便用户自己备份
let db: any = null
let dbFilePath = ''

// wasm 路径优先用模块解析定位，开发态和打包进 asar 后都能找到，不依赖产物目录层级
const resolveWasmDir = (): string => {
  try {
    return path.dirname(require.resolve('sql.js/dist/sql-wasm.wasm'))
  } catch {
    return path.join(__dirname, '../../node_modules/sql.js/dist')
  }
}

const wasmDir = resolveWasmDir()

const resolveDbFilePath = (): string => {
  try {
    return path.join(app.getPath('userData'), 'xlqb.db')
  } catch {
    return path.join(process.cwd(), 'xlqb.db')
  }
}

// 落盘用临时文件加改名，避免写到一半中断把库写坏
const persist = (): void => {
  if (!db || !dbFilePath) return
  const tmpPath = `${dbFilePath}.tmp`
  fs.writeFileSync(tmpPath, Buffer.from(db.export()))
  fs.renameSync(tmpPath, dbFilePath)
}

const isEmptyTable = (table: string): boolean => {
  const res = db.exec(`SELECT COUNT(*) AS c FROM \`${table}\``)
  if (!res.length || !res[0].values.length) return true
  return Number(res[0].values[0][0]) === 0
}

// 字典表首次启动灌入种子数据，已有数据则跳过，避免覆盖用户改过的配置
const seedDictionaries = (): void => {
  db.run('BEGIN')
  try {
    if (isEmptyTable('boxs')) {
      for (const it of SEED_GONGS) {
        db.run(
          'INSERT INTO `boxs` (`Id`,`name`,`type`,`subType`,`fullName`,`x`,`y`,`comment`) VALUES (?,?,?,?,?,?,?,?)',
          [it.Id, it.name, it.type, it.subType, it.fullName, '', '', '']
        )
      }
    }
    if (isEmptyTable('stars')) {
      for (const it of SEED_STARS) {
        db.run(
          'INSERT INTO `stars` (`Id`,`name`,`type`,`subType`,`x`,`y`,`comment`,`isDeleted`) VALUES (?,?,?,?,?,?,?,0)',
          [it.Id, it.name, it.type, it.subType, '', '', '']
        )
      }
    }
    if (isEmptyTable('gans')) {
      for (const it of SEED_GANS) {
        db.run(
          'INSERT INTO `gans` (`Id`,`name`,`type`,`subType`,`fullName`,`x`,`y`,`comment`) VALUES (?,?,?,?,?,?,?,?)',
          [it.Id, it.name, it.type, it.subType, it.fullName, '', '', '']
        )
      }
    }
    if (isEmptyTable('dizhis')) {
      for (const it of SEED_DIZHIS) {
        db.run(
          'INSERT INTO `dizhis` (`Id`,`name`,`type`,`subType`,`fullName`,`x`,`y`,`comment`) VALUES (?,?,?,?,?,?,?,?)',
          [it.Id, it.name, it.type, it.subType, it.fullName, '', '', '']
        )
      }
    }
    if (isEmptyTable('xiangs')) {
      for (const it of SEED_XIANGS) {
        db.run('INSERT INTO `xiangs` (`Id`,`name`) VALUES (?,?)', [it.Id, it.name])
      }
    }
    if (isEmptyTable('sihuas')) {
      for (const it of SEED_SIHUAS) {
        db.run('INSERT INTO `sihuas` (`ganId`,`xiangId`,`starId`) VALUES (?,?,?)', [
          it.ganId,
          it.xiangId,
          it.starId
        ])
      }
    }
    db.run('COMMIT')
  } catch (err) {
    db.run('ROLLBACK')
    throw err
  }
}

export const initDatabase = async (): Promise<void> => {
  if (db) return
  const SQL = await initSqlJs({ locateFile: (file: string) => path.join(wasmDir, file) })
  dbFilePath = resolveDbFilePath()
  const dir = path.dirname(dbFilePath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

  if (fs.existsSync(dbFilePath)) {
    db = new SQL.Database(fs.readFileSync(dbFilePath))
  } else {
    db = new SQL.Database()
  }

  db.exec(SCHEMA_SQL)
  seedDictionaries()
  persist()
}

const ensureDb = (): any => {
  if (!db) throw new Error('数据库尚未初始化，请先调用 initDatabase()')
  return db
}

const isSelectLike = (sql: string): boolean => /^\s*(select|pragma|with)\b/i.test(sql)

// 对外保持与原先 mysql2 一致的调用形态：await connection.query(sql, params) => [rows]
// 写操作返回 [{ affectedRows, insertId }]，读操作返回 [行数组]，controller 无需改动调用方式
export const connection = {
  async query(sql: string, params: any[] = []): Promise<any[]> {
    const database = ensureDb()
    if (isSelectLike(sql)) {
      const stmt = database.prepare(sql)
      try {
        if (params.length) stmt.bind(params)
        const rows: any[] = []
        while (stmt.step()) rows.push(stmt.getAsObject())
        return [rows]
      } finally {
        stmt.free()
      }
    }
    database.run(sql, params)
    const affectedRows = database.getRowsModified()
    let insertId = 0
    const idRes = database.exec('SELECT last_insert_rowid() AS id')
    if (idRes.length && idRes[0].values.length) insertId = Number(idRes[0].values[0][0])
    persist()
    return [{ affectedRows, insertId }]
  }
}

export const getDatabasePath = (): string => dbFilePath

// 退出前兜底保存一次，防止有未落盘的变更
export const closeDatabase = (): void => {
  if (!db) return
  try {
    persist()
  } catch (err) {
    console.error('数据库保存失败:', err)
  }
  try {
    db.close()
  } catch {
    // 关闭失败不影响退出
  }
  db = null
}
