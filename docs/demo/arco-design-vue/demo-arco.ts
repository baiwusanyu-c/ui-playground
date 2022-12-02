
import { getPlayPreset } from 'ui-playground'
import { jsdelivrLink } from 'ui-playground/utils/constant'
// @ts-expect-error 加载demo模板
import demoEpMain from './demo-arco-main.vue?raw'

export const demoEp = () => {
  const playConfig = getPlayPreset('vue')
  playConfig.headerOption.useVersion = true
  playConfig.headerOption.uiVersionLink = 'https://data.jsdelivr.com/v1/package/npm/element-plus'
  playConfig.headerOption.uiMinVersion = '2.2.8'
  playConfig.headerOption.logo = 'https://avatars.githubusercontent.com/u/68583457?s=200&v=4'
  playConfig.headerOption.title = 'element-plus'
  playConfig.headerOption.cdnSet = (
    link: string,
    pkgName: string,
    version: string,
    indexPath: string,
  ) => {
    return `${link}${pkgName}@${version}${indexPath}`
  }
  playConfig.importMap.push({
    name: 'element-plus',
    pkgName: 'element-plus',
    indexPath: '/dist/index.full.min.mjs',
    type: 'ui',
  },
  {
    name: '@element-plus/icons-vue',
    pkgName: '@element-plus/icons-vue',
    indexPath: '/dist/index.min.js',
    cdnLink: `${jsdelivrLink}/@element-plus/icons-vue@2/dist/index.min.js`,
    type: 'other',
  },
  )
  playConfig.mainFile.code = demoEpMain
  return playConfig
}
