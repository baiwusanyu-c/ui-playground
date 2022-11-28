import { compileModulesForPreview } from '../compiler/compiler-module-vue'
import type { fileStore } from '../../store/file'

export function injectSSRServer(fileST: typeof fileStore, mainFile: string) {
  const ssrModules = compileModulesForPreview(fileST, true)
  return [
    'const __modules__ = {};',
    ...ssrModules,
    `import { renderToString as _renderToString } from '@vue/server-renderer'
         import { createSSRApp as _createApp } from '@vue/runtime-dom'
         const AppComponent = __modules__["${mainFile}"].default
         AppComponent.name = 'Repl'
         const app = _createApp(AppComponent)
         app.config.unwrapInjectedRef = true
         app.config.warnHandler = () => {}
         window.__ssr_promise__ = _renderToString(app).then(html => {
           document.body.innerHTML = '<div id="app">' + html + '</div>'
         }).catch(err => {
           console.error("SSR Error", err)
         })
        `,
  ]
}

export function injectClient(fileST: typeof fileStore, mainFile: string, isSSR: boolean) {
  // 将源码编译，得到编译后结果(这里会根据虚拟文件分割模块)
  const modules = compileModulesForPreview(fileST)

  // csr 的 vue 注入
  const codeToEval = [
    'window.__modules__ = {}\nwindow.__css__ = \'\'\n'
    + `if (window.__app__) window.__app__.unmount()\n${
    isSSR ? '' : 'document.body.innerHTML = \'<div id="app"></div>\''}`,
    ...modules,
    'document.getElementById(\'__sfc-styles\').innerHTML = window.__css__',
  ]

  // if main file is a vue file, mount it.
  if (mainFile.endsWith('.vue')) {
    codeToEval.push(
      `import { ${
        isSSR ? 'createSSRApp' : 'createApp'
      } as _createApp } from "@vue/runtime-dom"
        const _mount = () => {
          const AppComponent = __modules__["${mainFile}"].default
          AppComponent.name = 'Repl'
          const app = window.__app__ = _createApp(AppComponent)
          app.config.unwrapInjectedRef = true
          app.config.errorHandler = e => console.error(e)
          app.mount('#app')
        }
        if (window.__ssr_promise__) {
          window.__ssr_promise__.then(_mount)
        } else {
          _mount()
        }`,
    )
  }
  return codeToEval
}
