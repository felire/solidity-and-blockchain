require('@nomiclabs/hardhat-waffle')
require('./tasks/faucet')

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const PRIVATE_KEY = '984c0bb0ba7c2ec762443790969852bfafb96d6f3f330d675187ebedb312729b'
const RINKEBY_URL = 'https://rinkeby.infura.io/v3/e2e9616f36924e6c9173233ce785b2a0'
module.exports = {
  solidity: '0.7.3',
  networks: {
    rinkeby: {
      url: RINKEBY_URL,
      accounts: [`0x${PRIVATE_KEY}`]
    },
    binanceSmartChainTestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: [`0x${PRIVATE_KEY}`]
    },
    binanceSmartChain: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      gasPrice: 20000000000,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  },
}
