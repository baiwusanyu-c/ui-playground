import '../../asset/filer-selector.scss'
import { ExclamationCircleFilled } from '@ant-design/icons'
import type { FC } from 'react'
import React, { useState } from 'react'
import { Input, Modal, Tabs } from 'antd'
import type { EventEmitter } from 'ahooks/lib/useEventEmitter'
import { fileStore } from '../../store/file'
import { checkFileType, extend } from '../../utils'
// TODO: 文件选中（与编辑器联动）
// TODO: 所有文件信息、版本信息地址栏持久化
// TODO: 当前激活文件变化能够记录到 active 和 files 中
export const FileSelector: FC<{
  event$: EventEmitter<void>
}> = function (props) {
  const fileList = Object.keys(fileStore.files).map((val) => {
    return { key: val, ...fileStore.files[val], label: val }
  })
  const [activeKey, setActiveKey] = useState(fileList[0].key)
  const [items, setItems] = useState(fileList)

  /**
   * 设置激活tab
   * @param newActiveKey
   */
  const onChange = (newActiveKey: string) => {
    setActiveKey(newActiveKey)
    fileStore.setActiveFileByKey(newActiveKey)
    props.event$.emit()
  }
  /** ************************** 新增虚拟文件 ***********************************/
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [inputVal, setInputVal] = useState('Comp.vue')
  const [isErr, setErr] = useState<'' | 'error'>('')
  const [tip, setTip] = useState<string>('')

  const handleCancel = () => {
    setIsModalOpen(false)
    setErr('')
    setTip('')
    setInputVal('Comp.vue')
  }

  const handleOk = () => {
    if (!inputVal) {
      setErr('error')
      setTip('Please input file name')
      return
    }
    if (fileStore.files[inputVal]) {
      setErr('error')
      setTip('Duplicate filename')
      return
    }

    const newFile = {
      filename: inputVal,
      code: '',
      hidden: false,
      compiled: {
        js: '',
        css: '',
        ssr: '',
      },
      key: inputVal,
      label: inputVal,
    }
    const newPanes = [...items]
    newPanes.push(extend({
      key: inputVal,
      label: inputVal,
    }, newFile))
    setItems(newPanes)
    setActiveKey(inputVal)
    fileStore.add(newFile)
    props.event$.emit()
    handleCancel()
  }

  const handleChange = (data: string) => {
    setInputVal(data)
    setErr('')
    setTip('')
    if (fileStore.files[data]) {
      setErr('error')
      setTip('Duplicate filename')
    }
    if (!checkFileType(data)) {
      setErr('error')
      setTip('The supported format types are \'.css\', \'.js\', \'.jsx\', \'.vue\'')
    }
  }

  const add = () => {
    setIsModalOpen(true)
  }

  /** ************************** 删除虚拟文件 ***********************************/

  const remove = (targetKey: string) => {
    if (targetKey === fileStore.mainFile)
      return

    Modal.confirm({
      title: 'Do you Want to delete these file?',
      icon: <ExclamationCircleFilled />,
      onOk() {
        let newActiveKey = activeKey
        let lastIndex = -1
        items.forEach((item, i) => {
          if (item.key === targetKey)
            lastIndex = i - 1
        })
        const newPanes = items.filter(item => item.key !== targetKey)
        if (newPanes.length && newActiveKey === targetKey) {
          if (lastIndex >= 0)
            newActiveKey = newPanes[lastIndex].key
          else
            newActiveKey = newPanes[0].key
        }
        setItems(newPanes)
        setActiveKey(newActiveKey)
        fileStore.remove(targetKey)
        fileStore.setActiveFileByKey(newActiveKey)
        props.event$.emit()
      },
    })
  }

  /**
   * 新增或删除触发
   * @param targetKey
   * @param action
   */
  const onEdit = (targetKey: string, action: 'add' | 'remove') => {
    if (action === 'add')
      add()
    else
      remove(targetKey)
  }

  return (
    <>
      <Tabs
      size="small"
      type="editable-card"
      onChange={onChange}
      activeKey={activeKey}
      onEdit={(e, action) => onEdit(e as string, action)}
      items={items}
    />
      <Modal title="Please input file name"
             onOk={handleOk}
             onCancel={handleCancel}
             open={isModalOpen}>
        <Input value={inputVal} onChange={e => handleChange(e.target.value)} status={isErr}/>
        <p style={{ color: '#ff7875' }}>{tip}</p>
      </Modal>
    </>

  )
}