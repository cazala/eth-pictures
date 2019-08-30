import * as IPFS from 'ipfs-http-client'

type IpfsFile = {
  hash: string
  path: string
  size: number
}

type IpfsApi = {
  add(buffer: Buffer): Promise<IpfsFile[]>
}

export const ipfs: IpfsApi = new IPFS({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https'
})

export const upload = async (buffer: Buffer) => {
  const result = await ipfs.add(buffer)
  return result[0].hash
}

export const getInfuraUrl = (hash: string) =>
  `https://ipfs.infura.io/ipfs/${hash}`
