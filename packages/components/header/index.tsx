import '../../asset/header.scss'
import PropTypes from 'prop-types'
import { Dropdown, Select, Space } from 'antd'
import { useState } from 'react'
import type { MenuProps } from 'antd'
import type { headerOption, iconItem } from '../../utils/config'
import { CarbonSun } from '../icon/sun'
import { CarbonSetting } from '../icon/setting'
import { CarbonMoon } from '../icon/moon'
// TODO：CDN
// TODO: Dark
// TODO: version
// TODO: mobile

interface IHeaderProps {
  config: headerOption
}
PlayHeader.propTypes = {
  config: PropTypes.object,
}

export function PlayHeader(props: IHeaderProps) {
  /** ******************* 设置版本 **********************/

  const uiVersionList = [
    {
      value: 'jack',
      label: 'Jack',
    },
    {
      value: 'lucy',
      label: 'Lucy',
    },
    {
      value: 'disabled',
      disabled: true,
      label: 'Disabled',
    },
    {
      value: 'Yiminghe',
      label: 'yiminghe',
    },
  ]
  const libVersionList = [
    {
      value: 'jack',
      label: 'Jack',
    },
    {
      value: 'lucy',
      label: 'Lucy',
    },
    {
      value: 'disabled',
      disabled: true,
      label: 'Disabled',
    },
    {
      value: 'Yiminghe',
      label: 'yiminghe',
    },
  ]
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
  const setDarkClass = () => {
    setDark(!isDark)
  }
  /** ******************* cdn 设置 **********************/

  const items: MenuProps['items'] = [
    {
      key: 'awdawd',
      label: <span>awdqwdasdadqw</span>,
    },
    {
      key: 'asfaegerg',
      label: <span>yiminghe</span>,
    },
  ]

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
            <span>version:</span>
            <Select
                defaultValue="lucy"
                style={{ width: 120, margin: '0 10px' }}
                options={uiVersionList}
            />
            <span>dep version:</span>
            <Select
                defaultValue="lucy"
                style={{ width: 120, margin: '0 10px' }}
                options={libVersionList}
            />
            {iconList(props.config.iconList)}

            {isDark
              ? <CarbonMoon className="icon" onClick={setDarkClass}/>
              : <CarbonSun className="icon" onClick={setDarkClass}/>}

            <Dropdown menu={{ items }}>
                <Space>
                    <CarbonSetting className="icon"/>
                </Space>
            </Dropdown>
        </div>
      </div>
  )
}
