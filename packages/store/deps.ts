import type { importItem } from '../utils/config'

export const depsStore = {
  importMap: [] as Array<importItem>,
  deps: [] as Array<importItem>,
  init(config: Array<importItem>) {
    this.importMap = config
  },

  // 根据 CDN 和当前版本设置依赖
  // 只会触发 lib 类型和 ui 类型,最终作依赖在 depStore 中 deps
  // 只对 unpkg 和 jsdelivr 类型能够自动设置，其他 CDN 需要用户实现
  setDepsByCDN(cdnType: string, uiVersion: string, libVersion: string) {
    debugger
  },
}
