import { mergeConfig } from '../utils/config'
import { depsStore } from '../store/deps'
import { fileStore } from '../store/file'
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
  depsStore.init(config.importMap)
  fileStore.init(
    config.mainFile,
    config.compileOutput,
    config.compileModule,
    config.compileInject,
    config.hooks,
  )
  return (
    <div className="play-ground">
      <PlayHeader config={config.headerOption} />
      <PlayMain />
    </div>
  )
}
