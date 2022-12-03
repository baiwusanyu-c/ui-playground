
import '../assets/scss/App.css'
import { PlayGround } from 'ui-playground'
import { demoArco } from '../../../docs/demo/arco-design-vue/demo-arco'
const playConfig = demoArco()

const App = () => {
  return (
    <div className="App">
      <PlayGround config={playConfig} />
    </div>
  )
}

export default App
