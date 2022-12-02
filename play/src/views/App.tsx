import '../assets/scss/App.css'
import { PlayGround,usePlayPreset } from 'ui-playground-pkg'

const playConfig = usePlayPreset('vue')
playConfig.headerOption.useVersion = true
const App = () => {
  return (
    <div className="App">
      <PlayGround config={playConfig}/>
    </div>
  )
}

export default App
