// TIP： 展示编译内容只根据当前激活虚拟文件
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
  init(file: File) {
    this.mainFile = file.filename
    this.activeFile.filename = file.filename
    this.activeFile.code = file.code
    this.files[file.filename] = { ...this.activeFile }
  },

  add(file: File) {
    this.activeFile = file
    this.files[file.filename] = { ...this.activeFile }
  },

  remove(key: string) {
    Reflect.deleteProperty(this.files, key)
  },

  setActiveFileByKey(key: string) {
    this.activeFile = this.files[key]
  },

  updatedFilesByActive() {
    this.files[this.activeFile.filename] = { ...this.activeFile }
  },
}
