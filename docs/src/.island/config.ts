import { defineConfig } from 'islandjs'

export default defineConfig({
  title: 'ui-playground',
  icon: '/logo.png',
  themeConfig: {
    nav: [
      {
        text: 'Guide',
        link: '/guide/getting-started',
        activeMatch: '/guide/'
      },
      {
        text: 'Config',
        link: '/config/',
        activeMatch: '/config/'
      },
      {
        text: 'Example',
        link: '/example',
        activeMatch: '/example/'
      },
      {
        text: 'Playground',
        link: '/playground',
        activeMatch: '/playground/'
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
          text: '配置项',
          items: [
            {
              text: 'Header 配置项',
              link: '/config/config-header'
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
      copyright: 'Copyright © 2022-present baiwusanyu-c'
    }
  }
})
