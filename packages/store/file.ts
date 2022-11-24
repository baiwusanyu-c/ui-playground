// TIP： 展示编译内容只根据当前激活虚拟文件
import evtBus from "../utils/event-bus";
import {transformTS} from "../utils/compiler";
import {IDepsList} from "./deps";
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

export interface StoreState {
  mainFile: string // 虚拟入口主文件，CodeMirror 将从它为入口开始运行
  files: Record<string, File> // 虚拟文件集合对象
  activeFile: File // 当前选择的文件
  errors: (string | Error)[] // 错误信息
  vueRuntimeURL: string // vue 的运行时地址
  vueServerRendererURL: string // vue 的 ssr 渲染器地址
  // used to force reset the sandbox
  resetFlip: boolean // 是否重置预览沙盒
  init: Function
}

// sfc 选项
export interface SFCOptions {
  // script?: Omit<SFCScriptCompileOptions, 'id'>
  // style?: SFCAsyncStyleCompileOptions
  // template?: SFCTemplateCompileOptions
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
  compilerFn: null as Function | null,
  compiler: {} as Record<string, any>,
  pendingCompiler: null as Promise<any> | null,
  errors: [] as (string | Error)[],// 错误信息
  async init(file: File, compilerFn: Function) {
    this.mainFile = file.filename
    this.activeFile.filename = file.filename
    this.activeFile.code = file.code
    this.files[file.filename] = { ...this.activeFile }
    this.compilerFn = compilerFn
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

  async loadCompiler(importMap: Array<IDepsList>){
    for (let i = 0; i < importMap.length; i++) {
      if(importMap[i].type === 'lib'){
        this.pendingCompiler = import(/* @vite-ignore */ importMap[i].path) //编译器
        this.compiler[importMap[i].name] = await this.pendingCompiler //编译器
        this.pendingCompiler = null
      }
    }
  },

  async compileFile(file: File){
    // css 不需要编译了
    if(file.filename.endsWith('.css')){
      file.compiled.css = file.code
    }
    // js 不需要编译了
    if(file.filename.endsWith('.js')){
      file.compiled.js = file.code
    }

    // ts 使用 sucrase 编译
    if(file.filename.endsWith('.ts')){
      file.compiled.js = await transformTS(file.code)
    }
    if(this.compilerFn){
      // 同时把从配置中 importMap 的 lib 类型的依赖传递出去，
      file = this.compilerFn(this, file, this.compiler)
    }
    // 其他文件类型调用用户的编译钩子完成
    /*if(file.filename.endsWith('.jsx')){
      // file.compiled.js = file.code
    }


    if(file.filename.endsWith('.tsx')){
      // file.compiled.js = file.code
    }

    if(file.filename.endsWith('.vue')){
      // file.compiled.js = file.code
    }*/
    // 调用用户的编译钩子

    // 更新 active 到 file
    this.updatedFilesByActive()
    // 通知 output 更新
    evtBus.emit('fileMessage')
  }
}
