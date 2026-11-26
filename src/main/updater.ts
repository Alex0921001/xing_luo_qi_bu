import { app, dialog, BrowserWindow } from 'electron'
import { autoUpdater } from 'electron-updater'

// 自动更新基于 electron-updater，发布源是 GitHub Releases
// 流程：启动后校验远端 latest.yml 版本 → 静默下载新安装包 → 提示用户重启安装
export function setupUpdater(win: BrowserWindow): void {
  // 开发态没有安装包，也没有版本基线，直接跳过
  if (!app.isPackaged) return

  autoUpdater.autoDownload = true
  // 用户点「稍后」时，退出应用时自动完成安装
  autoUpdater.autoInstallOnAppQuit = true

  autoUpdater.on('update-available', (info) => {
    win.webContents.send('update:available', info.version)
  })

  autoUpdater.on('download-progress', (progress) => {
    win.webContents.send('update:progress', Math.round(progress.percent))
  })

  autoUpdater.on('update-downloaded', async (info) => {
    const { response } = await dialog.showMessageBox(win, {
      type: 'info',
      buttons: ['立即重启更新', '稍后'],
      defaultId: 0,
      cancelId: 1,
      noLink: true,
      title: '发现新版本',
      message: `新版本 v${info.version} 已下载完成`,
      detail: '点「立即重启更新」会关闭应用并完成安装，你的命盘数据不会丢失。点「稍后」则在下次退出时自动安装。'
    })
    if (response === 0) {
      autoUpdater.quitAndInstall()
    }
  })

  autoUpdater.on('error', (err) => {
    console.error('自动更新异常:', err?.message ?? err)
  })

  // 延迟几秒再检查，避免和首屏渲染抢资源
  setTimeout(() => {
    autoUpdater.checkForUpdates().catch((err) => {
      console.error('检查更新失败:', err?.message ?? err)
    })
  }, 5000)
}
