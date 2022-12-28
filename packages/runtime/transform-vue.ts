import type { fileStore } from '../store/file'

export const transformVue = (fileST: typeof fileStore, isSSR: boolean, isClient: boolean, modules: string[]) => {
  //  modules.forEach((value, index) => {
  //    value = value.replace('from \'vue\'', 'from \'@vue/runtime-dom\'')
  //    value = value.replace('from "vue"', 'from \'@vue/runtime-dom\'')
  //    if (isSSR) {
  //      value = value.replace('from \'vue/server-renderer\'', 'from \'@vue/server-renderer\'')
  //      value = value.replace('from "vue/server-renderer"', 'from \'@vue/server-renderer\'')
  //    }
  //    modules[index] = value
  //  })
  console.log(fileST, isSSR, modules)
}
