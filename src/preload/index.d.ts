import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI & {
      changeWindowSize: (number, number) => void
    }
    api: unknown
  }
}
