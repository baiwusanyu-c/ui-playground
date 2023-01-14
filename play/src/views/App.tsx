
import '../assets/scss/App.css'
import { PlayGround } from 'ui-playground'
import { demoPu } from '../demo-pure/demo-pure'
const playConfig = demoPu()
playConfig.isSSR = true

const App = () => {
  return (
    <div className="App">
      <PlayGround config={playConfig} />
    </div>
  )
}

export default App
