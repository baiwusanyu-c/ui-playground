# 编译函数

## compileOutput
编译输出函数，该函数用于将 `playground` 的 `file` 使用框架的编译模块进行编译  
例如将 `main.vue` 编译成可执行的 `js` 代码并存储到内存中，目前内置的预设对 `vue` 进行了支持，  
如果你像实现自己的框架编译结果输出，用法可以参考内置的预设关于 `vue` 的实现。  
// TODO：相关链接跳转
```typescript
export declare type TCompileOutput = (
  fileST: typeof fileStore, // fileStore 对象，包含当前激活文件、文件集合对象等信息
  isSSR: boolean, // 是否为 ssr
  isProd: boolean, // 是否为生产模式
  file: File, // 文件集合对象
  compiler: Record<string, any> // 编译器对象，例如 ‘@vue/compiler-sfc’
) => void
```
```javascript
compileOutput: async(
    fileST,
    isSSR,
    isProd,
    file,
    compiler) => {
    await compileVue(fileST, file, isSSR, isProd, compiler, {})
  }
```

## compileModule
编译模块函数，该函数用于将 `playground` 的 `file` 的编译结果、使用的依赖包转化为一个数组。  
这个数组将在 `iframe` 中被用于实现相关依赖模块的加载。  
用法可以参考内置的预设关于 `vue` 的实现。
// TODO：相关链接跳转
```typescript
export declare type TCompileModule = (
  fileST: typeof fileStore, // fileStore 对象，包含当前激活文件、文件集合对象等信息
  isSSR: boolean, // 是否为 ssr
  isClient: boolean, // 是否为 客户端注入
) => Array<string>
```
```javascript
 compileModule: (
    fileST,
    isSSR,
    isClient
) => {
    return compileModulesForPreview(fileST, isSSR)
}
```

## compileInject
编译注入函数，该函数用于将 `playground` 的 `file` 的编译结果注入到 `iframe` 中。  
其主要作用是根据入口文件 mainFile 来创建并向 iframe 注入一个入口文件，目前内置的预设对 vue 进行了支持。   
用法可以参考内置的预设关于 vue 的实现。  
// TODO：相关链接跳转
```typescript
export declare type TCompileInject = (
  fileST: typeof fileStore, // fileStore 对象，包含当前激活文件、文件集合对象等信息
  isSSR: boolean, // 是否为 ssr
  isClient: boolean, // 是否为 客户端注入
  modules: Array<string> // 模块集合
) => Array<string>
```
```javascript
 compileInject: (
    fileST,
    isSSR,
    isClient,
    modules) => {
    return compilerInjectVue(fileST, isSSR, isClient, modules)
}
```