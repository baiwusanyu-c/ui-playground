# Built-In Preset Vue

`ui-playgroun` 内置了对 [`vue`](https://cn.vuejs.org/)的支持，开发者可以调用预设，快速构建基于 `vue` 的组件库 `playground`.

```javascript
import { getPlayPreset } from 'ui-playground'

export const demoConfig = () => {
  const config = getPlayPreset('vue')
  // config 将作为组件的props传递 <PlayGround config={demoConfig()} />
  return config
}
```
它将返回一个预设配置，如下：
```javascript
{
    "isSSR": false,
    "useUno": false,
    "vertical": false,
    "presetType": "vue",
    "mainFile": {
        "filename": "App.vue",
        "code": "<script setup lang=\"ts\">\nimport { ref, version as vueVersion } from 'vue'\nimport { ElIcon, ElInput, version as EpVersion } from 'element-plus'\nimport { ElementPlus } from '@element-plus/icons-vue'\n\nconst msg = ref('Hello World!')\n</script>\n\n<template>\n  <h1>{{ msg }}</h1>\n  <el-input v-model=\"msg\" />\n\n  <p>\n    <el-icon color=\"var(--el-color-primary)\">\n      <ElementPlus />\n    </el-icon>\n    Element Plus {{ EpVersion }} + Vue {{ vueVersion }}\n  </p>\n</template>\n"
    },
    "importMap": [
        {
            "name": "vue",
            "pkgName": "@vue/runtime-dom",
            "indexPath": "/dist/runtime-dom.esm-browser.js",
            "type": "lib"
        },
        {
            "name": "vue/server-renderer",
            "pkgName": "@vue/server-renderer",
            "indexPath": "/dist/server-renderer.esm-browser.js",
            "type": "lib"
        },
        {
            "name": "@vue/compiler-sfc",
            "pkgName": "@vue/compiler-sfc",
            "indexPath": "/dist/compiler-sfc.esm-browser.js",
            "type": "lib"
        },
        {
            "name": "element-plus",
            "pkgName": "element-plus",
            "indexPath": "/dist/index.full.min.mjs",
            "type": "ui"
        },
        {
            "name": "@element-plus/icons-vue",
            "pkgName": "@element-plus/icons-vue",
            "indexPath": "/dist/index.min.js",
            "cdnLink": "https://cdn.jsdelivr.net/npm//@element-plus/icons-vue@2/dist/index.min.js",
            "type": "other"
        },
        {
            "name": "@element-plus/css",
            "pkgName": "element-plus",
            "indexPath": "/dist/index.css",
            "type": "css"
        }
    ],
    "hooks": {},
    "headerOption": {
        "title": "element-plus",
        "subTitle": "playground",
        "logo": "https://avatars.githubusercontent.com/u/68583457?s=200&v=4",
        "homePage": "https://github.com/baiwusanyu-c/ui-playground",
        "useVersion": true,
        "uiVersionLink": "https://data.jsdelivr.com/v1/package/npm/element-plus",
        "uiVersion": "latest",
        "uiMinVersion": "2.2.8",
        "iconList": [],
        "dark": false,
        "cdnList": [
            {
                "name": "jsdelivr",
                "link": "https://cdn.jsdelivr.net/npm/"
            },
            {
                "name": "unpkg",
                "link": "https://unpkg.com/"
            }
        ],
        "setting": {
            "ssr": true,
            "share": true,
            "dev": true,
            "download": true,
            "cdn": true,
            "userDeps": true
        },
        "libVersion": "latest",
        "libMinVersion": "3.2.0",
        "libVersionLink": "https://data.jsdelivr.com/v1/package/npm/vue"
    }
}
```
