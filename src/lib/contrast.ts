import React from 'react'

export enum Contrast {
  BLACK = '0x000000',
  WHITE = '0xffffff',
}

export const getContrast = (color: string) => {
  const r = parseInt(color.slice(1, 3), 16)
  const g = parseInt(color.slice(3, 5), 16)
  const b = parseInt(color.slice(5, 7), 16)
  var contrast =
    (Math.round(r * 299) + Math.round(g * 587) + Math.round(b * 114)) / 1000
  return contrast >= 128 ? Contrast.BLACK : Contrast.WHITE
}

export const ContrastContext = React.createContext(Contrast.WHITE)
