import '../../asset/editor.scss'
import { useState } from 'react'
import { useEventEmitter } from 'ahooks'
import { CodeMirror } from '../code-mirror'
import { debounce } from '../../utils'
import { fileStore } from '../../store/file'
import { FileSelector } from './file-selector'

export default function editor() {
  // 获取 CodeMirror 编辑器传来的当前选择的虚拟文件代码内容
  const handleChange = debounce((code: string) => {
    // 更新到 store 中的当前文件代码属性上
    fileStore.activeFile.code = code
    fileStore.updatedFilesByActive()
    console.log(fileStore)
  }, 250)

  // 计算获取当前选择虚拟文件的文件类型
  const [activeMode, setActiveMode] = useState('htmlmixed')
  const setActiveModeCall = () => {
    const { filename } = fileStore.activeFile
    const res = filename.endsWith('.vue') || filename.endsWith('.html')
      ? 'htmlmixed'
      : filename.endsWith('.css')
        ? 'css'
        : 'javascript'
    setActiveMode(res)
  }
  const [activeCode, setActiveCode] = useState(fileStore.activeFile.code)
  const setActiveCodeCall = () => {
    setActiveCode(fileStore.activeFile.code)
  }

  // 当新增、删除、选择新的 activeFile时，更新编辑
  const event$ = useEventEmitter()
  event$.useSubscription(() => {
    setActiveModeCall()
    setActiveCodeCall()
  })
  return (
    <>
      <FileSelector event$={event$}></FileSelector>
      <div className="editor-container">
        <CodeMirror change={handleChange}
                    mode={activeMode}
                    value={activeCode} />
      </div>
    </>
  )
}
