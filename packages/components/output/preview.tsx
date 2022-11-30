// TODO: 监听依赖、版本、虚拟文件代码，重置沙盒
// TODO: react 代码优化

import {useMount, useUnmount} from "ahooks";
import {depsStore} from "../../store/deps";
// @ts-ignore
import srcdoc from './preview-sandbox.html?raw'
import {createPreviewProxy, PreviewProxy} from "./PreviewProxy";
import {fileStore} from "../../store/file";
import evtBus from "../../utils/event-bus";
import '../../asset/preview.scss'
import {createSandBox, isEmptyObj} from "../../utils";
import {injectClient, injectSandBoxMounted, injectSSRServer} from "../../utils/runtime/runtime";


export default function Preview(props: IPreviewProps){
  let runtimeError = ''
  let runtimeWarning = ''
  let container: null | HTMLElement = null
  let sandbox: HTMLIFrameElement
  let proxy: PreviewProxy | null = null

  function initPreview(){
    container = document.getElementById('sandbox_container')
    if (sandbox) {
      // 重置和销毁
      // clear prev sandbox
      proxy && proxy.destroy()
      // UNCERTAIN:
      // stopUpdateWatcher && stopUpdateWatcher()
      container && container.removeChild(sandbox)
    }

    sandbox = createSandBox()
    // 添加沙盒到容器下（srcdoc是srcdoc.html的字符串）
    sandbox.srcdoc = createDeps()
    container && container.appendChild(sandbox)

   // new 一个沙盒与上层应用的通信代理（基于post message）
    proxy = (createPreviewProxy(sandbox,runtimeError,runtimeWarning ))

    // 沙盒载入时
    sandbox.addEventListener('load', () => {
      // 触发 link 钩子，确保沙盒内 a 标签能够点击跳转(不设置 target属性都可以开tab)
      proxy && proxy.handleLinksClick()
      // output 切换 preview 渲染沙盒
      if(!isEmptyObj(fileStore.compiler)){
        updatePreview()
      }
    })

  }
  // 开启预览监听 接受来自 fileStore 交互的通知信息，更新preivew
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
  async function updatePreview() {
    runtimeError = ''
    runtimeWarning = ''
    let isSSR = props.ssr
    try {
      const mainFile = fileStore.mainFile
      // if SSR, generate the SSR bundle and eval it to render the HTML
      // ssr 预览编译渲染
      if (isSSR && mainFile.endsWith('.vue')) {
        const injectSSRServerRes = await injectSSRServer(fileStore,isSSR!)
        // 注入vue的ssr代码
        proxy && await proxy.eval(injectSSRServerRes)
      }
      // eval code in sandbox
      let injectClientRes = await injectClient(fileStore)
      await injectSandBoxMounted(injectClientRes)
      proxy && await proxy.eval(injectClientRes)

    } catch (e: any) {
      console.error(e)
      runtimeError = (e as Error).message
    }
  }


  // 创建沙盒
  useMount(initPreview)
  useUnmount(()=>{
    proxy && proxy.destroy()
  })

  return <div className="iframe-container" id='sandbox_container'></div>
}

interface IPreviewProps {
  ssr?: boolean
}
