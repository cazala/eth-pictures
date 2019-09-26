import React, { useState, useEffect, useCallback } from 'react'
import { ResizableBox } from 'react-resizable'
import { AutoSizer } from 'react-virtualized'
import { SketchField, Tools } from 'react-sketch'
import * as dataUriToBuffer from 'data-uri-to-buffer'

import { useIPFS } from '../hooks/ipfs'
import { useEth } from '../hooks/eth'
import { useNavigate } from '../hooks/router'
import { getMetadataUrl, getInfuraUrl } from '../lib/url'
import { ColorPicker } from './ColorPicker'
import { StrokePicker } from './StrokePicker'
import { isMobile } from '../lib/mobile'

import loaderIcon from '../images/loader.svg'
import successIcon from '../images/success-standard.svg'
import walletIcon from '../images/wallet.svg'
import errorIcon from '../images/error.svg'

import './Canvas.css'

export const Canvas: React.FC = () => {
  // state
  const [color, setColor] = useState(() => {
    const color = [
      '#FF6900',
      '#FCB900',
      '#7BDCB5',
      '#00D084',
      '#8ED1FC',
      '#0693E3',
      '#ABB8C3',
      '#EB144C',
      '#F78DA7',
      '#9900EF'
    ]
    return color[(color.length * Math.random()) | 0]
  })
  const [background, setBackground] = useState('#FFFFFF')
  const [stroke, setStroke] = useState(5)
  const [isDirty, setDirty] = useState(false)
  const [didErrorOcurr, setDidErrorOcurr] = useState(false)
  const [isMounted, setMounted] = useState(true)
  let {
    upload,
    hash,
    isUploading,
    error: ipfsError,
    reset: resetIpfs
  } = useIPFS()
  let {
    mint,
    isWaiting,
    isSent,
    walletNotDetected,
    error: ethError,
    reset: resetEth
  } = useEth()

  // constants
  const error = ipfsError || ethError
  const hasOverlay =
    isUploading || isWaiting || isSent || !!error || walletNotDetected
  const isUploaded = !!hash
  const isLocked = isUploaded || hasOverlay
  const isMenuVisible = (isMounted && isDirty && !hasOverlay) || didErrorOcurr

  // callbacks
  const onClear = useCallback(() => {
    resetIpfs()
    resetEth()
    setDidErrorOcurr(false)
    setDirty(false)
    setMounted(false)
  }, [resetIpfs, resetEth])

  const onSubmit = useCallback(() => {
    setDidErrorOcurr(false)
    if (!isUploaded) {
      const canvas = document.querySelector('canvas') as HTMLCanvasElement
      const data = canvas.toDataURL()
      const buffer = dataUriToBuffer(data)
      upload(buffer)
    } else {
      mint(getMetadataUrl(hash!))
    }
  }, [upload, isUploaded, mint, hash])

  const onReset = useCallback(() => {
    if (ipfsError) {
      resetIpfs()
    }
    if (ethError) {
      resetEth()
    }
    setDidErrorOcurr(true)
  }, [ipfsError, ethError, resetIpfs, resetEth])

  const onDirty = useCallback(() => !isSent && setDirty(true), [isSent])
  const onGallery = useNavigate('/gallery')

  // ----effects

  // reset canvas
  useEffect(() => {
    if (!isMounted) {
      requestAnimationFrame(() => {
        setMounted(true)
      })
    }
  }, [isMounted])

  useEffect(() => {
    // mint token after upload
    if (hash) {
      mint(getMetadataUrl(hash))
    }
  }, [hash, mint])

  // unset dirty flag after success
  useEffect(() => {
    if (isSent) {
      setDirty(false)
    }
  }, [isSent])

  return (
    <div className="Canvas">
      <AutoSizer>
        {outter => (
          <div className="center" onMouseUp={onDirty} onTouchEnd={onDirty}>
            <ResizableBox
              width={600}
              height={400}
              axis="both"
              maxConstraints={[outter.width - 48, outter.height - 200]}
              minConstraints={[300, 250]}
              lockAspectRatio={isLocked}
            >
              <AutoSizer>
                {inner => (
                  <>
                    {isUploaded ? (
                      <img
                        className="preview"
                        src={getInfuraUrl(hash!)}
                        width={inner.width}
                        height={inner.height}
                      />
                    ) : (
                      isMounted && (
                        <SketchField
                          width={`${inner.width}px`}
                          height={`${inner.height}px`}
                          tool={Tools.Pencil}
                          lineColor={color}
                          lineWidth={stroke}
                          backgroundColor={background}
                        />
                      )
                    )}
                    {hasOverlay ? (
                      <div className="overlay">
                        {isUploading && (
                          <>
                            <img className="spinner" src={loaderIcon} />
                            <p className="status">
                              Uploading image to the{' '}
                              <a
                                href="https://ipfs.io"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                InterPlanetary File System
                              </a>
                              .<br />
                              This may take a few seconds&hellip;
                            </p>
                          </>
                        )}
                        {isWaiting && (
                          <>
                            <img className="spinner" src={loaderIcon} />
                            <p className="status">
                              Waiting for confirmation&hellip;
                            </p>
                          </>
                        )}
                        {isSent && (
                          <>
                            <img className="success" src={successIcon} />
                            <p className="status">
                              Your NFT will be minted soon!
                              <br />
                              In the meantime you can check the gallery.
                            </p>
                            <div className="actions">
                              <button
                                className="button clear"
                                onClick={onClear}
                              >
                                Back
                              </button>
                              <button
                                className="button outline"
                                onClick={onGallery}
                              >
                                Gallery
                              </button>
                            </div>
                          </>
                        )}
                        {walletNotDetected && (
                          <>
                            <img className="info" src={walletIcon} />
                            <p className="status">
                              <b>Wallet not found!</b>
                              <br />
                              <br />
                              You need a wallet to interact with the Ethereum
                              blockchain.
                              <br />
                              {!isMobile() ? (
                                <>
                                  You can install the{' '}
                                  <a
                                    href="https://www.meetdapper.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    Dapper
                                  </a>{' '}
                                  wallet.
                                </>
                              ) : (
                                <>
                                  You can install the{' '}
                                  <a
                                    href="https://trustwallet.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    TrustWallet
                                  </a>{' '}
                                  app.
                                </>
                              )}
                            </p>
                          </>
                        )}
                        {error && (
                          <>
                            <img className="error" src={errorIcon} />
                            <p className="error">{error}</p>
                            <button
                              className="button outline"
                              onClick={onReset}
                            >
                              Ok...
                            </button>
                          </>
                        )}
                      </div>
                    ) : (
                      !isUploaded && (
                        <>
                          <ColorPicker
                            className="back"
                            color={background}
                            onChange={setBackground}
                          />
                          <ColorPicker
                            className="front"
                            color={color}
                            onChange={setColor}
                          />
                          <StrokePicker stroke={stroke} onChange={setStroke} />
                        </>
                      )
                    )}
                    {isMenuVisible && (
                      <div className="buttons">
                        <button className="button clear" onClick={onClear}>
                          Clear
                        </button>
                        <button className="button outline" onClick={onSubmit}>
                          Submit
                        </button>
                      </div>
                    )}
                  </>
                )}
              </AutoSizer>
            </ResizableBox>
          </div>
        )}
      </AutoSizer>
    </div>
  )
}
