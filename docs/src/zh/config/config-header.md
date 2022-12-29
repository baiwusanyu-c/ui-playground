# Header 配置项

## title

- Type: `string`
- Default: `'UI'`

playground 的主标题

```js
import { getPlayPreset } from 'ui-playground'

export const demoConfig = () => {
  const config = getPlayPreset('vue')
  config.headerOption.title = 'demo title'
  // config 将作为组件的props传递 <PlayGround config={demoConfig()} />
  return config
}
```

## subTitle

- Type: `string`
- Default: `'playground'`

playground 的副标题

```js
import { getPlayPreset } from 'ui-playground'

export const demoConfig = () => {
  const config = getPlayPreset('vue')
  config.headerOption.subTitle = 'demo sub title'
  // config 将作为组件的props传递 <PlayGround config={demoConfig()} />
  return config
}
```

## logo

- Type: `string`
- Default: `-`

playground 的logo地址

```js
import { getPlayPreset } from 'ui-playground'

export const demoConfig = () => {
  const config = getPlayPreset('vue')
  config.headerOption.logo = 'https://avatars.githubusercontent.com/u/6128107?s=200&v=4'
  // config 将作为组件的props传递 <PlayGround config={demoConfig()} />
  return config
}
```

## homePage

- Type: `string`
- Default: `-`

playground 的logo点击的跳转首页地址，例如你自己有一个组件库，那么这个地址就是你引流的首页地址

```js
import { getPlayPreset } from 'ui-playground'

export const demoConfig = () => {
  const config = getPlayPreset('vue')
  config.headerOption.homePage = 'https://avatars.githubusercontent.com/u/6128107?s=200&v=4'
  // config 将作为组件的props传递 <PlayGround config={demoConfig()} />
  return config
}
```

## uiVersionLink

- Type: `string`
- Default: `-`

playground 进行组件库版本切换时，获取版本号列表的地址

```js
import { getPlayPreset } from 'ui-playground'

export const demoConfig = () => {
  const config = getPlayPreset('vue')
  config.headerOption.uiVersionLink = 'https://data.jsdelivr.com/v1/package/npm/element-plus'
  // config 将作为组件的props传递 <PlayGround config={demoConfig()} />
  return config
}
```

## uiVersion

- Type: `string`
- Default: `-`

playground 进行组件库版本切换时，默认使用的版本号

```js
import { getPlayPreset } from 'ui-playground'

export const demoConfig = () => {
  const config = getPlayPreset('vue')
  config.headerOption.uiVersion = '2.2.8'
  // config 将作为组件的props传递 <PlayGround config={demoConfig()} />
  return config
}
```

## uiMinVersion

- Type: `string`
- Default: `-`

playground 进行组件库版本切换时，支持的最小版本号

```js
import { getPlayPreset } from 'ui-playground'

export const demoConfig = () => {
  const config = getPlayPreset('vue')
  config.headerOption.uiMinVersion = '2.0.0'
  // config 将作为组件的props传递 <PlayGround config={demoConfig()} />
  return config
}
```

## libVersionLink

- Type: `string`
- Default: `https://data.jsdelivr.com/v1/package/npm/vue`

playground 进行框架（vue）版本切换时，获取版本号列表的地址

```js
import { getPlayPreset } from 'ui-playground'

export const demoConfig = () => {
  const config = getPlayPreset('vue')
  config.headerOption.libVersionLink = 'https://data.jsdelivr.com/v1/package/npm/vue'
  // config 将作为组件的props传递 <PlayGround config={demoConfig()} />
  return config
}
```

## libVersion

- Type: `string`
- Default: `latest`

playground 进行框架（vue）版本切换时，默认使用的版本号

```js
import { getPlayPreset } from 'ui-playground'

export const demoConfig = () => {
  const config = getPlayPreset('vue')
  config.headerOption.libVersion = 'latest'
  // config 将作为组件的props传递 <PlayGround config={demoConfig()} />
  return config
}
```

## libMinVersion

- Type: `string`
- Default: `3.2.0`

playground 进行框架（vue）版本切换时，支持的最小版本号

```js
import { getPlayPreset } from 'ui-playground'

export const demoConfig = () => {
  const config = getPlayPreset('vue')
  config.headerOption.libMinVersion = '3.2.0'
  // config 将作为组件的props传递 <PlayGround config={demoConfig()} />
  return config
}
```

## useVersion

- Type: `boolean`
- Default: `true`

playground 是否开启版本切换

```js
import { getPlayPreset } from 'ui-playground'

export const demoConfig = () => {
  const config = getPlayPreset('vue')
  config.headerOption.useVersion = false
  // config 将作为组件的props传递 <PlayGround config={demoConfig()} />
  return config
}
```

## dark

- Type: `boolean`
- Default: `false`

playground 是否开启dark模式切换

```js
import { getPlayPreset } from 'ui-playground'

export const demoConfig = () => {
  const config = getPlayPreset('vue')
  config.headerOption.dark = true
  // config 将作为组件的props传递 <PlayGround config={demoConfig()} />
  return config
}
```

## iconList

- Type: `Array<iconItem>`
- Default: `[]`

playground 右侧需要展示的 icon 列表，通常是引流的网站图标，比如 github 地址
```ts
interface iconItem {
  // logo 地址
  url: string
  // 跳转地址
  link: string
}
```

```js
import { getPlayPreset } from 'ui-playground'

export const demoConfig = () => {
  const config = getPlayPreset('vue')
  config.headerOption.iconList = [
    {
      url: 'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg',
      link: 'https://react.docschina.org/',
    },
  ]
  // config 将作为组件的props传递 <PlayGround config={demoConfig()} />
  return config
}
```

## cdnList

- Type: `Array<CDNItem>`
- Default: `[{
  name: 'jsdelivr',
  link: 'https://cdn.jsdelivr.net/npm/',
  }, {
  name: 'unpkg',
  link: 'https://unpkg.com/',
  }]`

playground 获取 ui 组件库和框架库以及其他依赖的 cdn 列表
```ts
interface iconItem {
  // cdn 名称
  name: string
  // cdn 地址
  link: string
}
```

```js
import { getPlayPreset } from 'ui-playground'

export const demoConfig = () => {
  const config = getPlayPreset('vue')
  config.headerOption.cdnList = [
    {
      name: 'my cdn',
      link: 'https://xxxx.xxxx.xxx/',
    },
  ]
  // config 将作为组件的props传递 <PlayGround config={demoConfig()} />
  return config
}
```

## cdnSet

- Type: `(link: string, pkgName: string, version: string, indexPath: string) => string`
- Default: `(
  link: string,
  pkgName: string,
  version: string,
  indexPath: string,
  ) => ‘${link}${pkgName}@${version}${indexPath}’,`

对于某些非标准格式的 cdn 地址，你需要通过传入这个函数，来准确的返回依赖地址

```js
import { getPlayPreset } from 'ui-playground'

export const demoConfig = () => {
  const config = getPlayPreset('vue')
  config.headerOption.cdnSet = (
    link, // cdn 地址
    pkgName, // 依赖包名
    version, // 依赖版本
    indexPath, // 依赖入口脚本路径
  ) => `${link}${pkgName}@${version}${indexPath}`
  // config 将作为组件的props传递 <PlayGround config={demoConfig()} />
  return config
}
```

## setting

- Type: `ISetting`
- Default: `{
   ssr: true,
   share: true,
   dev: true,
   download: true,
   cdn: true,
   userDeps: true}`

对于某些非标准格式的 cdn 地址，你需要通过传入这个函数，来准确的返回依赖地址
```typescript
interface ISetting {
  ssr: boolean // 是否开启 ssr 切换
  share: boolean // 是否开启分享链接按钮
  dev: boolean // 是否开启 dev/prod 切换
  download: boolean // 是否开启下载按钮
  cdn: boolean // 是否开启 cdn 切换
  userDeps: boolean // 是否运行配置其他依赖
}
```
```js
import { getPlayPreset } from 'ui-playground'

export const demoConfig = () => {
  const config = getPlayPreset('vue')
  config.headerOption.setting = {
    ssr: true,
    share: true,
    dev: true,
    download: true,
    cdn: true,
    userDeps: true,
  }
  // config 将作为组件的props传递 <PlayGround config={demoConfig()} />
  return config
}
```