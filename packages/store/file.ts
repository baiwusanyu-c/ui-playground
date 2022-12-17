// TIP： 展示编译内容只根据当前激活虚拟文件
import evtBus from '../utils/event-bus'
import { compileTS } from '../compiler/compile-ts'
import { runHooks, sendException, wrapperCustomCompiler } from '../utils'
import type { IHooks, TCompileInject, TCompileModule, TCompileOutput, presetTypes } from '../play.config'
import type { IDepsList } from './deps'
export interface File {
  filename: string // 文件名
  code: string // 源码
  hidden: boolean
  compiled: {
    js: string // js 编译结果
    css: string // css 编译结果
    ssr: string // ssr 编译结果
  }
}

export const fileStore = {
  activeFile: {
    filename: '',
    code: '',
    hidden: false,
    compiled: {
      js: '',
      css: '',
      ssr: '',
    },
  } as File,
  mainFile: '',
  files: {} as Record<string, File>, // 虚拟文件集合对象
  compileOutput: null as Function | null,
  compileModule: null as Function | null,
  compileInject: null as Function | null,
  compiler: {} as Record<string, any>,
  pendingCompiler: null as Promise<any> | null,
  errors: [] as (string | Error)[], // 错误信息
  hooks: {} as IHooks,
  presetType: 'unknown' as presetTypes,
  isProdCompile: false,
  isSSRCompile: false,
  async init(
    file: File,
    compileOutput: TCompileOutput,
    compileModule: TCompileInject,
    compileInject: TCompileModule,
    hooks: IHooks,
    presetType: presetTypes,
  ) {
    this.mainFile = file.filename
    this.activeFile.filename = file.filename
    this.activeFile.code = file.code
    this.files[file.filename] = { ...this.activeFile }
    this.compileOutput = wrapperCustomCompiler(compileOutput)
    this.compileModule = wrapperCustomCompiler(compileModule)
    this.compileInject = wrapperCustomCompiler(compileInject)
    this.hooks = hooks
    this.presetType = presetType
  },

  setFiles(files: Record<string, File>) {
    this.files = files
  },

  add(file: File) {
    this.activeFile = file
    this.files[file.filename] = { ...this.activeFile }
  },

  remove(filename: string) {
    Reflect.deleteProperty(this.files, filename)
  },

  setActiveFileByName(filename: string) {
    this.activeFile = this.files[filename]
  },

  updatedFilesByActive() {
    this.files[this.activeFile.filename] = { ...this.activeFile }
  },

  async loadCompiler(importMap: Array<IDepsList>) {
    this.compiler = {}
    for (let i = 0; i < importMap.length; i++) {
      if (importMap[i].type === 'lib') {
        this.pendingCompiler = import(/* @vite-ignore */ importMap[i].path) // 编译器
        this.compiler[importMap[i].pkgName] = await this.pendingCompiler // 编译器
        this.pendingCompiler = null
      }
    }
  },

  async compileFile(file: File, isUpdateDeps: boolean) {
    // css 不需要编译了
    if (file.filename.endsWith('.css'))
      file.compiled.css = file.code

    // js 不需要编译了
    if (file.filename.endsWith('.js'))
      file.compiled.js = file.code

    // ts 使用 sucrase 编译
    if (file.filename.endsWith('.ts'))
      file.compiled.js = await compileTS(file.code)

    if (this.compileOutput) {
      try {
        runHooks(
          this.hooks,
          'beforeCompileOutput',
          this,
          file,
          this.compiler,
        )
        // 同时把从配置中 importMap 的 lib 类型的依赖传递出去，
        await this.compileOutput(this, this.isSSRCompile, this.isProdCompile, file, this.compiler)

        runHooks(
          this.hooks,
          'compiledOutput',
          this,
          file,
          this.compiler,
        )
      } catch (e) {
        sendException((e as Error).message, 'error')
      }
    }
    // TODO: 其他文件类型调用用户的编译钩子完成
    /* if(file.filename.endsWith('.jsx')){
      // file.compiled.js = file.code
    }

    if(file.filename.endsWith('.tsx')){
      // file.compiled.js = file.code
    } */

    // 更新 active 到 file
    this.updatedFilesByActive()
    if (isUpdateDeps) {
      evtBus.emit('fileMessage', 'update_deps')
    } else {
      // 通知 output 更新
      evtBus.emit('fileMessage', 'update_file')
    }
  },
}
