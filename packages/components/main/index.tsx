import '../../asset/main.css'
import { Layout } from '../layout'

function testE() {
  return <div style={{ width: '50%' }}></div>
}
export function PlayMain() {
  // TODO：layout
  const layout = 'h'
  return (
    <div className="vue-repl">
      <Layout layout={layout} left={testE()} right={testE()}/>
    </div>
  )
}
