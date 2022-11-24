import '../../asset/output.scss'
import {useEffect, useState} from 'react'
import { CodeMirror } from '../code-mirror'
import { fileStore } from '../../store/file'
import { OutputSelector } from './output-selector'
import {useEventEmitter} from "ahooks";
import {outputType} from "../../utils/types";
import evtBus from "../../utils/event-bus"
export default function output() {

  const [curTab, setCurTab] = useState<outputType | 'preview'>('preview')
  const [outMode, setOutputMode] = useState('htmlmixed')
  const setOutputModeCall = () => {
    const { filename } = fileStore.activeFile
    const res = filename.endsWith('.vue') || filename.endsWith('.html')
      ? 'htmlmixed'
      : filename.endsWith('.css')
        ? 'css'
        : 'javascript'
    setOutputMode(res)
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

  // 接受来自 editor 交互的通知信息
  const receiveEvtFromEditor = () =>{
    setOutputModeCall()
    setOutputCodeCall()
  }
  evtBus.on('editorMessage',receiveEvtFromEditor)

  return (
    <>
      <OutputSelector event$={event$}></OutputSelector>
      <div className="output-container">
        {curTab === 'preview' ?
          <div>
          preview
          </div> :
          <CodeMirror readonly={true}
                    mode={outMode}
                    value={outputCode} />}

      </div>
    </>
  )
}
