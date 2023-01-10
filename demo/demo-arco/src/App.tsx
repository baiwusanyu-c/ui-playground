import { PlayGround } from 'ui-playground'
import { demoArco } from './arco-design-vue/demo-arco'
const playConfig = demoArco()
playConfig.useUno = false
playConfig.isSSR = false
const App = () => {
  return (
    <div className="App">
      <PlayGround config={playConfig} />
    </div>
  )
}
export default App
