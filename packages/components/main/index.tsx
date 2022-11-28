import '../../asset/main.scss'
import { Layout } from '../layout'
// import { versionStore } from '../../store/version'
// import { depsStore } from '../../store/deps'
import Editor from '../editor'
import Output from '../output'

export const PlayMain = () => {
  // const handleClick = () => {
  //   console.log(versionStore.uiVersion)
  //   console.log(depsStore)
  // }
  // console.log(depsStore)

  // TODO：layout
  const layout = 'h'
  return (
    <div className="play-container">
      <Layout layout={layout} left={Editor()} right={Output()} />
    </div>
  )
}
