import { PlayGround } from 'ui-playground'
import { demoEp } from './element-plus/demo-ep'
const playConfig = demoEp()
playConfig.isSSR = false
playConfig.useUno = false

const App = () => {
  return (
    <div className="App">
      <PlayGround config={playConfig} />
    </div>
  )
}

export default App
