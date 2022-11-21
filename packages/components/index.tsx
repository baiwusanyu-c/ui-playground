import { PlayMain } from './main'
import { PlayHeader } from './header'
import '../asset/index.css'
export function PlayGround() {
  return (
    <div className="play-ground">
        <PlayHeader></PlayHeader>
        <PlayMain></PlayMain>
    </div>
  )
}
