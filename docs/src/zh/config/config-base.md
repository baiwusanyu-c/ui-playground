# 基础配置项

## isSSR

- Type: `boolean`
- Default: `false`

`playground` 的是否默认使用 `SSR` 模式对代码进行编译（它依赖于你使用的前端框架能力，比如 `vue/server-renderer`）  

:::warning
但是，对于 ui 组件库而言，其实很多环境都是基于 nuxt.js 或 next.js来实现的，
所以不推荐开启这个模式，因为很多时候他是直接报错的。
:::

```js
import { getPlayPreset } from 'ui-playground'

export const demoConfig = () => {
  const config = getPlayPreset('vue')
  config.isSSR = true
  // config 将作为组件的props传递 <PlayGround config={demoConfig()} />
  return config
}
```

## useUno

- Type: `boolean`
- Default: `false`

`playground` 默认内置支持了一套 `unocss` 的基础预设，可以通过 `useUno` 来开启它

:::tip
目前暂时不支持自定义传入 unocss 配置
:::

```js
import { getPlayPreset } from 'ui-playground'

export const demoConfig = () => {
  const config = getPlayPreset('vue')
  config.useUno = true
  // config 将作为组件的props传递 <PlayGround config={demoConfig()} />
  return config
}
```

## vertical

- Type: `boolean`
- Default: `false`

`playground` 布局是否为垂直布局

```js
import { getPlayPreset } from 'ui-playground'

export const demoConfig = () => {
  const config = getPlayPreset('vue')
  config.vertical = true
  // config 将作为组件的props传递 <PlayGround config={demoConfig()} />
  return config
}
```