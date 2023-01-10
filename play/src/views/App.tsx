
import '../assets/scss/App.css'
import { PlayGround } from 'ui-playground'
import { demoEp } from '../../../docs/demo/element-plus/demo-ep'
const playConfig = demoEp()
playConfig.useUno = false
playConfig.isSSR = false
playConfig.headerOption.dark = true

console.log(playConfig)
const App = () => {
  return (
    <div className="App">
      <PlayGround config={playConfig} />
    </div>
  )
}

export default App
