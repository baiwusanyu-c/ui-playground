import { mergeConfig } from '../utils/config'
import { depsStore } from '../store/deps'
import { fileStore } from '../store/file'
import evtBus from '../utils/event-bus'
import { deserialize, serialize } from '../utils'
import { PlayMain } from './main'
import { PlayHeader } from './header'
import type { playConfig } from '../utils/config'
import '../asset/index.scss'
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
  }
  depsStore.init(config.importMap)
  fileStore.init(
    config.mainFile,
    config.compileOutput,
    config.compileModule,
    config.compileInject,
    config.hooks,
  )
  function replaceState() {
    history.replaceState(
      {},
      '',
        `#${serialize(config.mainFile.filename, config.importMap, fileStore.files)}`)
  }
  replaceState()
  // 开启预览监听 接受来自 fileStore 交互的通知信息，更新 url
  evtBus.on('fileMessage', replaceState)
  return (
    <div className="play-ground">
      <PlayHeader config={config.headerOption} />
      <PlayMain
        layout={config.layout}
        isSSR={config.isSSR}
      />
    </div>
  )
}
