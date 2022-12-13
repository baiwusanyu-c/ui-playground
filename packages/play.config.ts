// @ts-expect-error 加载图片
import logo from '../play/asset/logo.png'
import {
  homePage,
  jsdelivrLink,
  latestVersion,
  react,
  reactLogo,
  uiMinVersion, uiVersionLink, unpkgLink, vue, vueLogo,
} from './utils/constant'
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
  cdnSet: (link: string, pkgName: string, version: string, indexPath: string) => string
  setting: ISetting
}
export declare interface importItem {
  name: string
  pkgName: string
  indexPath: string
  type: 'lib' | 'ui' | 'other' | 'css'
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
  eval?: Function
}
export declare interface ILayoutConfig {
  vertical: boolean
}
export declare interface IMainFile {
  filename: string
  code: string
}
export declare interface ISetting {
  ssr: boolean
  share: boolean
  dev: boolean
  download: boolean
  cdn: boolean
  userDeps: boolean
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
  useUno: boolean
  headerOption: headerOption
}

export const defaultConfig: playConfig = {
  isSSR: false,
  useUno: false,
  layout: {
    vertical: false,
  },
  presetType: 'unknown',
  headerOption: {
    title: 'UI',
    subTitle: 'playground',
    logo,
    homePage,
    useVersion: true,
    uiVersionLink,
    uiVersion: latestVersion,
    uiMinVersion,

    iconList: [
      {
        url: reactLogo,
        link: react,
      },
      {
        url: vueLogo,
        link: vue,
      },
    ],

    dark: false,
    cdnList: [
      {
        name: 'jsdelivr',
        link: jsdelivrLink,
      }, {
        name: 'unpkg',
        link: unpkgLink,
      },
    ],
    cdnSet: (
      link: string,
      pkgName: string,
      version: string,
      indexPath: string,
    ) => `${link}${pkgName}@${version}${indexPath}`,

    setting: {
      ssr: true,
      share: true,
      dev: true,
      download: true,
      cdn: true,
      userDeps: true,
    },
  },
  hooks: {},
  mainFile: {
    filename: '',
    code: '',
  },
  importMap: [],
}

export const mergeConfig = (config: playConfig, defaultConfigs = defaultConfig) => {
  return extend(defaultConfigs, config)
}
