
import { extend } from './utils'
import type { File, fileStore } from './store/file'

export declare interface iconItem {
  link: string
  url: string
}
export declare interface CDNItem {
  link: string
  name: string
}

export declare interface headerOption {
  useVersion: boolean
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
  cdnSet: ( link: string, pkgName: string, version: string, indexPath: string) => string
}
export declare interface importItem {
  name: string
  pkgName: string
  indexPath: string
  type: 'lib' | 'ui' | 'other'
  cdnLink?: string // 'other' 类型才传
}
export declare interface IHooks {
  beforeCompileOutput?: Function
  compiledOutput?: Function
  beforeCompileModule?: Function
  compiledModule?: Function
  beforeCreateInject?: Function
  createdInject?: Function
  sandBoxMounted?: Function
}
export declare interface ILayoutConfig {
  vertical: boolean
}
export declare interface IMainFile {
  filename: string
  code: string
}
export declare type TCompileOutput = (fileST: typeof fileStore, file: File, compiler: Record<string, any>) => void
export declare type TCompileInject = (fileST: typeof fileStore, isSSR: boolean, modules: Array<string>) => Array<string>
export declare type TCompileModule = (fileST: typeof fileStore, isSSR: boolean) => Array<string>
export declare type presetTypes = 'vue' | 'react' | 'svelte' | 'unknown'
export declare interface ICompileConfig {
  presetType: presetTypes
  importMap: Array<importItem>
  mainFile: IMainFile
  compileOutput?: TCompileOutput
  compileInject?: TCompileInject
  compileModule?: TCompileModule
  hooks: IHooks
}
export declare interface playConfig extends ICompileConfig{
  layout: ILayoutConfig
  isSSR: boolean
  headerOption: headerOption
}



export const jsdelivrLink = 'https://fastly.jsdelivr.net/npm/'
export const unpkgLink = 'https://unpkg.com/'

export const defaultConfig: playConfig = {
  isSSR: false,
  layout: {
    vertical: false,
  },
  presetType: 'unknown',
  headerOption: {
    title: 'Be-UI',
    subTitle: 'playground',
    logo: 'https://github.com/baiwusanyu-c/ui-playground/blob/master/play/asset/logo.png?raw=true',
    homePage: 'https://github.com/baiwusanyu-c/ui-playground',

    useVersion: true,
    uiVersionLink: 'https://data.jsdelivr.com/v1/package/npm/ant-design-vue',
    uiVersion: 'latest',
    uiMinVersion: '3.0.0',

    iconList: [
      {
        url: 'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg',
        link: 'https://react.docschina.org/',
      },
      {
        url: 'https://qn.antdv.com/vue.png',
        link: 'https://github.com/vuejs/core',
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
    },
    ],
    cdnSet: (
      link: string,
      pkgName: string,
      version: string,
      indexPath: string,
    ) => `${link}${pkgName}@${version}${indexPath}`,
  },
  hooks:{},
  mainFile:{
    filename:'',
    code: ''
  },
  importMap:[]
}

export const mergeConfig = (config: playConfig, defaultConfigs = defaultConfig) => {
  return extend(defaultConfigs, config)
}
