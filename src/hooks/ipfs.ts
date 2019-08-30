import { useState, useCallback } from 'react'
import { upload as uploadToIpfs } from '../lib/ipfs'

export function useIPFS() {
  // state
  const [hash, setHash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setUploading] = useState(false)

  // functions
  const upload = useCallback(async (buffer: Buffer) => {
    setUploading(true)
    try {
      const hash = await uploadToIpfs(buffer)
      setHash(hash)
    } catch (e) {
      setError(e.message)
    }
    setUploading(false)
  }, [])

  return {
    hash,
    isUploading,
    error,
    upload,
    reset() {
      setUploading(false)
      setError(null)
      setHash(null)
    }
  }
}
