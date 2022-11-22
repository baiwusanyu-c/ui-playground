import '../../asset/main.css'
import { Layout } from '../layout'
import { versionStore } from '../../store/version'
import { depsStore } from '../../store/deps'

function testE() {
  return <div style={{ width: '50%' }}></div>
}
export function PlayMain() {
  const handleClick = () => {
    console.log(versionStore.uiVersion)
    console.log(depsStore)
  }
  console.log(depsStore)

  // TODO：layout
  const layout = 'h'
  return (
    <div className="vue-repl" onClick={handleClick}>
      <Layout layout={layout} left={testE()} right={testE()}/>
    </div>
  )
}
