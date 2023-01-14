import { getPlayPreset } from 'ui-playground'
// @ts-expect-error 加载demo模板
import demoPuMain from './demo-pure-main.vue?raw'

// 最佳实践demo
export const demoPu = () => {
  const playConfig = getPlayPreset('vue')
  playConfig.headerOption.useVersion = false
  playConfig.headerOption.logo = './asset/logo.png'
  playConfig.headerOption.cdnSet = (
    link: string,
    pkgName: string,
    version: string,
    indexPath: string,
  ) => {
    return `${link}${pkgName}@${version}${indexPath}`
  }
  playConfig.mainFile.code = demoPuMain
  return playConfig
}
