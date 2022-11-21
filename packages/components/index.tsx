import type { playConfig } from '../utils/config'
import { mergeConfig } from '../utils/config'
import { PlayMain } from './main'
import { PlayHeader } from './header'
import '../asset/index.css'
import 'antd/dist/reset.css'
export declare interface PlayGroundProps {
  config: playConfig
}
export function PlayGround(props: PlayGroundProps) {
  const config = mergeConfig(props.config)
  return (
    <div className="play-ground">
        <PlayHeader config={config.headerOption}></PlayHeader>
        <PlayMain></PlayMain>
    </div>
  )
}
