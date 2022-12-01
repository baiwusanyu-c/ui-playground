import '../../asset/output.scss'
import {useEffect, useState} from 'react'
import { CodeMirror } from '../code-mirror'
import { fileStore } from '../../store/file'
import { OutputSelector } from './output-selector'
import {useEventEmitter} from "ahooks";
import {outputType} from "../../utils/types";
import evtBus from "../../utils/event-bus"
import Preview from "./preview";
interface IOutputProps {
  ssr: boolean
}
export default function output(props: IOutputProps) {

  const [curTab, setCurTab] = useState<outputType | 'preview'>('preview')
  const [outMode, setOutputMode] = useState('htmlmixed')
  const setOutputModeCall = () => {
    setOutputMode(curTab === 'css' ? 'css' : 'javascript')
  }

  const [outputCode, setOutputCode] = useState('')
  const setOutputCodeCall = () => {
    const compiledCode = fileStore.activeFile.compiled[curTab as outputType]
    setOutputCode(compiledCode)
  }


  const event$ = useEventEmitter<outputType | 'preview'>()
  event$.useSubscription((type: outputType | 'preview') => {
    setCurTab(type)
  })
  useEffect(()=>{
    if(curTab !== 'preview'){
      setOutputModeCall()
      setOutputCodeCall()
    }
  },[curTab])

  const receiveEvtFromEditor = () =>{
    setOutputModeCall()
    setOutputCodeCall()
  }
  // 接受来自 editor 交互的通知信息
  evtBus.on('editorMessage',receiveEvtFromEditor)
  // 接受来自 fileStore 交互的通知信息,更新 output
  evtBus.on('fileMessage',receiveEvtFromEditor)

  return (
    <>
      <OutputSelector event$={event$}></OutputSelector>
      <div className="output-container">
          <Preview ssr={props.ssr} show={curTab === 'preview'}/>
          <CodeMirror readonly={true}
                    mode={outMode}
                    show={curTab !== 'preview'}
                    value={outputCode} />
      </div>
    </>
  )
}
