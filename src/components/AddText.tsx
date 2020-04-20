import React, { useContext } from 'react'
import { ContrastContext } from '../lib/contrast'
import { icons } from '../icons/icons'

import './AddText.css'

const DEFAULT_TEXT = 'Text'

type Props = {
  onAdd: (text: string) => void
}

export const AddText: React.FC<Props> = ({ onAdd }) => {
  const contrast = useContext(ContrastContext)
  return (
    <div className="AddText" onClick={() => onAdd(DEFAULT_TEXT)}>
      <img src={icons[contrast].text} title="Add text" alt="Add text"></img>
    </div>
  )
}
