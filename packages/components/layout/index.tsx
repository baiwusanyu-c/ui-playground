import '../../asset/layout.css'
import PropTypes from 'prop-types'
import React, { useEffect, useMemo, useState } from 'react'
import type { MouseEvent } from 'react'
import type { elType } from '../../utils/types'

interface ILayoutProps {
  layout?: string
  left?: JSX.Element
  right?: JSX.Element
}
// TODO: 拖拽卡死
export const Layout = (props: ILayoutProps) => {
  const [isVertical, setVertical] = useState(props.layout === 'vertical')
  let className = ''
  const setClassName = () => {
    const classOption = {
      'split-pane': true,
      'dragging': false, // TODO: 布局央视
      'show-output': false, // TODO: 布局央视
      'vertical': false, // TODO: 布局央视
    }
    const classOptionKeys = Object.keys(classOption)
    classOptionKeys.forEach((val, index) => {
      if (classOption[val as keyof typeof classOption])
        className = `${className} ${classOptionKeys[index]}`
    })
  }
  setClassName()

  useEffect(() => {
    setVertical(props.layout === 'vertical')
    setClassName()
  }, [props.layout, setClassName])

  let startPosition = 0
  let startSplit = 0

  const [state, setState] = useState({
    dragging: false,
    split: 50,
  })

  const boundSplit = useMemo(() => {
    const { split } = state
    return split < 20 ? 20 : split > 80 ? 80 : split
  }, [state])

  function dragStart(e: MouseEvent<HTMLElement>) {
    e.preventDefault()
    setState({ ...state, dragging: true })
    startPosition = isVertical ? e.pageY : e.pageX
    startSplit = boundSplit
  }

  const container = React.createRef()
  function dragMove(e: MouseEvent<HTMLElement>) {
    if (state.dragging) {
      const position = isVertical ? e.pageY : e.pageX
      const totalSize = isVertical
        ? (container?.current as HTMLElement).offsetHeight
        : (container?.current as HTMLElement).offsetWidth
      const dp = position - startPosition
      setState({ ...state, split: startSplit + ~~((dp / totalSize) * 100) })
    }
  }

  function dragEnd() {
    setState({ ...state, dragging: false })
  }

  const { left, right } = props
  // TODO：showOutput
  const [showOutput, setShowOutput] = useState(true)
  const handleClick = () => {
    setShowOutput(!showOutput)
  }
  return (
    <div
      onMouseMove={dragMove}
      onMouseUp={dragEnd}
      onMouseLeave={dragEnd}
      className={className}
      ref={container as elType}
    >
      <div className="left" style={{ [isVertical ? 'height' : 'width']: `${boundSplit}%` }}>
        { left }
        <div className="dragger" onMouseDown={dragStart} />
      </div>

      <div className="right" style={{ [isVertical ? 'height' : 'width']: `${100 - boundSplit}%` }}>
        { right }
      </div>

      <button className="toggler" onClick={handleClick}>
        { showOutput ? '< Code' : 'Output >' }
      </button>
    </div>
  )
}
Layout.propTypes = {
  layout: PropTypes.string,
  left: PropTypes.element,
  right: PropTypes.element,
}
Layout.defaultProps = {
  layout: 'vertical',
  left: undefined,
  right: undefined,
}
