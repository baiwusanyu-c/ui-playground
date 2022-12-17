
import '../assets/scss/App.css'
import { PlayGround } from 'ui-playground'
import { demoOnu } from '../../../docs/demo/onu-ui/demo-onu'
const playConfig = demoOnu()
playConfig.useUno = false
playConfig.isSSR = true
console.log(playConfig)
const App = () => {
  return (
    <div className="App">
      <PlayGround config={playConfig} />
    </div>
  )
}

export default App
