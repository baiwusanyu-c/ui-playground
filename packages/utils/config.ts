import type { File } from '../store/file'
import { compileVue } from './compiler/compiler-vue'
import { extend } from './index'
export declare interface iconItem {
  link: string
  url: string
}
export declare interface CDNItem {
  link: string
  name: string
}

export declare interface headerOption {
  title: string
  subTitle: string
  logo: string
  homePage: string
  uiVersionLink?: string
  uiVersion?: string
  uiMinVersion?: string
  libVersionLink?: string
  libVersion?: string
  libMinVersion?: string
  iconList?: Array<iconItem>
  dark: boolean
  cdnList: Array<CDNItem>
  cdnSet: Function
}
export declare interface importItem {
  name: string
  pkgName: string
  indexPath: string
  type: 'lib' | 'ui' | 'other'
  cdnLink?: string // 'other' 类型才传
}
export declare interface playConfig {
  headerOption: headerOption
  importMap: Array<importItem>
  mainFile: {
    filename: string
    code: string
  }
  compiler?: Function
}
export const jsdelivrLink = 'https://fastly.jsdelivr.net/npm/'
export const unpkgLink = 'https://unpkg.com/'
export const defaultConfig: playConfig = {
  headerOption: {
    title: 'Ant Design',
    subTitle: 'playground',
    logo: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
    homePage: 'https://ant.design/docs/react/introduce-cn',

    uiVersionLink: 'https://data.jsdelivr.com/v1/package/npm/ant-design-vue',
    uiVersion: 'latest',
    uiMinVersion: '3.0.0',
    libVersionLink: 'https://data.jsdelivr.com/v1/package/npm/vue',
    libVersion: 'latest',
    libMinVersion: '3.2.0',

    iconList: [
      {
        url: 'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg',
        link: 'https://react.docschina.org/',
      },
      {
        url: 'https://github.githubassets.com/favicons/favicon.svg',
        link: 'https://github.com/ant-design/ant-design',
      },
    ],

    dark: false,
    cdnList: [{
      name: 'unpkg',
      link: unpkgLink,
    },
    {
      name: 'jsdelivr',
      link: jsdelivrLink,
    }, {
      name: 'toaw',
      link: 'https://toaw.com/',
    },
    ],
    cdnSet: (
      link: string,
      pkgName: string,
      version: string,
      indexPath: string,
    ) => `${link}${pkgName}@${version}${indexPath}`,
  },
  importMap: [
    {
      name: '@vue/runtime-dom',
      pkgName: '@vue/runtime-dom',
      indexPath: '/dist/runtime-dom.esm-browser.js',
      type: 'lib',
    },
    {
      name: ' @vue/compiler-sfc',
      pkgName: '@vue/compiler-sfc',
      indexPath: '/dist/compiler-sfc.esm-browser.js',
      type: 'lib',
    },
    {
      name: 'ant-design-vue',
      pkgName: 'ant-design-vue',
      indexPath: '/dist/antd.min.js',
      type: 'ui',
    },
    {
      name: 'ant-design-other',
      pkgName: 'ant-design-other',
      indexPath: '/dist/other.min.js',
      type: 'other',
      cdnLink: jsdelivrLink,
    },
  ],
  mainFile: {
    filename: 'App.vue',
    code: '<script setup>\n'
      + 'import { ref } from \'vue\'\n'
      + '\n'
      + 'const msg = ref(\'Hello World!\')\n'
      + '</script>\n'
      + '\n'
      + '<template>\n'
      + '  <h1>{{ msg }}</h1>\n'
      + '  <input v-model="msg">\n'
      + '</template>',
  },
  compiler: (ctx: any, file: File, compiler: Record<string, any>) => {
    compileVue(ctx, file, compiler, {})
  },
}

export const mergeConfig = (config: playConfig, defaultConfigs = defaultConfig) => {
  return extend(defaultConfigs, config)
}
