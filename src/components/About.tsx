import React from 'react'

import './About.css'

export const About: React.FC = () => {
  return (
    <div className="About">
      <div>
        <header>What's this?</header>
        <p>
          This tool is an experiment I made to use decentralized infrastructure.
        </p>
        <p>
          The images are uploaded to{' '}
          <a href="https://ipfs.io" target="_blank" rel="noreferrer noopener">
            IPFS
          </a>
          , and an NFT (non-fungible token) is minted in the{' '}
          <a
            href="https://ethereum.org"
            target="_blank"
            rel="noreferrer noopener"
          >
            Ethereum
          </a>{' '}
          blockchain to represent each picture.
        </p>
        <p>Each token is ownable, transferrable, tradable and unique.</p>
        <p>
          The gallery data is pulled from{' '}
          <a
            href="https://opensea.io"
            target="_blank"
            rel="noreferrer noopener"
          >
            OpenSea
          </a>
          's API.
        </p>
      </div>
    </div>
  )
}
