import React, { useState, useCallback } from 'react'
import InfiniteScroll from 'react-infinite-scroller'

import { useOpenSea } from '../hooks/opensea'
import { Asset, OPEANSEA_URL } from '../lib/opensea'
import { CONTRACT_ADDRESS } from '../lib/eth'
import { useEth } from '../hooks/eth'

import closeIcon from '../images/close.svg'

import './Gallery.css'

const format = (price: number) =>
  '$' + Number(price.toFixed(2)).toLocaleString()

const areEqual = (a: string | null, b: string | null) =>
  !!a && !!b && a.toLowerCase() === b.toLowerCase()

export const Picture: React.FC<{
  asset: Asset
  isOwner: boolean
  onClick: (asset: Asset) => void
}> = ({ asset, isOwner, onClick }) => {
  return (
    <div
      className="Picture col-4 col-3-md col-2-lg"
      onClick={useCallback(() => onClick(asset), [asset])}
    >
      <img src={asset.image} />
      {asset.price && <div className="price">{format(asset.price)}</div>}
      {isOwner ? <div className="tag is-small">It's Yours</div> : null}
    </div>
  )
}

export const Gallery: React.FC = () => {
  const [selected, setSelected] = useState<Asset | null>(null)
  const { assets, hasMore, loadPage } = useOpenSea()
  const { address } = useEth()
  const isOwner = selected && areEqual(address, selected.owner)
  return (
    <div className={`Gallery ${selected ? 'lock' : ''}`}>
      <InfiniteScroll
        pageStart={0}
        loadMore={loadPage}
        hasMore={hasMore}
        loader={
          <div className="loader" key={0}>
            Loading ...
          </div>
        }
        useWindow={false}
      >
        <div className="container">
          <div className="row">
            {assets.map(asset => (
              <Picture
                key={asset.id}
                asset={asset}
                onClick={setSelected}
                isOwner={areEqual(address, asset.owner)}
              />
            ))}
          </div>
        </div>
      </InfiniteScroll>
      {selected && (
        <div className="overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <img
              className="close"
              src={closeIcon}
              onClick={() => setSelected(null)}
            ></img>
            <div
              className="image"
              style={{ backgroundImage: `url(${selected.image})` }}
            ></div>
            <p className="owner">
              <b>Owner:</b>{' '}
              {isOwner
                ? 'You!'
                : selected.owner.slice(0, 6) + '...' + selected.owner.slice(-4)}
            </p>
            <div className="buy">
              <div className="price">
                {selected.price ? format(selected.price) : null}
              </div>
              <a
                className="button outline"
                href={`${OPEANSEA_URL}/assets/${CONTRACT_ADDRESS}/${selected.id}`}
                target="_blank"
              >
                {selected.price
                  ? isOwner
                    ? `For Sale`
                    : `Buy`
                  : isOwner
                  ? `Sell`
                  : `Bid`}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
