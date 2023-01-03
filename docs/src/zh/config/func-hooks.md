# 钩子函数

## beforeCompileOutput
执行编译函数 `compileOutput` 前的钩子函数
```typescript
declare interface IHooks {
  beforeCompileOutput?: (
    fileST: typeof fileStore, // fileStore 对象，包含当前激活文件、文件集合对象等信息
    file: File, // 文件集合对象
    compiler: Record<string, any> // 编译器对象，例如 ‘@vue/compiler-sfc’
  ) => void
}
```
```js
import { getPlayPreset } from 'ui-playground'

export const demoConfig = () => {
  const config = getPlayPreset('vue')
  config.hooks.beforeCompileOutput = (fileST, file, compiler) => {
    console.log(fileST, file, compiler)
  }
  // config 将作为组件的props传递 <PlayGround config={demoConfig()} />
  return config
}
```

## compiledOutput
执行编译函数 `compileOutput` 后的钩子函数
```typescript
declare interface IHooks {
  compiledOutput?: (
    fileST: typeof fileStore, // fileStore 对象，包含当前激活文件、文件集合对象等信息
    file: File, // 文件集合对象
    compiler: Record<string, any> // 编译器对象，例如 ‘@vue/compiler-sfc’
  ) => void
}
```
```js
import { getPlayPreset } from 'ui-playground'

export const demoConfig = () => {
  const config = getPlayPreset('vue')
  config.hooks.compiledOutput = (fileST, file, compiler) => {
    console.log(fileST, file, compiler)
  }
  // config 将作为组件的props传递 <PlayGround config={demoConfig()} />
  return config
}
```

## beforeCompileModule
执行编译模块函数 `compileModule` 前的钩子函数
```typescript
declare interface IHooks {
  beforeCompileModule?: (
    fileST: typeof fileStore, // fileStore 对象，包含当前激活文件、文件集合对象等信息
    isSSR: boolean // 是否为 ssr
  ) => void
}
```
```js
import { getPlayPreset } from 'ui-playground'

export const demoConfig = () => {
  const config = getPlayPreset('vue')
  config.hooks.beforeCompileModule = (fileST, isSSR) => {
    console.log(fileST, isSSR)
  }
  // config 将作为组件的props传递 <PlayGround config={demoConfig()} />
  return config
}
```

## compiledModule
执行编译模块函数 `compileModule` 后的钩子函数
```typescript
declare interface IHooks {
  compiledModule?: (
    fileST: typeof fileStore,// fileStore 对象，包含当前激活文件、文件集合对象等信息
    isSSR: boolean , // 是否为 ssr
    modules: Array<string> // 模块集合
  ) => void
}
```
```js
import { getPlayPreset } from 'ui-playground'

export const demoConfig = () => {
  const config = getPlayPreset('vue')
  config.hooks.compiledModule = (fileST, isSSR, modules) => {
    console.log(fileST, isSSR, modules)
  }
  // config 将作为组件的props传递 <PlayGround config={demoConfig()} />
  return config
}
```

## beforeCreateInject
执行编译注入函数 `compileInject` 前的钩子函数
```typescript
declare interface IHooks {
  beforeCreateInject?: (
    fileST: typeof fileStore,// fileStore 对象，包含当前激活文件、文件集合对象等信息
    isSSR: boolean , // 是否为 ssr
    modules: Array<string> // 模块集合
  ) => void
}
```
```js
import { getPlayPreset } from 'ui-playground'

export const demoConfig = () => {
  const config = getPlayPreset('vue')
  config.hooks.beforeCreateInject = (fileST, isSSR, modules) => {
    console.log(fileST, isSSR, modules)
  }
  // config 将作为组件的props传递 <PlayGround config={demoConfig()} />
  return config
}
```

## createdInject
执行编译注入函数 `compileInject` 后的钩子函数
```typescript
declare interface IHooks {
  createdInject?: (
    fileST: typeof fileStore,// fileStore 对象，包含当前激活文件、文件集合对象等信息
    isSSR: boolean , // 是否为 ssr
    injectRes:  Array<string> | string // 注入的入口文件代码结果
  ) => void
}
```
```js
import { getPlayPreset } from 'ui-playground'

export const demoConfig = () => {
  const config = getPlayPreset('vue')
  config.hooks.createdInject = (fileST, isSSR, injectRes) => {
    console.log(fileST, isSSR, injectRes)
  }
  // config 将作为组件的props传递 <PlayGround config={demoConfig()} />
  return config
}
```

## sandBoxMounted
`iframe` 沙盒挂载后执行的钩子函数
```typescript
declare interface IHooks {
  sandBoxMounted?: (
    iframeElm: HTMLIFrameElement // iframe 沙盒的 dom
  ) => void
}
```
```js
import { getPlayPreset } from 'ui-playground'

export const demoConfig = () => {
  const config = getPlayPreset('vue')
  config.hooks.sandBoxMounted = (iframeElm) => {
    console.log(iframeElm)
  }
  // config 将作为组件的props传递 <PlayGround config={demoConfig()} />
  return config
}
```

## eval
自定义脚本注入钩子，它将在 `sandBoxMounted` 之后被调用。
```typescript
declare interface IHooks {
  eval?: (
    // 注入到 iframe 沙盒的回调方法
    evalFn: ((script:string | string[]) => Promise<unknown>) | null
  ) => void
}
```
```js
import { getPlayPreset } from 'ui-playground'

export const demoConfig = () => {
  const config = getPlayPreset('vue')
  config.hooks.eval = async(evalFn) => {
    evalFn && await (evalFn)('console.log("inject script running")')
  }
  // config 将作为组件的props传递 <PlayGround config={demoConfig()} />
  return config
}
```