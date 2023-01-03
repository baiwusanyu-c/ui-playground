
import { compileVue } from '../compiler/compiler-output-vue'
import { compileModulesForPreview } from '../compiler/compiler-module-vue'
import { compilerInjectVue } from '../compiler/compiler-inject-vue'
import type { File, fileStore } from '../store/file'
import type { ICompileConfig } from '../play.config'

export const presetVueConfig: ICompileConfig = {
  presetType: 'vue',
  importMap: [
    {
      name: 'vue',
      pkgName: '@vue/runtime-dom',
      indexPath: '/dist/runtime-dom.esm-browser.js',
      type: 'lib',
    },
    {
      name: 'vue/server-renderer',
      pkgName: '@vue/server-renderer',
      indexPath: '/dist/server-renderer.esm-browser.js',
      type: 'lib',
    },
    {
      name: '@vue/compiler-sfc',
      pkgName: '@vue/compiler-sfc',
      indexPath: '/dist/compiler-sfc.esm-browser.js',
      type: 'lib',
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
      + '  <h1 id=\'title_demo\'>{{ msg }}</h1>\n'
      + '  <input v-model="msg">\n'
      + '</template>\n'
      + '<style>\n'
      + '  #title_demo{\n'
      + '    color: #2da44e\n'
      + '  }\n'
      + '</style>',
  },
  // output 的编译方法
  compileOutput: async(
    fileST: typeof fileStore,
    isSSR,
    isProd,
    file: File,
    compiler: Record<string, any>) => {
    // console.log('isProd', isProd)
    // console.log('isSSR', isSSR)
    await compileVue(fileST, file, isSSR, isProd, compiler, {})
  },
  // module 的编译方法
  compileModule: (
    fileST: typeof fileStore,
    isSSR = false,
    isClient: boolean,
  ) => {
    // console.log('isProd', fileST.isProdCompile)
    console.log('isClient', isClient)
    return compileModulesForPreview(fileST, isSSR)
  },
  // Inject 的编译方法
  compileInject: (
    fileST: typeof fileStore,
    isSSR = false,
    isClient: boolean,
    modules: Array<string>) => {
    // console.log('isProd', fileST.isProdCompile)
    // console.log('isSSR', isSSR)
    return compilerInjectVue(fileST, isSSR, isClient, modules)
  },
  hooks: {
    eval: async(evalFn) => {
      evalFn && await (evalFn)('console.log("inject script running")')
    },
  },
}
