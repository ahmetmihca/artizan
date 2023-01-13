require('dotenv').config()
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");

const ContractDetails = require("./ContractDetails");
const alchemyAPIUrl = process.env["ALCHEMY_API_URL"]

const web3 = createAlchemyWeb3(
    alchemyAPIUrl // `https://eth-ropsten.alchemyapi.io/v2/${alchemyAPIKey}`,
);

const nft1155ContractABI = require('./Artizan1155.json')
const nft1155Contract = new web3.eth.Contract(nft1155ContractABI.abi, ContractDetails.nftContractAddress1155);


function mintNftAbi(ipfsHash, count = 1)
{
    return nft1155Contract.methods.mintNFT(ipfsHash, count).encodeABI();
}

function getAmount(token)
{
    return nft1155Contract.methods.amountOf(token).call();
}


module.exports = { mintNftAbi, getAmount};