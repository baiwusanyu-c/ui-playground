import type { importItem } from '../utils/config'
import {unpkgLink} from '../utils/config'
import {fileStore} from "./file";
export declare interface IDepsList {
  name: string
  path: string
  type: 'lib' | 'ui' | 'other'
}
export const depsStore = {
  importMap: [] as Array<importItem>,
  deps: [] as Array<IDepsList>,
  init(config: Array<importItem>) {
    this.importMap = config
  },

  // 根据 CDN 和当前版本设置依赖
  // 只会触发 lib 类型和 ui 类型,最终作依赖在 depStore 中 deps
  // 只对 unpkg 和 jsdelivr 类型能够自动设置，其他 CDN 需要用户实现
  async setDepsByCDN(
    cdnLink: string,
    cdnType: string,
    uiVersion: string,
    libVersion: string,
    cdnSet?: Function,
  ) {
    this.deps = []
    this.importMap.forEach((value: importItem) => {
      const depsItem = {
        path: value.cdnLink!,
        name: value.pkgName,
        type: value.type,
      }
      if (value.type === 'lib' || value.type === 'ui') {
        if (cdnType === 'unpkg' || cdnType === 'jsdelivr') {
          depsItem.path = formatCDNLink(
            cdnLink,
            value.pkgName,
            value.type === 'ui' ? uiVersion : libVersion,
            value.indexPath)
        }
        else {
          if (typeof cdnSet === 'function') {
            depsItem.path = cdnSet(
              cdnLink,
              value.pkgName,
              value.type === 'ui' ? uiVersion : libVersion,
              value.indexPath,
            )
          }
          else {
            depsItem.path = formatCDNLink(
              unpkgLink,
              value.pkgName,
              value.type === 'ui' ? uiVersion : libVersion,
              value.indexPath)
          }
        }
      }

      this.deps.push(depsItem)
    })
    // 载入依赖
    await fileStore.loadCompiler(this.deps)
    // 载入重新编译
    fileStore.compileFile(fileStore.activeFile)
  },
}

function formatCDNLink(
  link: string,
  pkgName: string,
  version: string,
  indexPath: string) {
  return `${link}${pkgName}@${version}${indexPath}`
}
