// TODO: 钩子设计
// TODO: module、compiler抽象
// TODO: 预览的报错
import {useMount, useSafeState, useUnmount} from "ahooks";
import {depsStore} from "../../store/deps";
// @ts-ignore
import srcdoc from './preview-sandbox.html?raw'
import {PreviewProxy} from "./PreviewProxy";
import {useEffect} from "react";
import {fileStore} from "../../store/file";
import evtBus from "../../utils/event-bus";
import {compileModulesForPreview} from "../../utils/compiler/moduleCompiler";
export default function Preview(props: IPreviewProps){
  let runtimeError = ''
  let runtimeWarning = ''

  let container: null | HTMLElement = null
  let sandbox: HTMLIFrameElement
  const [proxy, serProxy] = useSafeState<PreviewProxy | null>(null)
  function createSandBox(){
    container = document.getElementById('sandbox_container')
    if (sandbox) {
      // 重置和销毁
      // clear prev sandbox
      proxy && proxy.destroy()
      // UNCERTAIN:
      // stopUpdateWatcher && stopUpdateWatcher()
      container && container.removeChild(sandbox)
    }
    sandbox = document.createElement('iframe')
    sandbox.setAttribute(
      'sandbox',
      [
        'allow-forms',
        'allow-modals',
        'allow-pointer-lock',
        'allow-popups',
        'allow-same-origin',
        'allow-scripts',
        'allow-top-navigation-by-user-activation'
      ].join(' ')
    )

    //替换依赖图
    // 添加沙盒到容器下（srcdoc是srcdoc.html的字符串）
    sandbox.srcdoc = createDeps()
    container && container.appendChild(sandbox)

   // new 一个沙盒与上层应用的通信代理（基于post message）
    serProxy(createPreviewProxy())

    // 沙盒载入时
    sandbox.addEventListener('load', () => {
      // 触发 link 钩子，确保沙盒内 a 标签能够点击跳转(不设置 target属性都可以开tab)
      proxy && proxy.handle_links()
    })
  }

  // 开启预览监听
  // useEffect(()=>{
  //   updatePreview()
  // })
  // 接受来自 fileStore 交互的通知信息
  evtBus.on('fileMessage',updatePreview)

  function createDeps(){
    const importMap = {
      imports:{} as Record<string, string>
    }
    depsStore.deps.forEach(val=>{
      importMap.imports[val.name] = val.path
    })
    // 替换依赖图
    return srcdoc.replace(
      /<!--IMPORT_MAP-->/,
      JSON.stringify(importMap)
    )
  }

  function createPreviewProxy(){
    return new PreviewProxy(sandbox, {
      // 沙盒钩子 -- fetch 进度
      on_fetch_progress: (progress: any) => {
        // pending_imports = progress;
      },

      // 沙盒钩子 -- 错误捕获
      on_error: (event: any) => {
        const msg =
          event.value instanceof Error ? event.value.message : event.value
        if (
          msg.includes('Failed to resolve module specifier') ||
          msg.includes('Error resolving module specifier')
        ) {
          runtimeError =
            msg.replace(/\. Relative references must.*$/, '') +
            `.\nTip: edit the "Import Map" tab to specify import paths for dependencies.`
        } else {
          runtimeError = event.value
        }
      },

      // 沙盒钩子 -- 注入错误
      on_unhandled_rejection: (event: any) => {
        let error = event.value
        if (typeof error === 'string') {
          error = { message: error }
        }
        runtimeError = 'Uncaught (in promise): ' + error.message
      },

      // 沙盒钩子 -- 警告和错误输出
      on_console: (log: any) => {
        if (log.duplicate) {
          return
        }
        if (log.level === 'error') {
          if (log.args[0] instanceof Error) {
            runtimeError = log.args[0].message
          } else {
            runtimeError = log.args[0]
          }
        } else if (log.level === 'warn') {
          if (log.args[0].toString().includes('[Vue warn]')) {
            runtimeWarning = log.args
              .join('')
              .replace(/\[Vue warn\]:/, '')
              .trim()
          }
        }
      },

      // TODO：作用暂时位置
      on_console_group: (action: any) => {
        // group_logs(action.label, false);
      },

      // TODO：作用暂时位置
      on_console_group_end: () => {
        // ungroup_logs();
      },

      // TODO：作用暂时位置
      on_console_group_collapsed: (action: any) => {
        // group_logs(action.label, true);
      }
    })
  }

  async function updatePreview() {

    runtimeError = ''
    runtimeWarning = ''

    let isSSR = props.ssr
    console.log(depsStore)
    console.log(fileStore)
    try {
      const mainFile = fileStore.mainFile

      // if SSR, generate the SSR bundle and eval it to render the HTML
      // ssr 预览编译渲染
      if (isSSR && mainFile.endsWith('.vue')) {
        // 将源码编译，得到编译后结果
        const ssrModules = compileModulesForPreview(fileStore,true)
        console.log(
          `[@vue/repl] successfully compiled ${ssrModules.length} modules for SSR.`
        )
        // 注入vue的ssr代码
        proxy && await proxy.eval([
          `const __modules__ = {};`,
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
        `
        ])
      }

      // compile code to simulated module system
      // 将源码编译，得到编译后结果(这里会根据虚拟文件分割哥哥模块)
      const modules = compileModulesForPreview(fileStore)
      console.log(
        `[@vue/repl] successfully compiled ${modules.length} module${
          modules.length > 1 ? `s` : ``
        }.`
      )

      // csr 的 vue 注入
      const codeToEval = [
        `window.__modules__ = {}\nwindow.__css__ = ''\n` +
        `if (window.__app__) window.__app__.unmount()\n` +
        (isSSR ? `` : `document.body.innerHTML = '<div id="app"></div>'`),
        ...modules,
        `document.getElementById('__sfc-styles').innerHTML = window.__css__`
      ]

      // if main file is a vue file, mount it.
      if (mainFile.endsWith('.vue')) {
        codeToEval.push(
          `import { ${
            isSSR ? `createSSRApp` : `createApp`
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
        }`
        )
      }

      // eval code in sandbox
      proxy && await proxy.eval(codeToEval)
    } catch (e: any) {
      console.error(e)
      runtimeError = (e as Error).message
    }
  }

  // 监听依赖、版本、虚拟文件代码，重置沙盒

  // 创建沙盒
  useMount(createSandBox)
  useUnmount(()=>{
    proxy && proxy.destroy()
  })

  return <div className="iframe-container" id='sandbox_container'></div>
}

interface IPreviewProps {
  ssr?: boolean
}