import type { fileStore } from '../../store/file'

export async function injectSSRServer(fileST: typeof fileStore) {
  const ssrModules = await fileST.compileModule!(fileST, true)
  return await fileST.compileInject!(fileST, true, ssrModules)
}

export async function injectClient(fileST: typeof fileStore, isSSR: boolean) {
  // 将源码编译，得到编译后结果(这里会根据虚拟文件分割模块)
  const modules = await fileST.compileModule!(fileST)
  return await fileST.compileInject!(fileST, false, modules)
}
