const express = require('express')
const { json } = require('express/lib/response')
const axios = require("axios").default
const auth = require('../middlewares/auth');
const Nft = require("../models/nft");
const { ethers } = require("ethers");

const alchemyAPIKey = process.env["ALCHEMY_API_KEY"]

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");

const marketContractABI = require('../contracts/ArtizanMarket.json')
const nftContractAddress = "0x6A2DbcCfc04E620fDbfaF47f4DE5328663eD6ee4";
const marketContractAddress = "0x8e580182493ABe9eca3a4D9EE2081ea178B78636";

// Using HTTPS
const web3 = createAlchemyWeb3(
    `https://eth-ropsten.alchemyapi.io/v2/${alchemyAPIKey}`,
);

const router = express.Router()

require('dotenv').config()


router.get('/', async (req, res) => {

    res.send('trading endpoint')

})


router.post('/sell', auth, async (req, res) => {

    const {contract, tokenID, price} = req.body;
    console.log(tokenID)

    let nft = await Nft.findOne({
        contract: contract,
        tokenID: tokenID
    });

    if(!nft){
        res.json({"status" : "not found"})
        return;
    }

    const nftContract = new web3.eth.Contract(marketContractABI.abi,marketContractAddress);
    const transaction = await nftContract.methods.createMarketItem(web3.utils.toWei(price,'ether'), nftContractAddress ,nft.tokenID).encodeABI();

    let listingPrice = await nftContract.methods.getListingPrice().call();
    console.log(web3.utils.toWei('0.01','ether'))

    const transactionParameters = {
        to: marketContractAddress, // Required except during contract publications.
        from: req.user.id, // must match user's active address.
        data:  transaction,
        value: web3.utils.toWei('0.01','ether')
    };

    res.json(transactionParameters);
    return;
})


module.exports = router;