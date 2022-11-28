// ReplProxy and srcdoc implementation from Svelte REPL
// MIT License https://github.com/sveltejs/svelte-repl/blob/master/LICENSE

let uid = 1
// 与 iframe 沙盒通信的代理对象
export class PreviewProxy {
  iframe: HTMLIFrameElement
  handlers: Record<string, Function>
  pending_cmds: Map<
    number,
    { resolve: (value: unknown) => void; reject: (reason?: any) => void }
  >
  handle_event: (e: any) => void

  constructor(iframe: HTMLIFrameElement, handlers: Record<string, Function>) {
    // 沙盒 iframe
    this.iframe = iframe
    // handler 沙盒钩子对象
    this.handlers = handlers

    this.pending_cmds = new Map()

    this.handle_event = (e) => this.handle_repl_message(e)
    // 建立 message 监听，接收 iframe 发送过来的消息
    window.addEventListener('message', this.handle_event, false)
  }

  destroy() {
    // 销毁 message 监听
    window.removeEventListener('message', this.handle_event)
  }

  // 向沙盒 iframe 发送消息
  iframe_command(action: string, args: any) {
    return new Promise((resolve, reject) => {
      const cmd_id = uid++

      this.pending_cmds.set(cmd_id, { resolve, reject })

      this.iframe.contentWindow!.postMessage({ action, cmd_id, args }, '*')
    })
  }

  // 处理沙盒发送过来的钩子通信
  // 这里通常做发送给沙盒，沙盒处理指令后回复消息
  handle_command_message(cmd_data: any) {
    let action = cmd_data.action
    let id = cmd_data.cmd_id
    let handler = this.pending_cmds.get(id)

    if (handler) {
      this.pending_cmds.delete(id)
      if (action === 'cmd_error') {
        let { message, stack } = cmd_data
        let e = new Error(message)
        e.stack = stack
        handler.reject(e)
      }

      if (action === 'cmd_ok') {
        handler.resolve(cmd_data.args)
      }
    } else if (action !== 'cmd_error' && action !== 'cmd_ok') {
      console.error('command not found', id, cmd_data, [
        ...this.pending_cmds.keys()
      ])
    }
  }

  // 处理沙盒发送过来的钩子通信，触发相关 handler 钩子
  // 这里是 iframe 向上层发送消息
  handle_repl_message(event: any) {
    if (event.source !== this.iframe.contentWindow) return

    const { action, args } = event.data

    switch (action) {
      case 'cmd_error':
      case 'cmd_ok':
        return this.handle_command_message(event.data)
      case 'fetch_progress':
        return this.handlers.on_fetch_progress(args.remaining)
      case 'error':
        return this.handlers.on_error(event.data)
      case 'unhandledrejection':
        return this.handlers.on_unhandled_rejection(event.data)
      case 'console':
        return this.handlers.on_console(event.data)
      case 'console_group':
        return this.handlers.on_console_group(event.data)
      case 'console_group_collapsed':
        return this.handlers.on_console_group_collapsed(event.data)
      case 'console_group_end':
        return this.handlers.on_console_group_end(event.data)
    }
  }

  eval(script: string | string[]) {
    return this.iframe_command('eval', { script })
  }

  handle_links() {
    return this.iframe_command('catch_clicks', {})
  }
}

export function createPreviewProxy(
  sandbox: HTMLIFrameElement,
  runtimeError: string,
  runtimeWarning: string){
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
