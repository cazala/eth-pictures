import * as blobToBuffer from 'blob-to-buffer'

export async function toBuffer(canvas: HTMLCanvasElement) {
  return new Promise<Buffer>((resolve, reject) =>
    canvas.toBlob((blob) =>
      blobToBuffer(blob, (err: string | null, buffer: Buffer) =>
        err ? reject(err) : resolve(buffer)
      )
    )
  )
}
