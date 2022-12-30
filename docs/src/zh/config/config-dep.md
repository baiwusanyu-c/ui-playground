# 入口文件及初始依赖

## presetType

- Type: `unknown` | `vue`
- Default: `unknown`

指定 `playground` 所使用的预设类型，只支持 `vue`

:::tip
你不需要直接指定这个配置属性，通常通过使用 `getPlayPreset`方法 来获取预设值
:::

```js
import { getPlayPreset } from 'ui-playground'

export const demoConfig = () => {
  const config = getPlayPreset('vue')
  // config 将作为组件的props传递 <PlayGround config={demoConfig()} />
  return config
}
```

## mainFile

- Type: `IMainFile`
- Default: `{filename:'App.vue', code:''}`

给`playground` 指定一个入口文件。

:::tip
你可以利用 `vite` 特性，直接读取一个源码文件内容。
:::

```typescript
declare interface IMainFile {
  filename: string // 文件名，支持 .css、.vue、 .js、 .jsx、 ts、 tsx
  code: string // 入口文件代码字符串
}
```

```js
import { getPlayPreset } from 'ui-playground'
import demoMain from './demo-main.vue?raw'
export const demoConfig = () => {
  const config = getPlayPreset('vue')
  config.mainFile = {
    filename: 'App.vue',
    code: demoMain,
  }
  // config 将作为组件的props传递 <PlayGround config={demoConfig()} />
  return config
}
```

## importMap

- Type: `Array<importItem>`
- Default: `[]`

指定 `playground` 所需要的依赖，其中包括框架依赖（比如 `vue`）、组件库依赖、和其他必要的依赖项

```typescript
declare interface importItem {
  // 名称，他是依赖源码中所使用的名称，
  // 比如 ep 的 css 在其源码中使用 `@element-plus/css`
  name: string
  // 依赖包名称，它是依赖发包名称，
  // 比如 ep 的 css 在其源码中使用 `@element-plus/css`，但在包 `element-plus` 中
  pkgName: string
  // 依赖包入口文件路径，当 type 为 other 时无效
  indexPath: string
  // 包的类型，分为框架类型(vue-> lib), 
  // 组件库类型（ep-> ui）, css 类型（`@element-plus/css`-> css） 和其他类型 other
  type: 'lib' | 'ui' | 'other' | 'css'
  // 'other' 类型时，对应依赖包位于cdn中的脚本路径
  cdnLink?: string 
}
```

```js
import { getPlayPreset } from 'ui-playground'

export const demoConfig = () => {
  const config = getPlayPreset('vue')
  config.importMap.push({
    // 添加 element-plus
    name: 'element-plus',
    pkgName: 'element-plus',
    indexPath: '/dist/index.full.min.mjs',
    type: 'ui',
  },
  {
    // 添加 element-plus 的图标组件
    name: '@element-plus/icons-vue',
    pkgName: '@element-plus/icons-vue',
    indexPath: '/dist/index.min.js',
    cdnLink: `${jsdelivrLink}/@element-plus/icons-vue@2/dist/index.min.js`,
    type: 'other',
  },
  {
    // 添加 element-plus 的 css 样式
    name: '@element-plus/css',
    pkgName: 'element-plus',
    indexPath: '/dist/index.css',
    type: 'css',
  },
  {
    name: 'resize-observer-polyfill',
    pkgName: 'resize-observer-polyfill',
    indexPath: '',
    cdnLink: 'https://cdn.skypack.dev/resize-observer-polyfill',
    type: 'other',
  })
  // config 将作为组件的props传递 <PlayGround config={demoConfig()} />
  return config
}
```