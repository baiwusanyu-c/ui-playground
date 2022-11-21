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
    uiCDN: '',
    uiVersion: 'latest',
    libCDN: '',
    libVersion: 'latest',
    iconList: [
      {
        url: 'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg',
        link: 'https://react.docschina.org/',
      },
      {
        url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg-blog.csdnimg.cn%2Fimg_convert%2F47127ad9b60270905b13deb37587cb09.png&refer=http%3A%2F%2Fimg-blog.csdnimg.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1671631806&t=640a8b430f6c933f5f43b0044948d6da',
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
