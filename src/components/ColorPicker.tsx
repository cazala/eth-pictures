import React from 'react'
import { ChromePicker } from 'react-color'
import { useToggle } from '../hooks/ui'

import './ColorPicker.css'

export type Props = {
  className?: string
  color: string
  onChange: (color: string) => void
}

export const ColorPicker: React.FC<Props> = ({
  color,
  className,
  onChange
}) => {
  const isEraser = color.toLowerCase() === '#ffffff'

  const { isOpen, toggle, stopPropagation } = useToggle()

  let classes = 'ColorPicker'
  if (className) {
    classes += ' ' + className
  }

  return (
    <div className={classes} onMouseDown={stopPropagation}>
      <div className="current" onClick={toggle}>
        <div
          className="fill"
          style={{
            backgroundColor: color,
            borderColor: isEraser ? '#d2d6dd' : '#ffffff'
          }}
        />
      </div>
      {isOpen && <ChromePicker color={color} onChange={e => onChange(e.hex)} />}
    </div>
  )
}
