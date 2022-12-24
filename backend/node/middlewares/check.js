const Collection = require("../models/collection")
const Nft = require("../models/nft")
const User = require("../models/user")
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const axios = require("axios").default;

require('dotenv').config()

const web3 = createAlchemyWeb3(
    `https://eth-ropsten.alchemyapi.io/v2/${process.env['ALCHEMY_API_KEY']}`,
);

function validateWalletID(walletID) {
    return /^0x\w{40}$/.test(walletID)
}

function validateContractID(contractID) {
    return /^0x\w{40}$/.test(contractID)
}

async function checkNFTOwnership(owner, contractID, tokenID) {
    try {
        let config = {
            method: "get",
            url: `https://eth-ropsten.g.alchemy.com/v2/${process.env['ALCHEMY_API_KEY']}/getOwnersForToken?contractAddress=${contractID}&tokenId=${tokenID}`,
            headers: {}
        }
        let resp = await axios.request(config)
        if (resp.status != 200)
            return false
        if (resp.data.owners.some(ele => { return ele == owner }))
            return true
        return false
    } catch (err) {
        console.log("Check error: ", err)
        return false
    }

}

function getTransactionType(input) {
    const substr = input.substring(0, 10);
    if (substr == '0xc23b139e') {
        return "Sale";
    }
    else if (substr == '0xfb37e883') {
        return "Mint";
    }
    else if (substr == '0x82995067') {
        return "Listing"
    }

    return substr
}

module.exports = { validateWalletID, validateContractID, checkNFTOwnership, getTransactionType }