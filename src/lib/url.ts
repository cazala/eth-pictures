export const getInfuraUrl = (hash: string) =>
  `https://ipfs.infura.io/ipfs/${hash}`

export const getMetadataUrl = (hash: string) =>
  `https://query-to-json.now.sh/api?image=${getInfuraUrl(hash)}`
