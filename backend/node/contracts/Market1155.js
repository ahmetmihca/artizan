require('dotenv').config()
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");

const ContractDetails = require("./ContractDetails");
const alchemyAPIUrl = process.env["ALCHEMY_API_URL"]

const web3 = createAlchemyWeb3(
    alchemyAPIUrl // `https://eth-ropsten.alchemyapi.io/v2/${alchemyAPIKey}`,
);

const market1155ContractABI = require('./Artizan1155Market.json')
const market1155Contract = new web3.eth.Contract(market1155ContractABI.abi, ContractDetails.marketContractAddress1155);

async function sellNFT(price, tokenId)
{
    const transaction = await market1155Contract.methods.createMarketItem(price, ContractDetails.nftContractAddress1155 , tokenId).encodeABI();
    return transaction;
}

async function buyNFT(nftContractAddress, token)
{
    const transaction = await market1155Contract.methods.createMarketSale1155(nftContractAddress, token).encodeABI();
    return transaction;
}

async function getNFT(tokenId)
{
    let item = await market1155Contract.methods.NFTItem(tokenId).call();
    return item;
}


module.exports = { sellNFT, getNFT, buyNFT};