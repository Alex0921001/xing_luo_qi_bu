#!/usr/bin/env node
/**
 * 一键发版脚本
 *
 * 作用：打包 Windows 安装包 -> 校验 latest.yml 与实际产物是否一致 -> 上传到 GitHub Releases
 *
 * 用法：
 *   node scripts/release.mjs             完整流程：打包 + 校验 + 上传
 *   node scripts/release.mjs --no-build  跳过打包，用 dist 里现成的产物
 *   node scripts/release.mjs --check     只做校验，不上传（发版前自检用）
 *
 * 依赖环境变量 GH_TOKEN（GitHub 个人访问令牌，勾 repo 权限）
 *
 * 之所以自己做校验和上传，是因为 electron-builder 的 --publish 有两个已知问题：
 * 1. 上传 120MB 大包时容易 read ECONNRESET 中断，且不会自动重试
 * 2. 某些情况下 latest.yml 里记录的 size/sha512 与实际 exe 对不上，会导致客户端更新校验失败
 */
import { execSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const OWNER = 'Alex0921001'
const REPO = 'xing_luo_qi_bu'
const DIST = path.resolve('dist')
const API = 'https://api.github.com'
const UPLOAD_API = 'https://uploads.github.com'

const args = process.argv.slice(2)
const noBuild = args.includes('--no-build')
const checkOnly = args.includes('--check')

const log = (...a) => console.log('[release]', ...a)
const fail = (msg) => {
  console.error('[release] 失败:', msg)
  process.exit(1)
}

// ---------- 1. 版本信息 ----------
const pkg = JSON.parse(readFileSync('package.json', 'utf8'))
const version = pkg.version
const tag = `v${version}`
const setupName = `${pkg.name}-${version}-setup.exe`
const blockmapName = `${setupName}.blockmap`

log(`准备发版 ${pkg.name} v${version}`)

// ---------- 2. 打包 ----------
if (noBuild) {
  log('跳过打包，使用 dist 现有产物')
} else {
  log('开始构建渲染层与主进程')
  execSync('npx electron-vite build', { stdio: 'inherit' })
  log('开始打包 Windows 安装程序')
  execSync('npx electron-builder --win', { stdio: 'inherit' })
}

// ---------- 3. 产物存在性 ----------
const setupPath = path.join(DIST, setupName)
const blockmapPath = path.join(DIST, blockmapName)
const ymlPath = path.join(DIST, 'latest.yml')
for (const p of [setupPath, blockmapPath, ymlPath]) {
  if (!existsSync(p)) fail(`缺少产物：${p}`)
}

// ---------- 4. 校验并校正 latest.yml ----------
const exeBuf = readFileSync(setupPath)
const size = exeBuf.length
const sha512 = createHash('sha512').update(exeBuf).digest('base64')

let yml = readFileSync(ymlPath, 'utf8')
const recordedSize = Number((yml.match(/size:\s*(\d+)/) || [])[1])
const recordedSha = (yml.match(/sha512:\s*(\S+)/) || [])[1]
const mismatch = recordedSize !== size || recordedSha !== sha512

if (mismatch) {
  log('latest.yml 与安装包不一致，已自动修正')
  log(`  原记录 size=${recordedSize} sha512=${String(recordedSha).slice(0, 20)}...`)
  log(`  实际值 size=${size} sha512=${sha512.slice(0, 20)}...`)
  yml = yml.replace(/sha512:\s*\S+/g, `sha512: ${sha512}`).replace(/size:\s*\d+/g, `size: ${size}`)
  writeFileSync(ymlPath, yml, 'utf8')
} else {
  log('latest.yml 校验通过，与安装包一致')
}

if (checkOnly) {
  log(`校验模式结束，安装包 ${(size / 1048576).toFixed(2)} MB`)
  process.exit(0)
}

// ---------- 5. 上传 ----------
const token = process.env.GH_TOKEN
if (!token) fail('缺少 GH_TOKEN 环境变量，请先执行 $env:GH_TOKEN = "ghp_xxx"')

const baseHeaders = {
  Authorization: `token ${token}`,
  Accept: 'application/vnd.github+json',
  'User-Agent': 'xing_luo_qi_bu-release'
}

async function apiCall(url, init = {}) {
  const res = await fetch(url, {
    ...init,
    headers: { ...baseHeaders, ...(init.headers || {}) }
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`${init.method || 'GET'} ${url} -> ${res.status} ${text.slice(0, 300)}`)
  }
  if (res.status === 204) return null
  return res.json()
}

// 查已有 release，没有就创建
let release
try {
  release = await apiCall(`${API}/repos/${OWNER}/${REPO}/releases/tags/${tag}`)
  log(`Release ${tag} 已存在，将复用并更新资产`)
} catch {
  release = await apiCall(`${API}/repos/${OWNER}/${REPO}/releases`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tag_name: tag, name: version, draft: false, prerelease: false })
  })
  log(`已创建 Release ${tag}`)
}

const assets = await apiCall(`${API}/repos/${OWNER}/${REPO}/releases/${release.id}/assets`)
const remoteByName = new Map(assets.map((a) => [a.name, a]))

async function upload(filePath, name, retries = 4) {
  const buf = readFileSync(filePath)
  const url = `${UPLOAD_API}/repos/${OWNER}/${REPO}/releases/${release.id}/assets?name=${encodeURIComponent(name)}`
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const started = Date.now()
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          ...baseHeaders,
          'Content-Type': 'application/octet-stream',
          'Content-Length': String(buf.length)
        },
        body: buf
      })
      if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(`HTTP ${res.status} ${text.slice(0, 200)}`)
      }
      const json = await res.json()
      const seconds = ((Date.now() - started) / 1000).toFixed(1)
      log(`上传完成 ${name}   ${(buf.length / 1048576).toFixed(2)} MB   ${seconds}s   state=${json.state}`)
      return json
    } catch (err) {
      log(`上传 ${name} 第 ${attempt} 次失败：${err.message}`)
      if (attempt === retries) fail(`上传 ${name} 重试 ${retries} 次仍失败`)
      await new Promise((r) => setTimeout(r, 3000 * attempt))
    }
  }
}

async function removeAssetIfExists(name) {
  const found = remoteByName.get(name)
  if (!found) return
  await apiCall(`${API}/repos/${OWNER}/${REPO}/releases/assets/${found.id}`, { method: 'DELETE' })
  log(`已移除远端旧资产 ${name}`)
  remoteByName.delete(name)
}

// 安装包体积大，远端已有同尺寸同哈希时跳过重传
const remoteExe = remoteByName.get(setupName)
let skipExe = false
if (remoteExe && remoteExe.size === size) {
  const localSha256 = 'sha256:' + createHash('sha256').update(exeBuf).digest('hex')
  if (remoteExe.digest && remoteExe.digest === localSha256) {
    skipExe = true
    log('远端安装包与本地完全一致，跳过上传以节省时间')
  }
}

await removeAssetIfExists('latest.yml')
await upload(ymlPath, 'latest.yml')

await removeAssetIfExists(blockmapName)
await upload(blockmapPath, blockmapName)

if (skipExe) {
  log('安装包未变动，保留远端文件')
} else {
  await removeAssetIfExists(setupName)
  await upload(setupPath, setupName)
}

// ---------- 6. 汇总 ----------
const finalAssets = await apiCall(`${API}/repos/${OWNER}/${REPO}/releases/${release.id}/assets`)
log('')
log('远端资产：')
for (const a of finalAssets) {
  log(`  ${a.name.padEnd(42)} ${(a.size / 1048576).toFixed(2).padStart(9)} MB  ${a.state}`)
}
log('')
log(`发版完成：https://github.com/${OWNER}/${REPO}/releases/tag/${tag}`)
log(`版本 ${version}，安装包 ${(size / 1048576).toFixed(2)} MB`)
log('下一步：用上一版本启动应用，确认能收到更新提示')
