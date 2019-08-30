import { useState, useCallback, useEffect } from 'react'
import { mint as mintToken, NO_WALLET_ERROR, getAddress } from '../lib/eth'

export function useEth() {
  const [address, setAddress] = useState<string | null>(null)
  const [isWaiting, setWaiting] = useState(false)
  const [isSent, setSent] = useState(false)
  const [walletNotDetected, setWalletNotDetected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reset = useCallback(() => {
    setWaiting(false)
    setSent(false)
    setWalletNotDetected(false)
    setError(null)
  }, [])

  const mint = useCallback(async (tokenUri: string) => {
    setWaiting(true)
    setSent(false)
    setError(null)
    try {
      await mintToken(tokenUri)
      setSent(true)
    } catch (e) {
      if (e.message === NO_WALLET_ERROR) {
        setWalletNotDetected(true)
      } else {
        setError(e.message)
      }
    } finally {
      setWaiting(false)
    }
  }, [])

  useEffect(() => {
    getAddress().then(address => setAddress(address))
  }, [])

  return {
    address,
    isWaiting,
    isSent,
    error,
    reset,
    mint,
    walletNotDetected
  }
}
