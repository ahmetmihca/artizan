/**
* @type import('hardhat/config').HardhatUserConfig
*/
require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
const { API_URL, PRIVATE_KEY/*, PRIVATE_KEY2*/ } = process.env;
module.exports = {
   solidity: "0.8.1",
   //defaultNetwork: "ropsten",
   networks: {
      hardhat: {
         chainId:1337
      },
      mumbai: {
         url: API_URL,
         accounts: [`0x${PRIVATE_KEY}`, '0xf75fd8954d58fafb67ce775b853ef078b1255e3158496c415a989e39a36fdc3e'],
         //chainId:3,
         //gas: 2100000,
         //gasPrice: 8000000000,
         //blockGasLimit: 100000000429720
      },
      goerli: {
         url: "https://eth-goerli.alchemyapi.io/v2/EqnPtRXwKN9ZLf-_o1ZKs34lxrGFs3q2",
         accounts: [`0x${PRIVATE_KEY}`, '0xf75fd8954d58fafb67ce775b853ef078b1255e3158496c415a989e39a36fdc3e'],
      },
      ropsten: {
         url: "https://eth-ropsten.alchemyapi.io/v2/lKldEJ6YsV8njNJP1DBtV7og_9TQzNYV",
         accounts: [`0x${PRIVATE_KEY}`, '0xf75fd8954d58fafb67ce775b853ef078b1255e3158496c415a989e39a36fdc3e'],
         //chainId:3,
         gas: 2100000,
         gasPrice: 8000000000,
         //blockGasLimit: 100000000429720
      },
   },
   mocha: {
      timeout: 100000000
    },
}