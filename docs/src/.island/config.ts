import { defineConfig, DefaultTheme } from 'islandjs';

function getI18nHelper(lang: 'zh' | 'en') {
  const cn = lang === 'zh';
  const prefix = cn ? '/zh' : '/en';
  const getLink = (str: string) => `${prefix}${str}`;
  const getText = (cnText: string, enText: string) => (cn ? cnText : enText);
  return { getText, getLink };
}

export default defineConfig({
  title: 'ui-playground',
  icon: '/logo.png',
  themeConfig: {
    locales: {
      '/zh/': {
        lang: 'zh',
        label: '简体中文',
        lastUpdatedText: '上次更新',
        nav: getNavbar('zh'),
        sidebar: getSidebar('zh'),
        title: 'ui-playground',
        outlineTitle: '目录',
        prevPageText: '上一页',
        nextPageText: '下一页',
        description: '面向组件库开发者的演练场',
      },
      '/en/': {
        lang: 'en',
        label: 'English',
        lastUpdated: 'Last Updated',
        nav: getNavbar('en'),
        sidebar: getSidebar('en'),
        title: 'ui-playground',
        description: 'Playground for component library developers',
        lastUpdatedText: 'Last Updated',
      }
    },
    outlineTitle: 'ON THIS PAGE',
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/baiwusanyu-c/ui-playground'
      }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2022-present baiwusanyu-c'
    }
  }
})

function getNavbar(lang: 'zh' | 'en') {
  const { getLink, getText } = getI18nHelper(lang);

  return [
    {
      text: getText('指南', 'Guide'),
      link: getLink('/guide/getting-started'),
      activeMatch: '/guide/'
    },
    {
      text: getText('配置', 'Config'),
      link: getLink('/config/'),
      activeMatch: '/config/'
    },
    {
      text: getText('示例', 'Example'),
      link: getLink('/example/'),
      activeMatch: '/Example/'
    },
    {
      text: getText('演练场', 'Playground'),
      link: getLink('/playground/'),
      activeMatch: '/playground/'
    },
  ];
}

function getSidebar(lang: 'zh' | 'en'): DefaultTheme.Sidebar {
  const { getLink, getText } = getI18nHelper(lang);
  return {
    [getLink('/guide/')]: [
      {
        text: getText('快速开始', 'Getting Started'),
        items: [
          {
            text: getText('安装', 'Install'),
            link: getLink('/guide/getting-started')
          },
          {
            text: getText('使用教程', 'Tutorial'),
            link: getLink('/guide/getting-started')
          }
        ]
      },
      {
        text: getText('内置预设', 'Built-In Preset'),
        items: [
          {
            text: getText('Vue 预设', 'Vue Preset'),
            link: getLink('/guide/getting-started')
          }
        ]
      },
      {
        text: getText('定制主题', 'Custom Theme'),
        items: [
          {
            text: getText('定制主题颜色', 'Custom Theme Colors'),
            link: getLink('/guide/getting-started')
          },
          {
            text: getText('内置黑暗主题', 'Built-In Dark Theme'),
            link: getLink('/guide/getting-started')
          }
        ]
      },
      {
        text: getText('高阶指引', 'Advanced Guide'),
        items: [
          {
            text: getText('自定义编译方法', 'Custom Compilation'),
            link: getLink('/guide/getting-started')
          },
          {
            text: getText('运行时钩子', 'Runtime Hook'),
            link: getLink('/guide/getting-started')
          },
          {
            text: getText('CDN 配置', 'CDN Settings'),
            link: getLink('/guide/getting-started')
          },
        ]
      }
    ] ,
    [getLink('/config/')]: [
      {
        text: getText('配置项', 'Config'),
        items: [
          {
            text: getText('基础配置项', 'Base Config'),
            link: getLink('/config/config-base')
          },
          {
            text: getText('入口文件及初始依赖', 'File & Dep Config'),
            link: getLink('/config/config-dep')
          },
          {
            text: getText('Header 配置项', 'Header Config'),
            link: getLink('/config/config-header')
          }
        ]
      },
      {
        text: getText('方法', 'Function'),
        items: [
          {
            text: getText('公共方法', 'Common Function'),
            link: getLink('/config/func-common')
          },
          {
            text: getText('钩子函数', 'Hook Function'),
            link: getLink('/config/func-hooks')
          },
          {
            text: getText('编译函数', 'Compiler Function'),
            link: getLink('/config/func-compiler')
          },
        ]
      },],
    [getLink('/example/')]: [
      {
        text: 'vue',
        items: [
          {
            text: 'element-plus',
            link: getLink('/config/config-header')
          },
          {
            text: 'arco design vue',
            link: getLink('/config/config-header')
          },
          {
            text: 'onu-ui',
            link: getLink('/config/config-header')
          }
        ]
      }],
  }
}