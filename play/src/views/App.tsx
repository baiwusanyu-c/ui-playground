
import '../assets/scss/App.css'
import { PlayGround } from 'ui-playground-pkg'
import { demoEp } from '../../../docs/demo/element-plus/demo-ep'
const playConfig = demoEp()

const App = () => {
  return (
    <div className="App">
      <PlayGround config={playConfig} />
    </div>
  )
}

export default App
