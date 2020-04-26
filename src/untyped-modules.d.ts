declare module 'ipfs-http-client'
declare module 'react-hook-mousetrap'
declare module 'data-uri-to-buffer'
declare module 'blob-to-buffer'
declare module 'react-sketch' {
  interface ISketchJSON {
    version: string
    objects: any[]
    background: string
  }

  interface ISketch {
    clear: () => void
    undo: () => void
    redo: () => void
    copy: () => void
    paste: () => void
    removeSelected: () => void
    canUndo: () => boolean
    canRedo: () => boolean
    toJSON: () => ISketchJSON
    fromJSON: (json: ISketchJSON) => void
    addText: (text: string) => void
    addImg: (dataUrl: string) => void
    _history: { undoList: string[] }
  }

  class SketchField extends React.Component<any> {}

  enum Tools {
    Circle = 'circle',
    Line = 'line',
    Arrow = 'arrow',
    Pencil = 'pencil',
    Rectangle = 'rectangle',
    RectangleLabel = 'rectangle-label',
    Select = 'select',
    Pan = 'pan',
    DefaultTool = 'default-tool',
  }

  export { SketchField, ISketch, Tools }
}
