import { defineConfig } from 'islandjs'

export default defineConfig({
  title: 'ui-playground',
  themeConfig: {
    nav: [
      {
        text: 'Home',
        link: '/',
        activeMatch: '^/$|^/'
      },
      {
        text: 'guide',
        link: '/guide',
        activeMatch: '^/$|^/guide'
      },
      {
        text: 'config',
        link: '/config',
        activeMatch: '^/$|^/config'
      },
      {
        text: 'example',
        link: '/example',
        activeMatch: '^/$|^/example'
      },
      {
        text: 'playground',
        link: '/playground',
        activeMatch: '^/$|^/playground'
      }
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            {
              text: 'Getting Started',
              link: '/guide/getting-started'
            }
          ]
        },
        {
          text: '内置预设',
          items: [
            {
              text: '内置 vue 支持',
              link: '/guide/getting-started'
            }
          ]
        },
        {
          text: '定制主题',
          items: [
            {
              text: '定制主题颜色',
              link: '/guide/getting-started'
            },
            {
              text: '内置黑暗主题',
              link: '/guide/getting-started'
            }
          ]
        },
        {
          text: '高阶指引',
          items: [
            {
              text: '自定义编译',
              link: '/guide/getting-started'
            },
            {
              text: '运行时钩子',
              link: '/guide/getting-started'
            },
            {
              text: 'CDN 配置',
              link: '/guide/getting-started'
            },
          ]
        }
      ] ,
      '/config/': [
        {
          text: 'header config',
          items: [
            {
              text: 'Getting Started',
              link: '/guide/getting-started'
            }
          ]
        }],
      '/example/': [
        {
          text: 'vue',
          items: [
            {
              text: 'element-plus',
              link: '/guide/getting-started'
            }
          ]
        }],
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2022-present Xingyuan Yang'
    }
  }
})
