# ETH Pictures

This tool is an experiment I did to play with decentralized infrastructure.

The images are uploaded to [IPFS](https://ipfs.io), and an NFT (non-fungible token) is minted in the Ethereum blockchain to represent each picture.

Each token is ownable, transferrable, tradable and unique.

The gallery data is pulled from [OpenSea](https://opensea.io)'s API.

## Setup

0. Environment variables

```
$ mv .env.example .env
```

1. Install dependencies

```
$ npm install
```

2. Start dev-server

```
$ npm start
```

3. Production build

```
$ npm run build
```

## Deploy your own contract

You need to fill the `MNEMONIC` and `INFURA_TOKEN` environment variables in your `.env` file:

```
MNEMONIC="bunker satoshi food..."
INFURA_TOKEN=b013...
```

Then use `openzeppelin create` command and follow the interactive steps to deploy your contract.

To use this new contract just update the `REACT_APP_CONTRACT_ADDRESS` environment variable.

## Modifying the contract

If you make changes to `contracts/EthPictures.sol` you will need to do the following afterwards:

1. Compile contracts

```
$ npm install -g @openzeppelin/cli
$ openzeppelin compile
```

2. Generate TypeScript interfaces

```
$ npm run contracts
```

If you have problems compiling your app after this, check out the [Troubleshooting](https://github.com/cazala/eth-pictures/blob/master/README.md#troubleshooting) section.


## Rinkeby

To use the Rinkeby testnet you need to point to a Rinkeby contract (you can deploy your own or use the one shown below), and also point to OpenSea's rinkeby API, like this:

```
REACT_APP_CONTRACT_ADDRESS=0xd9284B013f9237BAA3d884dca36FA1658430b178
REACT_APP_OPENSEA_API=https://rinkeby-api.opensea.io
REACT_APP_OPENSEA_URL=https://rinkeby.opensea.io
```

That address is an actual instance of the contract deployed to Rinkeby: [link to Etherscan](https://rinkeby.etherscan.io/address/0xd9284b013f9237baa3d884dca36fa1658430b178).

## Troubleshooting

If your build is failing due to a problem with `src/contracts/EthPicturesAbi.ts` try typing the ABI as `any`, by changing the last line in that file to the following:

```tsx
] as any)
```

