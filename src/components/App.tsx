import React from 'react'
import { Route, Switch } from 'react-router'

import { useNavigate, useLocation } from '../hooks/router'
import { Canvas } from './Canvas'
import { About } from './About'
import { Gallery } from './Gallery'

import githubIcon from '../images/github.svg'
import twitterIcon from '../images/twitter.svg'

import './App.css'

const getItemClass = (current: string, target: string) => {
  return current === target ? 'item active' : 'item'
}

const Item: React.FC<{ pathname: string }> = ({ pathname, children }) => {
  const location = useLocation()
  return (
    <div
      className={getItemClass(location.pathname, pathname)}
      onClick={useNavigate(pathname)}
    >
      {children}
    </div>
  )
}

export const App: React.FC = () => {
  return (
    <>
      <div className="menu">
        <div className="logo"></div>
        <Item pathname="/">Draw</Item>
        <Item pathname="/about">About</Item>
        <Item pathname="/gallery">Gallery</Item>
      </div>
      <Switch>
        <Route exact path="/">
          <Canvas />
        </Route>
        <Route exact path="/about">
          <About />
        </Route>
        <Route exact path="/gallery">
          <Gallery />
        </Route>
      </Switch>
      <div className="social">
        <a
          href="https://github.com/cazala/eth-pictures"
          target="_blank"
          rel="noreferrer noopener"
        >
          <img src={githubIcon}></img>
        </a>
        <a
          href="https://twitter.com/EthPictures"
          target="_blank"
          rel="noreferrer noopener"
        >
          <img src={twitterIcon}></img>
        </a>
      </div>
      <div className="credits">
        by{' '}
        <a href="https://caza.la" target="_blank" rel="noreferrer noopener">
          cazala
        </a>
      </div>
    </>
  )
}
