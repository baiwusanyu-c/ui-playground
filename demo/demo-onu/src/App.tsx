import { PlayGround } from 'ui-playground'
import { demoOnu } from './onu-ui/demo-onu'
const playConfig = demoOnu()
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
