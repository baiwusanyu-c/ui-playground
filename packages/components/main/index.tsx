import '../../assets/main.scss'
import { Layout } from '../layout'
import Editor from '../editor'
import Output from '../output'
interface IPlayMainProps {
  vertical: boolean
  isSSR: boolean
  useUno: boolean
}
export const PlayMain = (props: IPlayMainProps) => {
  return (
    <div className="play-container">
      <Layout
        layout={props.vertical ? 'vertical' : ''}
        left={Editor()}
        right={Output({
          ssr: props.isSSR,
          uno: props.useUno,
        })}
      />
    </div>
  )
}
