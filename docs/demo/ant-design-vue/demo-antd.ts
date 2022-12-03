
import { getPlayPreset } from 'ui-playground'
import { jsdelivrLink } from 'ui-playground/utils/constant'
// @ts-expect-error 加载demo模板
import demoAntMain from './demo-antd-main.vue?raw'

export const demoAntd = () => {
  const playConfig = getPlayPreset('vue')
  playConfig.headerOption.useVersion = true
  playConfig.headerOption.uiVersionLink = 'https://data.jsdelivr.com/v1/package/npm/ant-design-vue'
  playConfig.headerOption.uiMinVersion = '3.2.14'
  playConfig.headerOption.logo = 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg'
  playConfig.headerOption.title = 'Ant Design Vue'
  playConfig.headerOption.cdnSet = (
    link: string,
    pkgName: string,
    version: string,
    indexPath: string,
  ) => {
    return `${link}${pkgName}@${version}${indexPath}`
  }
  playConfig.importMap.push(
    {
      name: 'ant-design-vue/button',
      pkgName: 'ant-design-vue',
      indexPath: '/es/button.js',
      cdnLink: 'https://cdn.jsdelivr.net/npm/ant-design-vue@3.2.15/es/button/button.js',
      type: 'other',
    },
  )
  playConfig.mainFile.code = demoAntMain
  return playConfig
}
