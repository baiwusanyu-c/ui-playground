# 内置的黑暗主题

`ui-playground` 内置了黑暗主题，你可以通过配置选项，设置默认展示的主题风格。

在项目的入口文件导入样式文件。
```javascript
// main.tsx
/* ... */
import '@ui-playground/theme/index'
import '@ui-playground/theme'
/* ... */
```

然后在 `config` 配置中设置黑暗主题默认展示。
```javascript
import { getPlayPreset } from 'ui-playground'

export const demoConfig = () => {
  const config = getPlayPreset('vue')
  playConfig.headerOption.dark = true
  // config 将作为组件的props传递 <PlayGround config={demoConfig()} />
  return config
}
```

![](../../public/dark.gif)
