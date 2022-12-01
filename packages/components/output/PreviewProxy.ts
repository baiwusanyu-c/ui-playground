// ReplProxy and srcdoc implementation from Svelte REPL
// MIT License https://github.com/sveltejs/svelte-repl/blob/master/LICENSE

import {fileStore} from "../../store/file";
import {runHooks, sendException} from "../../utils";
import {depsStore} from "../../store/deps";
import evtBus from "../../utils/event-bus";

let uid = 1
// 与 iframe 沙盒通信的代理对象
export class PreviewProxy {
  iframe: HTMLIFrameElement
  handlers: Record<string, Function>
  pendingCmds: Map<number,
    { resolve: (value: unknown) => void;
      reject: (reason?: any) => void
    }>
  handleEvent: ((e: any) => void) | undefined

  constructor(iframe: HTMLIFrameElement, handlers: Record<string, Function>) {
    // 沙盒 iframe
    this.iframe = iframe
    // handler 沙盒钩子对象
    this.handlers = handlers
    this.pendingCmds = new Map()
    this.setMsgEvt()
  }
  setMsgEvt(){
    // 建立 message 监听，接收 iframe 发送过来的消息
    this.handleEvent = (e) => this.handleReplMessage(e)
    window.addEventListener('message', this.handleEvent, false)
  }
  destroy() {
    // 销毁 message 监听
    window.removeEventListener('message', this.handleEvent!)
  }

  // 向沙盒 iframe 发送消息
  sendCommandToIFrame(action: string, args: any) {
    return new Promise((resolve, reject) => {
      const cmdId = uid++
      this.pendingCmds.set(cmdId, { resolve, reject })
      this.iframe.contentWindow &&
      this.iframe.contentWindow!.postMessage({ action, cmdId, args }, '*')
    })
  }

  // 处理沙盒发送过来的钩子通信
  // 这里通常做发送给沙盒，沙盒处理指令后回复消息
  handleCommandFromIFrame(cmdData: any) {
    let action = cmdData.action
    let id = cmdData.cmdId
    let handler = this.pendingCmds.get(id)
    if (handler) {
      this.pendingCmds.delete(id)
      if (action === 'cmdError') {
        let { message, stack } = cmdData
        let e = new Error(message)
        e.stack = stack
        handler.reject(e)
        sendException(message,'error')
      }

      if (action === 'cmdOk') {
        handler.resolve(cmdData.args)
      }
    } else if (action !== 'cmdError' && action !== 'cmdOk') {
      console.error('command not found', id, cmdData, [
        ...this.pendingCmds.keys()
      ])
      sendException('command not found','error')
    }
  }

  // 处理沙盒发送过来的钩子通信，触发相关 handler 钩子
  // 这里是 iframe 向上层发送消息
  handleReplMessage(event: any) {
    if (event.source !== this.iframe.contentWindow) return
    const { action, args } = event.data
    switch (action) {
      case 'cmdError':
      case 'cmdOk':
        return this.handleCommandFromIFrame(event.data)
      case 'error':
        return this.handlers.onError(event.data)
      case 'unhandledrejection':
        return this.handlers.onUnhandledRejection(event.data)
      case 'console':
        return this.handlers.onConsole(event.data)
      case 'iframeMounted':
        runHooks(fileStore.hooks,'sandBoxMounted')
        return
    }
  }

  eval(script: string | string[]) {
    return this.sendCommandToIFrame('eval', { script })
  }

  handleLinksClick() {
    return this.sendCommandToIFrame('catchClicks', {})
  }
}

export function createPreviewProxy(
  sandbox: HTMLIFrameElement){
  return new PreviewProxy(sandbox, {
    // 沙盒钩子 -- 错误捕获
    onError: (event: any) => {
      const msg =
        event.value instanceof Error ? event.value.message : event.value
      if (
        msg.includes('Failed to resolve module specifier') ||
        msg.includes('Error resolving module specifier')
      ) {
        let error =
          msg.replace(/\. Relative references must.*$/, '') +
          `.\nTip: edit the "Import Map" tab to specify import paths for dependencies.`
        sendException(error,'error')
      } else {
        sendException(event.value,'error')
      }
    },

    // 沙盒钩子 -- 注入错误
    onUnhandledRejection: (event: any) => {
      let error = event.value
      if (typeof error === 'string') {
        error = { message: error }
      }
      sendException('Uncaught (in promise): ' + error.message,'error')
    },

    // 沙盒钩子 -- 警告和错误输出
    onConsole: (log: any) => {
      if (log.duplicate) {
        return
      }
      if (log.level === 'error') {
        if (log.args[0] instanceof Error) {
          sendException(log.args[0].message,'error')
        } else {
          sendException(log.args[0],'error')
        }
      } else if (log.level === 'warn') {
        sendException(log.args,'warning')
      }
    }
  })
}

export function createSandBoxImportMap(){
  const importMap = {
    imports:{} as Record<string, string>
  }
  depsStore.deps.forEach(val=>{
    importMap.imports[val.name] = val.path
  })
  return importMap
}
