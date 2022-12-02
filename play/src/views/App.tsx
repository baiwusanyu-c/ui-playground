import '../assets/scss/App.css'
import { PlayGround, getPlayPreset } from 'ui-playground-pkg'

const playConfig = getPlayPreset('vue')
playConfig.headerOption.useVersion = true
const App = () => {
  return (
    <div className="App">
      <PlayGround config={playConfig} />
    </div>
  )
}

export default App
