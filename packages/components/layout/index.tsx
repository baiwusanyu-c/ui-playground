import '../../assets/layout.scss'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useSafeState } from 'ahooks'
import type { MouseEvent } from 'react'
import type { elType } from '../../utils/types'

interface ILayoutProps {
  layout?: string
  left?: JSX.Element
  right?: JSX.Element
}

export const Layout = (props: ILayoutProps) => {
  const [isVertical, setVertical] = useState(props.layout === 'vertical')
  const [className, setClassname] = useState('')
  const [state, setState] = useState({
    dragging: false,
    split: 50,
  })
  const [showOutput, setShowOutput] = useState(false)
  const handleClick = () => {
    setShowOutput(!showOutput)
  }
  useEffect(() => {
    setVertical(props.layout === 'vertical')
    const classOption = {
      'split-pane': true,
      'dragging': state.dragging,
      'show-output': showOutput,
      'vertical': isVertical,
    }
    const classOptionKeys = Object.keys(classOption)
    let name = ''
    classOptionKeys.forEach((val, index) => {
      if (classOption[val as keyof typeof classOption])
        name = `${name} ${classOptionKeys[index]}`
    })
    setClassname(name)
  }, [props.layout, state, showOutput, isVertical])

  let startPosition = 0
  let startSplit = 0

  const [boundSplit, setBoundSplit] = useSafeState(20)
  useEffect(() => {
    const { split } = state
    setBoundSplit(split < 20 ? 20 : split > 80 ? 80 : split)
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
