
import { getPlayPreset } from 'ui-playground'
// @ts-expect-error 加载demo模板
import demoArcoMain from './demo-arco-main.vue?raw'

export const demoArco = () => {
  const playConfig = getPlayPreset('vue')
  playConfig.headerOption.useVersion = true
  playConfig.headerOption.uiVersionLink = 'https://data.jsdelivr.com/v1/package/npm/@arco-design/web-vue'
  playConfig.headerOption.uiMinVersion = '2.2.8'
  playConfig.headerOption.logo = 'https://avatars.githubusercontent.com/u/64576149?s=200&v=4'
  playConfig.headerOption.title = 'Arco Design Vue'
  playConfig.headerOption.homePage = 'https://arco.design/'
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
      name: '@arco-design/web-vue/css',
      pkgName: '@arco-design/web-vue/css',
      indexPath: '/dist/index.css',
      cdnLink: 'https://cdn.skypack.dev/@arco-design/web-vue@latest/es/index.css',
      type: 'css',
    },
    {
      name: '@arco-design/web-vue',
      pkgName: '@arco-design/web-vue',
      indexPath: '/es/index.js',
      type: 'ui',
    },
    {
      name: '@arco-design/web-vue/es/icon',
      pkgName: '@arco-design/web-vue/es/icon',
      indexPath: '/es/icon/index.js',
      type: 'ui',
    },
    {
      name: '@arco-design/web-vue/',
      pkgName: '@arco-design/web-vue/',
      indexPath: '/es/index.js',
      type: 'ui',
    },
    {
      name: 'resize-observer-polyfill',
      pkgName: 'resize-observer-polyfill',
      indexPath: '',
      cdnLink: 'https://cdn.skypack.dev/resize-observer-polyfill',
      type: 'other',
    },
    {
      name: 'compute-scroll-into-view',
      pkgName: 'compute-scroll-into-view',
      indexPath: '',
      cdnLink: 'https://cdn.skypack.dev/compute-scroll-into-view',
      type: 'other',
    },
    {
      name: 'scroll-into-view-if-needed',
      pkgName: 'scroll-into-view-if-needed',
      indexPath: '',
      cdnLink: 'https://cdn.skypack.dev/scroll-into-view-if-needed',
      type: 'other',
    },
    {
      name: 'b-tween',
      pkgName: 'b-tween',
      indexPath: '',
      cdnLink: 'https://cdn.skypack.dev/b-tween',
      type: 'other',
    },
    {
      name: 'b-validate',
      pkgName: 'b-validate',
      indexPath: '',
      cdnLink: 'https://cdn.skypack.dev/b-validate',
      type: 'other',
    },
    {
      name: 'number-precision',
      pkgName: 'number-precision',
      indexPath: '',
      cdnLink: 'https://cdn.skypack.dev/number-precision',
      type: 'other',
    },
    {
      name: 'dayjs',
      pkgName: 'dayjs',
      indexPath: '',
      cdnLink: 'https://cdn.skypack.dev/dayjs',
      type: 'other',
    },
    {
      name: 'dayjs/plugin/customParseFormat',
      pkgName: 'dayjs/plugin/customParseFormat',
      indexPath: '',
      cdnLink: 'https://cdn.skypack.dev/dayjs/plugin/customParseFormat.js',
      type: 'other',
    },
    {
      name: 'dayjs/plugin/isBetween',
      pkgName: 'dayjs/plugin/isBetween',
      indexPath: '',
      cdnLink: 'https://cdn.skypack.dev/dayjs/plugin/isBetween.js',
      type: 'other',
    },
    {
      name: 'dayjs/plugin/weekOfYear',
      pkgName: 'dayjs/plugin/weekOfYear',
      indexPath: '',
      cdnLink: 'https://cdn.skypack.dev/dayjs/plugin/weekOfYear.js',
      type: 'other',
    },
    {
      name: 'dayjs/plugin/advancedFormat',
      pkgName: 'dayjs/plugin/advancedFormat',
      indexPath: '',
      cdnLink: 'https://cdn.skypack.dev/dayjs/plugin/advancedFormat.js',
      type: 'other',
    },
    {
      name: 'dayjs/plugin/weekYear',
      pkgName: 'dayjs/plugin/weekYear',
      indexPath: '',
      cdnLink: 'https://cdn.skypack.dev/dayjs/plugin/weekYear.js',
      type: 'other',
    },
    {
      name: 'dayjs/plugin/quarterOfYear',
      pkgName: 'dayjs/plugin/quarterOfYear',
      indexPath: '',
      cdnLink: 'https://cdn.skypack.dev/dayjs/plugin/quarterOfYear.js',
      type: 'other',
    },
    {
      name: 'dayjs/locale/zh-cn',
      pkgName: 'dayjs/locale/zh-cn',
      indexPath: '',
      cdnLink: 'https://cdn.skypack.dev/dayjs/locale/zh-cn.js',
      type: 'other',
    },

  )
  playConfig.mainFile.code = demoArcoMain
  return playConfig
}
