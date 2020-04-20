import React, { useContext } from 'react'
import { Tools } from 'react-sketch'

import { ContrastContext } from '../lib/contrast'
import { capitalize } from '../lib/text'
import { icons } from '../icons/icons'
import './ToolPicker.css'

export type Props = {
  value: Tools
  onChange: (tool: Tools) => void
}

export type ToolProps = {
  type: Tools
  value: Tools
  onChange: (tool: Tools) => void
}

const Tool: React.FC<ToolProps> = (props) => {
  const { type, value, onChange } = props
  const contrast = useContext(ContrastContext)
  return (
    <div
      title={capitalize(type)}
      className={`Tool ${type} ${type === value ? 'active' : ''}`.trim()}
      onClick={() => onChange(type)}
    >
      <img src={icons[contrast][type]} alt={type} />
    </div>
  )
}

export const ToolPicker: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div className="ToolPicker">
      <Tool type={Tools.Pencil} value={value} onChange={onChange}></Tool>
      <Tool type={Tools.Line} value={value} onChange={onChange}></Tool>
      <Tool type={Tools.Rectangle} value={value} onChange={onChange}></Tool>
      <Tool type={Tools.Circle} value={value} onChange={onChange}></Tool>
      <Tool type={Tools.Pan} value={value} onChange={onChange}></Tool>
      <Tool type={Tools.Select} value={value} onChange={onChange}></Tool>
    </div>
  )
}
