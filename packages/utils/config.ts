// TODO： vue 的预设
import { compileVue } from './compiler/compiler-output-vue'
import { compileModulesForPreview } from './compiler/compiler-module-vue'
import { compilerInjectVue } from './compiler/compiler-inject-vue'
import { extend } from './index'
import type { File, fileStore } from '../store/file'

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
export declare type TCompileOutput = (fileST: typeof fileStore, file: File, compiler: Record<string, any>) => void
export declare type TCompileInject = (fileST: typeof fileStore, isSSR: boolean, modules: Array<string>) => Array<string>
export declare type TCompileModule = (fileST: typeof fileStore, isSSR: boolean) => Array<string>
export declare interface playConfig {
  layout: ILayoutConfig
  headerOption: headerOption
  importMap: Array<importItem>
  mainFile: {
    filename: string
    code: string
  }
  compileOutput?: TCompileOutput
  compileInject?: TCompileInject
  compileModule?: TCompileModule
  hooks: IHooks
}
export const jsdelivrLink = 'https://fastly.jsdelivr.net/npm/'
export const unpkgLink = 'https://unpkg.com/'
export const defaultConfig: playConfig = {
  layout: {
    vertical: false,
  },
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
      name: '@vue/server-renderer',
      pkgName: '@vue/server-renderer',
      indexPath: '/dist/server-renderer.esm-browser.js',
      type: 'lib',
    },
    {
      name: '  @vue/compiler-sfc',
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
    // {
    //   name: 'ant-design-other',
    //   pkgName: 'ant-design-other',
    //   indexPath: '/dist/other.min.js',
    //   type: 'other',
    //   cdnLink: jsdelivrLink,
    // },
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
      + '  <h1 id=\'title_demo\'>{{ msg }}</h1>\n'
      + '  <input v-model="msg">\n'
      + '</template>\n'
      + '<style>\n'
      + '  #title_demo{\n'
      + '    color: red\n'
      + '  }\n'
      + '</style>',
  },
  // output 的编译方法
  compileOutput: async(fileST: typeof fileStore, file: File, compiler: Record<string, any>) => {
    await compileVue(fileST, file, compiler, {})
  },
  // module 的编译方法
  compileModule: (fileST: typeof fileStore, isSSR = false) => {
    return compileModulesForPreview(fileST, isSSR)
  },
  // Inject 的编译方法
  compileInject: (fileST: typeof fileStore, isSSR = false, modules: Array<string>) => {
    return compilerInjectVue(fileST, isSSR, modules)
  },
  // 钩子
  hooks: {
    // output 编译前 ✔
    beforeCompileOutput: (fileST: typeof fileStore, file: File, compiler: Record<string, any>) => {
      // console.log(fileST, file, compiler)
    },
    // output 编译后 ✔
    compiledOutput: (fileST: typeof fileStore, file: File, compiler: Record<string, any>) => {
      // console.log(fileST, file, compiler)
    },
    // Module 编译前 ✔
    beforeCompileModule: (fileST: typeof fileStore, isSSR: boolean) => {
      // console.log(fileST, isSSR)
    },
    // Module 编译后 ✔
    compiledModule: (fileST: typeof fileStore, isSSR: boolean, modules: string[]) => {
      modules.forEach((value,index) => {
        value = value.replace('from \'vue\'', 'from \'@vue/runtime-dom\'')
        value = value.replace('from "vue"', 'from \'@vue/runtime-dom\'')
        if (isSSR) {
          value = value.replace('from \'vue/server-renderer\'', 'from \'@vue/server-renderer\'')
          value = value.replace('from "vue/server-renderer"', 'from \'@vue/server-renderer\'')
        }
        modules[index] = value
      })
    },
    // ssr server 、csr、ssr 注入前 ✔
    beforeCreateInject: (fileST: typeof fileStore, isSSR: boolean, modules: string[]) => {
      // console.log(fileST, isSSR, modules)
    },
    // ssr server 、csr、ssr 注入后 ✔
    createdInject: (fileST: typeof fileStore, isSSR: boolean, injects: string[]) => {
      // injects[1] =  injects[1].replace('Hello','WoW')
      //  console.log(fileST, isSSR, injects)
    },
    // sandbox 首次注入后 ✔
    sandBoxMounted: () => {
      console.log('sandBoxMounted')
    },
  },
}

export const mergeConfig = (config: playConfig, defaultConfigs = defaultConfig) => {
  return extend(defaultConfigs, config)
}
