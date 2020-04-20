require('dotenv').config()

const HDWalletProvider = require('truffle-hdwallet-provider')

module.exports = {
  networks: {
    development: {
      protocol: 'http',
      host: 'localhost',
      port: 8545,
      gas: 5000000,
      gasPrice: 5e9,
      networkId: '*',
    },
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(
          process.env.MNEMONIC,
          `https://rinkeby.infura.io/v3/${process.env.REACT_APP_INFURA_TOKEN}`
        )
      },
      gas: 5000000,
      gasPrice: 5e9,
      network_id: 4,
    },
    mainnet: {
      provider: function () {
        return new HDWalletProvider(
          process.env.MNEMONIC,
          `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_TOKEN}`
        )
      },
      gas: 5000000,
      gasPrice: 5e9,
      network_id: 1,
    },
  },
}
