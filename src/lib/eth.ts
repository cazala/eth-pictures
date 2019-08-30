import { Eth } from 'web3x-es/eth'
import { Address } from 'web3x-es/address'
import { EthPictures } from '../contracts/EthPictures'

export const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS
console.log('CONTRACT_ADDRESS', CONTRACT_ADDRESS)

export const NO_WALLET_ERROR = 'NoWalletError'

export async function mint(tokenUri: string) {
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
    const resp = await fetch('https://api.cryptonator.com/api/ticker/eth-usd')
    const json = await resp.json()
    const data = json.ticker
    if (data) {
      const price = Number(data.price)
      if (price) {
        usd = price
      }
    }
  }
  return usd
}
