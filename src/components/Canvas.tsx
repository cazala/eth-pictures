import React, { useState, useEffect, useCallback, useRef } from 'react'
import { ResizableBox } from 'react-resizable'
import { AutoSizer } from 'react-virtualized'
import { SketchField, Tools, ISketch } from 'react-sketch'
import useMousetrap from 'react-hook-mousetrap'

import { useIPFS } from '../hooks/ipfs'
import { useEth } from '../hooks/eth'
import { useNavigate } from '../hooks/router'
import { ContrastContext, getContrast } from '../lib/contrast'
import { isMobile } from '../lib/mobile'
import { getMetadataUrl, getInfuraUrl } from '../lib/url'
import { ColorPicker } from './ColorPicker'
import { StrokePicker } from './StrokePicker'
import { ToolPicker } from './ToolPicker'
import { AddImage } from './AddImage'
import { AddText } from './AddText'

import loaderIcon from '../images/loader.svg'
import successIcon from '../images/success-standard.svg'
import walletIcon from '../images/wallet.svg'
import errorIcon from '../images/error.svg'

import './Canvas.css'
import { toBuffer } from '../lib/canvas'

const INITIAL_WIDTH = 1024
const INITIAL_HEIGHT = 768
const HORIZONTAL_PADDING = 24
const VERTICAL_PADDING = 72
const DEFAULT_BACKGROUND = '#FFFFFF'
const LOCAL_STORAGE_KEY = 'eth-pictures-draft'

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
      '#9900EF',
    ]
    return color[(color.length * Math.random()) | 0]
  })
  const [background, setBackground] = useState(DEFAULT_BACKGROUND)
  const [tool, setTool] = useState(Tools.Pencil)
  const [stroke, setStroke] = useState(5)
  const [isDirty, setDirty] = useState(false)
  const [didErrorOcurr, setDidErrorOcurr] = useState(false)
  const [isQuotaExceeded, setQuotaExceeded] = useState(false)
  const [shouldTriggerSubmit, setShouldTriggerSubmit] = useState(false)
  let {
    upload,
    hash,
    isUploading,
    error: ipfsError,
    reset: resetIpfs,
  } = useIPFS()
  let {
    mint,
    isWaiting,
    isSent,
    walletNotDetected,
    error: ethError,
    reset: resetEth,
  } = useEth()

  // constants
  const error = ipfsError || ethError
  const hasOverlay =
    isUploading || isWaiting || isSent || !!error || walletNotDetected
  const isUploaded = !!hash
  const isLocked = isUploaded || hasOverlay
  const isMenuVisible = (isDirty && !hasOverlay) || didErrorOcurr

  // refs
  const sketch = useRef<ISketch | null>(null)

  // callbacks
  const onClear = useCallback(() => {
    resetIpfs()
    resetEth()
    setDidErrorOcurr(false)
    setDirty(false)
    sketch.current && sketch.current.clear()
    setBackground(DEFAULT_BACKGROUND)
    localStorage.removeItem(LOCAL_STORAGE_KEY)
  }, [resetIpfs, resetEth, sketch])

  const onSave = useCallback(() => {
    // save draft
    try {
      sketch.current &&
        localStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify(sketch.current!.toJSON())
        )
      setQuotaExceeded(false)
    } catch (e) {
      setQuotaExceeded(true)
    }
  }, [sketch])

  const onSubmit = useCallback(async () => {
    setDidErrorOcurr(false)

    // if the Select tool is on, disable it and set the shouldTriggerSubmit flag, that will trigger an effect to re-submit
    if (tool === Tools.Select || 1 > 0) {
      setTool(Tools.Pencil)
      // Unselect by removing and undoing
      if (sketch.current) {
        // save before
        onSave()
        // remove selected element (if any)
        const history = sketch.current._history.undoList.length
        sketch.current.removeSelected()
        const newHistory = sketch.current._history.undoList.length
        // if history changed, it means something was selected (and deleted), so undo and re-submit
        if (history !== newHistory) {
          sketch.current.undo()
          setShouldTriggerSubmit(true)
          return
        }
      }
    }

    if (!isUploaded) {
      const canvas = document.querySelector('canvas') as HTMLCanvasElement
      const buffer = await toBuffer(canvas)
      upload(buffer)
    } else {
      mint(getMetadataUrl(hash!))
    }
  }, [upload, isUploaded, mint, hash, tool, onSave])

  const onReset = useCallback(() => {
    resetIpfs()
    resetEth()
    setDidErrorOcurr(true)
  }, [resetIpfs, resetEth])

  const onDirty = useCallback(() => !isSent && setDirty(true), [isSent])

  const onGallery = useNavigate('/gallery')

  const onUndo = useCallback(() => sketch.current && sketch.current.undo(), [
    sketch,
  ])

  const onRedo = useCallback(() => sketch.current && sketch.current.redo(), [
    sketch,
  ])

  const onCopy = useCallback(() => sketch.current && sketch.current.copy(), [
    sketch,
  ])

  const onPaste = useCallback(() => sketch.current && sketch.current.paste(), [
    sketch,
  ])

  const onDelete = useCallback(
    () => sketch.current && sketch.current.removeSelected(),
    [sketch]
  )

  const onAddText = useCallback(
    (text: string) => {
      sketch.current && sketch.current.addText(text)
      setDirty(true)
      setTool(Tools.Select)
    },
    [sketch]
  )

  const onAddImage = useCallback(
    (dataUrl: string) => sketch.current && sketch.current.addImg(dataUrl),
    [sketch]
  )

  // keyboard
  const isMac = navigator.platform === 'MacIntel'
  const command = isMac ? 'command' : 'ctrl'
  useMousetrap(`${command}+z`, onUndo)
  useMousetrap(`${command}+shift+z`, onRedo)
  useMousetrap(`${command}+c`, onCopy)
  useMousetrap(`${command}+v`, onPaste)
  useMousetrap('backspace', onDelete)
  useMousetrap('del', onDelete)

  // effects
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
      localStorage.removeItem(LOCAL_STORAGE_KEY)
    }
  }, [isSent])

  // restore draft
  useEffect(() => {
    if (sketch.current && !isUploaded) {
      const data = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (data) {
        const draft = JSON.parse(data)
        sketch.current.fromJSON(draft)
        setDirty(true)
        if (draft.background) {
          setBackground(draft.background)
        }
      }
    }
  }, [sketch, setBackground, isUploaded])

  // confirm before closing the window
  useEffect(() => {
    window.onbeforeunload = () => (isDirty && isQuotaExceeded ? true : null) // ask for confirmation
    return () => {
      window.onbeforeunload = () => null // stop asking for confirmation
    }
  }, [isDirty, isQuotaExceeded])

  // re-submit after disabling select tool
  useEffect(() => {
    if (shouldTriggerSubmit) {
      setShouldTriggerSubmit(false)
      requestAnimationFrame(() => onSubmit())
    }
  }, [shouldTriggerSubmit, onSubmit])

  return (
    <div className={`Canvas ${tool}`}>
      <AutoSizer>
        {(outter) => {
          const maxWidth = outter.width - HORIZONTAL_PADDING * 2
          const maxHeight = outter.height - VERTICAL_PADDING * 2
          return (
            <div className="center outer">
              <ResizableBox
                width={Math.min(INITIAL_WIDTH, maxWidth)}
                height={Math.min(INITIAL_HEIGHT, maxHeight)}
                axis="both"
                maxConstraints={[maxWidth, maxHeight]}
                minConstraints={[300, 250]}
                lockAspectRatio={isLocked}
              >
                <AutoSizer>
                  {(inner) => (
                    <div
                      className="center inner"
                      onMouseUp={onDirty}
                      onTouchEnd={onDirty}
                    >
                      {isUploaded ? (
                        <img
                          className="preview"
                          src={getInfuraUrl(hash!)}
                          width={inner.width}
                          height={inner.height}
                          alt="preview"
                        />
                      ) : (
                        <SketchField
                          width={`${inner.width}px`}
                          height={`${inner.height}px`}
                          tool={tool}
                          lineColor={color}
                          fillColor={color}
                          lineWidth={stroke}
                          backgroundColor={background}
                          ref={sketch as any}
                          onChange={onSave}
                          widthCorrection={0}
                          heightCorrection={0}
                        />
                      )}
                      {hasOverlay ? (
                        <div className="overlay">
                          {isUploading && (
                            <>
                              <img
                                className="spinner"
                                src={loaderIcon}
                                alt="loading"
                              />
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
                              <img
                                className="spinner"
                                src={loaderIcon}
                                alt="loading"
                              />
                              <p className="status">
                                Waiting for confirmation&hellip;
                              </p>
                            </>
                          )}
                          {isSent && (
                            <>
                              <img
                                className="success"
                                src={successIcon}
                                alt="success"
                              />
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
                              <img
                                className="info"
                                src={walletIcon}
                                alt="info"
                              />
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
                                      href="https://wallet.coinbase.com/"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      Coinbase Wallet
                                    </a>{' '}
                                    app.
                                  </>
                                )}
                              </p>
                            </>
                          )}
                          {error && (
                            <>
                              <img
                                className="error"
                                src={errorIcon}
                                alt="error"
                              />
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
                          <ContrastContext.Provider
                            value={getContrast(background)}
                          >
                            <ToolPicker value={tool} onChange={setTool} />
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
                            <StrokePicker
                              stroke={stroke}
                              onChange={setStroke}
                            />
                            <AddImage onAdd={onAddImage} />
                            <AddText onAdd={onAddText} />
                          </ContrastContext.Provider>
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
                    </div>
                  )}
                </AutoSizer>
              </ResizableBox>
            </div>
          )
        }}
      </AutoSizer>
    </div>
  )
}
