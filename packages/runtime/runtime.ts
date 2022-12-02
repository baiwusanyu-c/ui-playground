import { runHooks, sendException } from '../utils'
import { transformVue } from './transform-vue'
import type { IDepsList } from '../store/deps'
import type { fileStore } from '../store/file'
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

export function injectUICSS(depsCss: Array<IDepsList>) {
  let script = 'const uiCSSList = ['
  depsCss.forEach((value) => {
    script = `${script} '${value.path}'\n`
  })
  script = `${script}]\n`

  script = `${script} uiCSSList.forEach(value => {\n`
    + '    const link = document.createElement(\'link\')\n'
    + '    link.rel = \'stylesheet\'\n'
    + '    link.href = value\n'
    + '    document.head.append(link)\n'
    + '  })\n'

  return script
}
