import '../../asset/main.scss'
import { Layout } from '../layout'
import Editor from '../editor'
import Output from '../output'
interface IPlayMainProps {
  layout: {
    vertical: boolean
  }
}
export const PlayMain = (props: IPlayMainProps) => {
  return (
    <div className="play-container">
      <Layout layout={props.layout.vertical ? 'vertical' : ''} left={Editor()} right={Output()} />
    </div>
  )
}
