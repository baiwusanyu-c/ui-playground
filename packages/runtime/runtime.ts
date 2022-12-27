import { runHooks, sendException } from '../utils'
import { fileStore } from '../store/file'
import { compilerUNOCSS } from '../compiler/compiler-inject-unocss'
import { transformVue } from './transform-vue'
import type { IDepsList } from '../store/deps'
import type { presetTypes } from '../play.config'

export async function injectSSRServer(fileST: typeof fileStore, isSSR: boolean) {
  try {
    runHooks(
      fileST.hooks,
      'beforeCompileModule',
      fileST,
      isSSR,
    )
    const ssrModules = await fileST.compileModule!(fileST, isSSR)
    runPresetTransform(
      fileST.presetType,
      fileST,
      isSSR,
      ssrModules,
    )
    runHooks(
      fileST.hooks,
      'compiledModule',
      fileST,
      isSSR,
      ssrModules,
    )
    runHooks(
      fileST.hooks,
      'beforeCreateInject',
      fileST,
      isSSR,
      ssrModules,
    )
    const injectRes = await fileST.compileInject!(fileST, isSSR, ssrModules)
    runHooks(
      fileST.hooks,
      'createdInject',
      fileST,
      isSSR,
      injectRes,
    )
    return injectRes
  } catch (e) {
    sendException((e as Error).message, 'error')
  }
}

export async function injectClient(fileST: typeof fileStore, isSSR?: boolean) {
  try {
    runHooks(
      fileST.hooks,
      'beforeCompileModule',
      fileST,
      isSSR,
    )
    // 将源码编译，得到编译后结果(这里会根据虚拟文件分割模块)
    const modules = await fileST.compileModule!(fileST, isSSR)
    runPresetTransform(
      fileST.presetType,
      fileST,
      isSSR!,
      modules,
    )
    runHooks(
      fileST.hooks,
      'compiledModule',
      fileST,
      isSSR,
      modules,
    )
    runHooks(
      fileST.hooks,
      'beforeCreateInject',
      fileST,
      isSSR,
      modules,
    )
    const injectRes = await fileST.compileInject!(fileST, isSSR, modules)
    runHooks(
      fileST.hooks,
      'createdInject',
      fileST,
      isSSR,
      injectRes,
    )
    return injectRes
  } catch (e) {
    sendException((e as Error).message, 'error')
  }
}

export async function injectSandBoxMounted(injectScriptList: Array<string>) {
  injectScriptList.push('parent.postMessage({ action: \'iframeMounted\'}, \'*\');')
}

export function runPresetTransform(
  type: presetTypes,
  fileST: typeof fileStore,
  isSSR: boolean,
  modules: string[]) {
  if (type === 'vue')
    transformVue(fileST, isSSR, modules)
}

export function injectUICSS(depsCss: Record<string, IDepsList>) {
  let script = 'const uiCSSList = ['
  Object.keys(depsCss).forEach((value) => {
    script = `${script} '${depsCss[value].path}'\n`
  })
  script = `${script}]\n`
  script = `${script}function loadStyle(href) {\n`
    + '    return new Promise((resolve, reject) => {\n'
    + '      const link = document.createElement(\'link\')\n'
    + '      link.rel = \'stylesheet\'\n'
    + '      link.href = href\n'
    + '      link.addEventListener(\'load\', resolve)\n'
    + '      link.addEventListener(\'error\', reject)\n'
    + '      document.head.append(link)\n'
    + '    })\n'
    + '  }\n'

  script = `${script} for (let i = 0; i < uiCSSList.length; i++) {\n`
    + '    await loadStyle(uiCSSList[i])\n'
    + '  }'
  return script
}

// 注入unocss
export async function injectUNOCSS(useUno = false, iframeElm: HTMLIFrameElement) {
  if (useUno)
    await compilerUNOCSS(iframeElm)

  runHooks(fileStore.hooks, 'sandBoxMounted', iframeElm)
}
