
import '../assets/scss/App.css'
import { PlayGround } from 'ui-playground'
import { demoAntd } from '../../../docs/demo/ant-design-vue/demo-antd'
const playConfig = demoAntd()

const App = () => {
  return (
    <div className="App">
      <PlayGround config={playConfig} />
    </div>
  )
}

export default App
