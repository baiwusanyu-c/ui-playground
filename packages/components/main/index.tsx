import '../../asset/main.scss'
import { Layout } from '../layout'
// import { versionStore } from '../../store/version'
// import { depsStore } from '../../store/deps'
import Editor from '../editor'
function testE() {
  return <div style={{ width: '50%' }}></div>
}
export function PlayMain() {
  // const handleClick = () => {
  //   console.log(versionStore.uiVersion)
  //   console.log(depsStore)
  // }
  // console.log(depsStore)

  // TODO：layout
  const layout = 'h'
  return (
    <div className="vue-repl">
      <Layout layout={layout} left={Editor()} right={testE()}/>
    </div>
  )
}
