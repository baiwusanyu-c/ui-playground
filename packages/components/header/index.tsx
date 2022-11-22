import '../../asset/header.scss'
import PropTypes from 'prop-types'
import { Dropdown, Select } from 'antd'
import { useEffect, useState } from 'react'
import type { MenuProps } from 'antd'
import { useMount } from 'ahooks'
import type { headerOption, iconItem } from '../../utils/config'
import { CarbonSun } from '../icon/sun'
import { CarbonSetting } from '../icon/setting'
import { CarbonMoon } from '../icon/moon'
import { versionStore } from '../../store/version'
import type { ISelectItem } from '../../utils'
import { createSelectList, getStorage, setStorage } from '../../utils'
import { depsStore } from '../../store/deps'
// TODO：CDN

interface IHeaderProps {
  config: headerOption
}
PlayHeader.propTypes = {
  config: PropTypes.object,
}

export function PlayHeader(props: IHeaderProps) {
  /** ******************* 设置版本 **********************/

  // 初始化版本
  const [uiVersion] = useState<string>(props.config.uiVersion!)
  const [libVersion] = useState<string>(props.config.libVersion!)
  useMount(() => {
    setDarkClass(true)
  })

  versionStore.init(props.config)
  const [uiVersionList, setUiList] = useState<Array<ISelectItem>>([])
  const [libVersionList, setLibList] = useState<Array<ISelectItem>>([])
  useEffect(() => {
    versionStore.getVersion('ui').then((res: any) => {
      setUiList(createSelectList(res, 'uiVersionList'))
    })
    versionStore.getVersion('lib').then((res: any) => {
      setLibList(createSelectList(res, 'libVersionList'))
    })
  }, [setUiList, setLibList])

  const handleSelect = (data: string, type: 'ui' | 'lib') => {
    versionStore.setVersion(data, type)
  }

  /** ******************* 相关连接图标设置 **********************/

  const iconList = (list?: Array<iconItem>) => {
    const resList: Array<JSX.Element> = []
    if (list && list.length > 0) {
      list.forEach((val: iconItem) => {
        resList.push((
                    <a href={val.link} target="_blank" rel="noreferrer" key={val.url}>
                        <img src={val.url} alt="" className="header-link"/>
                    </a>
        ))
      })
    }
    return resList
  }

  /** ******************* 设置黑暗模式 **********************/

  const [isDark, setDark] = useState(props.config.dark)
  function setDarkClass(isInit?: boolean, dark?: boolean) {
    if (isInit) {
      const cache = getStorage('dark')
      if (!(!cache && cache !== false && cache !== 'false'))
        setDark(cache)
    }
    else {
      setStorage('dark', (dark!).toString())
      setDark(dark!)
    }
  }
  useEffect(() => {
    const htmlEl = document.querySelector('html') as Element
    htmlEl.className = isDark ? 'dark' : ''
  }, [isDark])

  /** ******************* cdn 设置 **********************/

  const items: MenuProps['items'] = props.config.cdnList.map((val) => {
    return { value: val.link, label: val.name, key: val.link }
  })
  const handleSelectCDN = (e: any) => {
    const cdnType = e.domEvent.currentTarget.innerText
    const uiVersion = versionStore.uiVersion
    const libVersion = versionStore.libVersion
    depsStore.setDepsByCDN(cdnType, uiVersion, libVersion)
  }
  return (
      <div className="play-header">
        <div className="header-left">
            <a href={props.config.homePage} target="_blank" rel="noreferrer">
                <img src={props.config.logo} alt={props.config.logo} />
            </a>
            <h1>{props.config.title}</h1>
            <span>{props.config.subTitle}</span>
        </div>
        <div className="header-right">
            <span className="version-label">version:</span>
            <Select
                className="version-select"
                onChange={data => handleSelect(data, 'ui')}
                defaultValue={uiVersion}
                style={{ width: 120, margin: '0 10px' }}
                options={uiVersionList}
            />
            <span className="version-label">dep version: {isDark}</span>
            <Select
                className="version-select"
                onChange={data => handleSelect(data, 'lib')}
                defaultValue={libVersion}
                style={{ width: 120, margin: '0 10px' }}
                options={libVersionList}
            />
            {iconList(props.config.iconList)}

            {isDark
              ? <CarbonMoon className="icon" onClick={() => setDarkClass(undefined, false)}/>
              : <CarbonSun className="icon" onClick={() => setDarkClass(undefined, true)}/>}

            <Dropdown menu={{ items, onClick: e => handleSelectCDN(e) }}>
                    <CarbonSetting className="icon"/>
            </Dropdown>
        </div>
      </div>
  )
}
