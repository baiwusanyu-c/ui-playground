
// 预览沙盒（preview） -> 从mainFile为入口
// css -> 从 .css、.vue
// js/ssr -> .vue .js  .jsx .ts .tsx

import '../../asset/filer-selector.scss'
import type { FC } from 'react'
import React, { useState } from 'react'
import { Tabs } from 'antd'
import type { EventEmitter } from 'ahooks/lib/useEventEmitter'
import {outputType} from "../../utils/types";
export const OutputSelector: FC<{
  event$: EventEmitter<outputType | 'preview'>
}> = function (props) {
  const fileList = [
    {key:'preview',label:'preview'},
    {key:'js',label:'js'},
    {key:'css',label:'css'},
    {key:'ssr',label:'ssr'},
  ]
  const [activeKey, setActiveKey] = useState(fileList[0].key)
  const [items] = useState(fileList)

  /**
   * 设置激活tab
   * @param newActiveKey
   */
  const onChange = (newActiveKey: string) => {
    setActiveKey(newActiveKey)
    props.event$.emit(newActiveKey as outputType | 'preview')
  }

  return (
    <>
      <Tabs
        size="small"
        type="card"
        style={{height: '38px'}}
        onChange={onChange}
        activeKey={activeKey}
        items={items}
      />
    </>

  )
}