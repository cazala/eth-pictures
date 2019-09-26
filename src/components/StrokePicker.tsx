import React from 'react'
import Slider from 'rc-slider'

import './StrokePicker.css'
import { useToggle } from '../hooks/ui'

export type Props = {
  stroke: number
  min?: number
  max?: number
  onChange: (size: number) => void
}

export const StrokePicker: React.FC<Props> = ({
  stroke,
  min,
  max,
  onChange
}) => {
  const { isOpen, toggle, stopPropagation } = useToggle()

  return (
    <div className="StrokePicker" onMouseDown={stopPropagation}>
      <div className="current" onClick={toggle}>
        <div
          className="size"
          style={{
            // +2 for border
            width: stroke + 2,
            height: stroke + 2
          }}
        />
      </div>
      {isOpen && (
        <Slider
          min={min}
          max={max}
          step={1}
          value={stroke}
          onChange={onChange}
        />
      )}
    </div>
  )
}

StrokePicker.defaultProps = {
  min: 3,
  max: 24
}
