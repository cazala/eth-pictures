import { Eth } from 'web3x-es/eth'
import { Address } from 'web3x-es/address'
import { WebsocketProvider } from 'web3x-es/providers'
import { EthPictures } from '../contracts/EthPictures'
import { isMobile } from './mobile'
import { Medianizer } from '../contracts/Medianizer'
import { fromWei } from 'web3x-es/utils'

export const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS
export const INFURA_TOKEN = process.env.REACT_APP_INFURA_TOKEN
export const MEDIANIZER_ADDRESS = '0x729D19f657BD0614b4985Cf1D82531c67569197B'

export const NO_WALLET_ERROR = 'NoWalletError'

export async function mint(tokenUri: string) {
  // patch mobile wallets
  if (isMobile()) {
    patchSendAsyncMethod()
  }

  const eth = Eth.fromCurrentProvider()
  if (eth) {
    let accounts = await eth.getAccounts()
    if (accounts.length < 1) {
      await (window as any).ethereum.enable()
      accounts = await eth.getAccounts()
      if (accounts.length < 1) {
        throw new Error('Could not connect to wallet!')
      }
    }

    const address = Address.fromString(CONTRACT_ADDRESS!)
    const pictures = new EthPictures(eth, address)
    const txHash = await pictures.methods
      .mint(accounts[0], tokenUri)
      .send({ from: accounts[0] })
      .getTxHash()
    return txHash
  } else {
    throw new Error(NO_WALLET_ERROR)
  }
}

export async function getAddress() {
  const eth = Eth.fromCurrentProvider()
  if (eth) {
    const accounts = await eth.getAccounts()
    if (accounts.length > 0) {
      const address = accounts[0].toString()
      return address
    }
  }
  return null
}

let usd = 0

export async function getPrice() {
  if (!usd) {
    const url = `wss://mainnet.infura.io/ws/v3/${INFURA_TOKEN}`
    const provider = new WebsocketProvider(url)
    const eth = new Eth(provider)
    const medianizer = new Medianizer(
      eth,
      Address.fromString(MEDIANIZER_ADDRESS)
    )
    const resp = await medianizer.methods.compute().call()
    usd = parseFloat(fromWei(resp[0], 'ether'))
  }
  return usd
}

export async function patchSendAsyncMethod() {
  // Hack for old providers that don't have a way to convert send to sendAsync
  const provider = (window as any).ethereum
  if (
    provider &&
    typeof provider.sendAsync === 'function' &&
    provider.send !== provider.sendAsync
  ) {
    provider.send = provider.sendAsync
  }
}
