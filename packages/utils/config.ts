import { extend } from './index'
export declare interface iconItem {
  link: string
  url: string
}
export declare interface headerOption {
  title: string
  subTitle: string
  logo: string
  homePage: string
  uiCDN?: string
  uiVersion?: string
  uiMinVersion?: string
  libCDN?: string
  libVersion?: string
  libMinVersion?: string
  iconList?: Array<iconItem>
  dark: boolean
  cdnList: Array<string>
}

export declare interface playConfig {
  headerOption: headerOption
}
export const defaultConfig: playConfig = {
  headerOption: {
    title: 'Ant Design',
    subTitle: 'playground',
    logo: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
    homePage: 'https://ant.design/docs/react/introduce-cn',

    uiCDN: 'https://data.jsdelivr.com/v1/package/npm/ant-design-vue',
    uiVersion: 'latest',
    uiMinVersion: '3.0.0',
    libCDN: 'https://data.jsdelivr.com/v1/package/npm/vue',
    libVersion: 'latest',
    libMinVersion: '3.2.0',

    iconList: [
      {
        url: 'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg',
        link: 'https://react.docschina.org/',
      },
      {
        url: 'https://github.githubassets.com/favicons/favicon.svg',
        link: 'https://github.com/ant-design/ant-design',
      },
    ],

    dark: true,
    cdnList: [],
  },
}

export const mergeConfig = (config: playConfig, defaultConfigs = defaultConfig) => {
  return extend(defaultConfigs, config)
}
