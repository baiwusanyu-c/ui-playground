import { getPlayPreset } from 'ui-playground'
import { compilerUNOCSS } from '../../../play/compiler-inject-unocss'
// @ts-expect-error 加载demo模板
import demoEpMain from './demo-onu-main.vue?raw'

// 最佳实践demo
export const demoOnu = () => {
  const playConfig = getPlayPreset('vue')
  playConfig.headerOption.useVersion = true
  playConfig.headerOption.uiVersionLink = 'https://data.jsdelivr.com/v1/package/npm/onu-ui'
  playConfig.headerOption.uiMinVersion = '1.0.10'
  playConfig.headerOption.logo = 'https://onu.zyob.top/logo.png'
  playConfig.headerOption.title = 'onu-ui'
  playConfig.headerOption.cdnSet = (
    link: string,
    pkgName: string,
    version: string,
    indexPath: string,
  ) => {
    return `${link}${pkgName}@${version}${indexPath}`
  }
  playConfig.importMap.push({
    name: 'onu-ui',
    pkgName: 'onu-ui',
    indexPath: '/dist/onu-ui.js',
    type: 'ui',
  },
  {
    name: 'onu-ui/css',
    pkgName: 'onu-ui/css',
    indexPath: '/dist/style.css',
    cdnLink: 'https://cdn.skypack.dev/onu-ui@latest/dist/style.css',
    type: 'css',
  },
  )
  playConfig.mainFile.code = demoEpMain
  playConfig.hooks.sandBoxMounted = (frame: HTMLIFrameElement) => {
    compilerUNOCSS(frame)
  }
  return playConfig
}
