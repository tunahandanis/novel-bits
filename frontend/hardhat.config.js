/* eslint-disable no-undef */
require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")

require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.7",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
  networks: {
    testnet: {
      url: `https://rpc.testnet.fantom.network`,
      chainId: 4002,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
    coverage: {
      url: "http://localhost:8555",
    },
    localhost: {
      url: `http://127.0.0.1:8545`,
    },
  },
}
