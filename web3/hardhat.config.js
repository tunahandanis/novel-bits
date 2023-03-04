/* eslint-disable no-undef */
require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    testnet: {
      url: `https://rpc.testnet.fantom.network`,
      chainId: 4002,
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
    coverage: {
      url: "http://localhost:8555",
    },
    localhost: {
      url: `http://127.0.0.1:8545`,
    },
  },
}
