import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useMount } from 'ahooks'
import { debounce } from '../../utils'
import codeMirrorInst from './codemirror'
import type { elType } from '../../utils/types'

interface ICodeMirrorProps {
  mode?: string
  value?: string
  readonly?: boolean
  show?: boolean
  change?: Function
}

export const CodeMirror = (props: ICodeMirrorProps) => {
  const option = {
    autoCloseBrackets: true, // 输入时自动关闭括号和引号
    autoCloseTags: true, // 自定闭合标签
    foldGutter: true, // 配合 gutters 折叠代码
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
  }
  const el = React.createRef()
  const setCodeMirror = () => {
    const curVal = el?.current as HTMLElement
    if (!curVal)
      return
    // 通过 CodeMirror 创建编辑器
    const editor = codeMirrorInst(
      curVal, // 编辑器挂载的 dom
      {
        value: '', // 代码内容
        mode: props.mode, // 代码语言
        readOnly: props.readonly, // 是否只读
        tabSize: 2,
        lineWrapping: true, // 自动换行或滚动条
        lineNumbers: true, // 行号
        ...option,
      })

    // 触发 change，拿到 editor 内容(就是编辑器内的代码)
    editor.on('change', () => {
      props.change && props.change(editor.getValue())
    })

    setTimeout(() => {
      editor.refresh()
    }, 50)

    // 尺寸
    window.addEventListener(
      'resize',
      debounce(() => {
        editor.refresh()
      }),
    )
    return editor
  }

  const [editorInst, setEditorInst] = useState(setCodeMirror())
  useMount(() => {
    setEditorInst(setCodeMirror())
  })
  useEffect(() => {
    // 监听mode
    editorInst && editorInst!.setOption('mode', props.mode)
  }, [props.mode, editorInst])

  useEffect(() => {
    // 监听输入的代码
    const cur = editorInst && editorInst!.getValue()
    if (props.value !== cur)
      editorInst && editorInst!.setValue(props.value!)
  }, [props.value, editorInst])

  return (<div
    className="editor"
    ref={el as elType}
    style={{ display: !props.show ? 'none' : 'initial' }}
          />)
}

CodeMirror.propTypes = {
  mode: PropTypes.string,
  value: PropTypes.string,
  readonly: PropTypes.bool,
  change: PropTypes.func,
  show: PropTypes.bool,
}
CodeMirror.defaultProps = {
  mode: 'htmlmixed',
  value: '',
  show: true,
  readonly: false,
  change: () => {},
}
