import { runHooks } from '../index'
import type { fileStore } from '../../store/file'

export async function injectSSRServer(fileST: typeof fileStore, isSSR: boolean) {
  runHooks(
    fileST.hooks,
    'beforeCompileModule',
    fileST,
    isSSR,
  )
  const ssrModules = await fileST.compileModule!(fileST, isSSR)
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
}

export async function injectClient(fileST: typeof fileStore, isSSR: boolean) {
  runHooks(
    fileST.hooks,
    'beforeCompileModule',
    fileST,
    isSSR,
  )
  // 将源码编译，得到编译后结果(这里会根据虚拟文件分割模块)
  const modules = await fileST.compileModule!(fileST, isSSR)
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
}

export async function injectSandBoxMounted(injectScriptList: Array<string>) {
  injectScriptList.push('parent.postMessage({ action: \'iframeMounted\'}, \'*\');')
}
