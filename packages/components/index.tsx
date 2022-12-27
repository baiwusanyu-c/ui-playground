import { ConfigProvider, theme } from 'antd'
import { useState } from 'react'
import { mergeConfig } from '../play.config'
import { depsStore } from '../store/deps'
import { fileStore } from '../store/file'
import evtBus from '../utils/event-bus'
import { deserialize, serialize } from '../utils'
import { PlayMain } from './main'
import { PlayHeader } from './header'
import type { playConfig } from '../play.config'
import '../assets/index.scss'
import '../assets/theme.scss'
import 'antd/dist/reset.css'

export declare interface PlayGroundProps {
  config: playConfig
}
export const PlayGround = (props: PlayGroundProps) => {
  const config = mergeConfig(props.config)
  const urlFileInfo = deserialize(location.hash.slice(1))
  if (urlFileInfo) {
    config.importMap = urlFileInfo.importMap
    config.mainFile = urlFileInfo.files[urlFileInfo.mainFile]
    fileStore.setFiles(urlFileInfo.files)
    fileStore.isProdCompile = urlFileInfo.isProdCompile
  }
  depsStore.init(config.importMap)
  const ssr = urlFileInfo.isSSRCompile !== undefined ? urlFileInfo.isSSRCompile : config.isSSR
  fileStore.init(
    config.mainFile,
    config.compileOutput,
    config.compileModule,
    config.compileInject,
    config.hooks,
    config.presetType,
    ssr,
  )
  function replaceState() {
    history.replaceState(
      {},
      '',
        `#${serialize(
          config.mainFile.filename,
          depsStore.importMap,
          fileStore.files,
          fileStore.isProdCompile,
          fileStore.isSSRCompile,
        )}`)
  }
  replaceState()
  // 开启预览监听 接受来自 fileStore/ header setting 交互的通知信息，更新 url
  evtBus.on('fileMessage', replaceState)

  const [isAntdDark, setAntdDark] = useState<boolean>(false)
  evtBus.on('isDark', (dark: boolean) => setAntdDark(dark))
  return (
    <ConfigProvider
      theme={{
        algorithm: isAntdDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <div className="play-ground">
        <PlayHeader config={config.headerOption} isSSR={ssr} />
        <PlayMain
          layout={config.layout}
          useUno={config.useUno}
          isSSR={ssr}
        />
      </div>
    </ConfigProvider>

  )
}
