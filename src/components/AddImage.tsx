import React, { useContext } from 'react'
import { ContrastContext } from '../lib/contrast'
import { icons } from '../icons/icons'

import './AddImage.css'

type Props = {
  onAdd: (dataUrl: string) => void
}

export const AddImage: React.FC<Props> = ({ onAdd }) => {
  const contrast = useContext(ContrastContext)
  return (
    <div className="AddImage">
      <img src={icons[contrast].image} title="Add image" alt="Upload"></img>
      <input
        type="file"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files && e.target.files[0]
          if (file) {
            const reader = new FileReader()
            reader.addEventListener(
              'load',
              () => reader.result && onAdd(reader.result as string)
            )
            reader.readAsDataURL(file)
          }
        }}
      />
    </div>
  )
}
