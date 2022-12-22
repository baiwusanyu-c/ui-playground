import { Input, Modal, Select, Switch, message } from 'antd'
import { useState } from 'react'
import {
  DeleteOutlined,
  DownloadOutlined, ExclamationCircleFilled,
  PlusCircleOutlined,
  ShareAltOutlined,
} from '@ant-design/icons'
import { CarbonSetting } from '../icon/setting'
import { jsdelivrLink } from '../../utils/constant'
import { getUuid } from '../../utils'
import { fileStore } from '../../store/file'
import evtBus from '../../utils/event-bus'
import { downloadProject } from './download/download'
import type React from 'react'
import type { ISetting } from '../../play.config'
export interface ICDNItems {
  label: string
  key: string
  value: string
}
interface HeaderSettingProps {
  config: ISetting
  handleSelectCDN: Function
  cdnList: Array<ICDNItems>
  isSSR: boolean
}

export const HeaderSetting = (props: HeaderSettingProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  /** *************** handle Switch change(ssr/dev) *****************************/
  const [isDev, setDev] = useState(!fileStore.isProdCompile)
  const [isSSR, setSSR] = useState(props.isSSR)
  const onSwitchChange = (value: boolean, type: string) => {
    if (type === 'ssr') {
      fileStore.isSSRCompile = value
      setSSR(value)
    } else {
      fileStore.isProdCompile = !value
      setDev(value)
    }
  }

  /** ************************* CDN **********************************/
  const [cdn, setCDN] = useState({
    value: jsdelivrLink,
    type: 'jsdelivr',
  })
  const handleCDNSelect = (value: string, option: ICDNItems | Array<ICDNItems>) => {
    let optionInner = option
    if (!Array.isArray(optionInner)) optionInner = [optionInner]
    setCDN({
      value,
      type: optionInner[0].label,
    })
  }

  /** *************** handle deps list *****************************/
  const [depsList, setDepsList] = useState([
    {
      cdnLink: 'www.github.com',
      pkgName: 'unocss',
      key: getUuid(),
    },
    {
      cdnLink: 'www.tailwindcss.com',
      pkgName: 'tailwindcss',
      key: getUuid(),
    },
    {
      cdnLink: 'www.windicss.com',
      pkgName: 'windicss',
      key: getUuid(),
    },

  ])
  function addDepsListItem() {
    setDepsList([...depsList, {
      cdnLink: '',
      pkgName: '',
      key: getUuid(),
    }])
  }
  function delDepsListItem(index: number) {
    const depsListInner = depsList
    depsListInner.splice(index, 1)
    setDepsList([...depsListInner])
  }
  function handleCDNInput(
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    key: string) {
    const indexDeps = depsList[index]
    if (key === 'name')
      indexDeps.pkgName = e.target.value
    else
      indexDeps.cdnLink = e.target.value

    const depsListInner = depsList
    depsListInner[index] = indexDeps
    setDepsList([...depsListInner])
  }
  function DepsList() {
    return depsList.map((val, index) => {
      return (
        <div className="header-setting--item" key={val.key}>
          <Input
            defaultValue={val.pkgName}
            onChange={e => handleCDNInput(e, index, 'name')}
            style={{ width: 120, marginRight: '10px' }}
            placeholder="pkgName"
          />
          <Input
            defaultValue={val.cdnLink}
            style={{ width: 200 }}
            onChange={e => handleCDNInput(e, index, 'link')}
            placeholder="cdnLink"
          />
          <DeleteOutlined
            role="button"
            onClick={() => delDepsListItem(index)}
          />
        </div>
      )
    })
  }

  /** ***************** modal *****************************/
  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
    console.log(cdn)
    console.log(isDev)
    console.log(depsList)
    props.handleSelectCDN(cdn.value, cdn.type)
    evtBus.emit('fileMessage', 'update_file')
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  /** ****************** shared *****************************/
  const [messageApi, contextHolder] = message.useMessage()
  const sharedLink = () => {
    const oInput = document.createElement('input')
    oInput.value = window.location.href
    document.body.appendChild(oInput)
    oInput.select()
    document.execCommand('Copy')
    oInput.style.display = 'none'
    document.body.removeChild(oInput)
    messageApi.open({
      type: 'success',
      content: 'The share link has been copied to the clipboard',
    })
  }

  /** ****************** download *****************************/
  const download = () => {
    Modal.confirm({
      title: 'Download project files?',
      icon: <ExclamationCircleFilled />,
      async onOk() {
        await downloadProject(fileStore)
      },
    })
  }
  return (
    <>
      {contextHolder}
      <CarbonSetting className="icon" onClick={showModal} />
      <Modal
        title="Setting"
        className="header-setting"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >

        <div className="header-setting--item">
          {props.config.ssr
            ? <>
              <span className="label">SSR:</span>
              <Switch defaultChecked={isSSR} onChange={v => onSwitchChange(v, 'ssr')} />
              </>
            : ''
          }

          {props.config.dev
            ? <>
              <span className="label">DEV:</span>
              <Switch defaultChecked={isDev} onChange={v => onSwitchChange(v, 'dev')} />
              </>
            : ''
          }

          {props.config.share
            ? <ShareAltOutlined style={{ fontSize: '25px' }} onClick={sharedLink} />
            : ''
          }
          {props.config.download
            ? <DownloadOutlined style={{ fontSize: '25px' }} onClick={download} />
            : ''
        }
        </div>
        {props.config.cdn
          ? <div className="header-setting--item">
            <span className="label">CDN:</span>
            <Select
              defaultValue={cdn.value}
              style={{ width: 120 }}
              onChange={handleCDNSelect}
              options={props.cdnList}
            />
            </div>
          : ''
        }
        {props.config.userDeps
          ? <>
            <div className="header-setting--item">
              SET DEPS:
              <PlusCircleOutlined
                role="button"
                onClick={addDepsListItem}
                style={{ fontSize: '20px' }}
              />
            </div>
            {DepsList()}
            </>
          : ''
        }
      </Modal>
    </>
  )
}
