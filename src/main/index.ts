import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { startServer, stopServer } from './express'

let mainWindow
function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000, // 设置窗口的宽度为1000像素
    height: 750, // 设置窗口的高度为750像素
    show: false, // 初始时不显示窗口，可以在窗口内容加载完成后再显示
    autoHideMenuBar: true, // 自动隐藏菜单栏。
    // frame: false, // 无边框
    // transparent: true, // 透明
    resizable: true, // 调整窗口大小
    maximizable: false, // 最大化窗口
    fullscreenable: false, // 全屏
    minWidth: 720, // 最小宽度
    minHeight: 750, // 最小高度
    // 根据操作系统平台，可能需要设置窗口的图标。
    ...(process.platform === 'linux' ? { icon } : {}),

    // 设置网页的首选项，这些设置影响渲染进程的行为。
    webPreferences: {
      // 加载预加载脚本，该脚本在渲染进程启动前执行。
      preload: join(__dirname, '../preload/index.js'),
      // 是否启用沙盒模式。
      sandbox: false,
      // 是否启用 Node.js 集成。如果设置为 true，则可以在渲染进程中使用 Node.js API。
      nodeIntegration: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // 设置窗口打开新窗口的处理程序。
  // 当尝试打开新窗口时，使用系统的默认浏览器打开链接，而不是在应用内打开。
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' } // 拒绝在应用内打开新窗口
  })

  // 根据环境变量和是否处于开发模式来决定加载远程 URL 或本地 HTML 文件。
  // HMR 代表热模块替换，是一种在开发过程中不需要重新加载页面即可更新模块的技术。
  // 如果处于开发模式，并且环境变量 ELECTRON_RENDERER_URL 存在，则加载该 URL。
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// 这段代码描述了一个应用程序在 Electron 框架中的初始化流程
// 包括设置应用程序的用户模型 ID
// 创建登录窗口和系统托盘
// 并在需要时激活登录窗口
app.whenReady().then(async () => {
  // 设置应用程序的用户模型 ID
  // 这个 ID 用于在 Windows 操作系统中标识应用程序
  // 可以帮助操作系统区分不同的应用程序实例
  electronApp.setAppUserModelId('com.electron')

  // 监听 Electron 应用程序中 browser-window-created 事件
  // 每当创建一个新的浏览器窗口（BrowserWindow）实例时，这个事件会被触发
  // 在这里，使用了一个箭头函数来定义事件处理函数
  // 这个函数会接收两个参数：事件对象和新建的 BrowserWindow 实例
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  // 调用创建服务器函数
  await startServer()

  // 调用创建窗口函数
  createWindow()

  // 监听 Electron 应用程序的 activate 事件
  // 当应用程序被激活时，这个事件会被触发。激活事件通常发生在用户点击应用程序的图标时
  // 这里的事件处理函数检查当前是否没有打开的窗口
  // 如果没有，它将调用 createLoginWindow 函数，再次创建登录窗口
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('will-quit', stopServer)

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
