// TODO: 监听依赖、重置沙盒
// TODO: dark ui 主题
import {useMount, useUnmount} from "ahooks";
// @ts-ignore
import srcdoc from './preview-sandbox.html?raw'
import {createPreviewProxy, createSandBoxImportMap, PreviewProxy} from "./PreviewProxy";
import {fileStore} from "../../store/file";
import evtBus from "../../utils/event-bus";
import '../../asset/preview.scss'
import {createSandBox, isEmptyObj, sendException} from "../../utils";
import {injectClient, injectSandBoxMounted, injectSSRServer} from "../../utils/runtime/runtime";


export default function Preview(props: IPreviewProps){
  let container: null | HTMLElement = null
  let sandbox: HTMLIFrameElement
  let proxy: PreviewProxy | null = null

  function initPreview(){
    try {
      container = document.getElementById('sandbox_container')
      if (sandbox) {
        // 重置和销毁
        // clear prev sandbox
        proxy && proxy.destroy()
        // UNCERTAIN:
        // stopUpdateWatcher && stopUpdateWatcher()
        container && container.removeChild(document.getElementById('play_sandbox_frame')!)
      }

      sandbox = createSandBox()
      // 添加沙盒到容器下（srcdoc是srcdoc.html的字符串）
      sandbox.srcdoc = createDeps(srcdoc)
      container && container.appendChild(sandbox)

      // new 一个沙盒与上层应用的通信代理（基于post message）
      proxy = createPreviewProxy(sandbox)

      // 沙盒载入时
      sandbox.addEventListener('load', () => {
        // 触发 link 钩子，确保沙盒内 a 标签能够点击跳转(不设置 target属性都可以开tab)
        proxy && proxy.handleLinksClick()
        // 依赖版本切换 =》更新渲染沙盒
        if (!isEmptyObj(fileStore.compiler)) {
          updatePreview()
        }
      })
    } catch (e) {
      console.error(e)
      sendException((e as Error).message,'error')
    }
  }
  // 开启预览监听 接受来自 fileStore 交互的通知信息，更新 preview
  evtBus.on('fileMessage', (type: string) =>{
    if(type === 'update_file'){
      updatePreview()
    }else{
      initPreview()
    }
  })


  function createDeps(srcdocContent: string){
    // 替换依赖图
    return srcdocContent.replace(
      /<!--IMPORT_MAP-->/,
      JSON.stringify(createSandBoxImportMap())
    )
  }
  async function updatePreview() {
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
      evtBus.emit('showLoading',false)
    } catch (e) {
      console.error(e)
      sendException((e as Error).message,'error')
    }
  }

  // 创建沙盒
  useMount(initPreview)
  useUnmount(()=>{
    proxy && proxy.destroy()
  })

  return <>
          <div className="iframe-container"
               id='sandbox_container'
               style={{display: !props.show ? 'none': 'initial'}}></div>
          </>
}

interface IPreviewProps {
  ssr?: boolean
  show?: boolean
}
