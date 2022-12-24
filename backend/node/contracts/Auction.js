require('dotenv').config()
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");

const ContractDetails = require("./ContractDetails");
const alchemyAPIKey = process.env["ALCHEMY_API_KEY"]

const web3 = createAlchemyWeb3(
    `https://eth-ropsten.alchemyapi.io/v2/${alchemyAPIKey}`,
);

const auctionContractABI = require('./ArtizanAuction.json')
const auctionContract = new web3.eth.Contract(auctionContractABI.abi, ContractDetails.auctionContractAddress);

const { ethers, Wallet } = require("ethers");
const { hexlify } = require('ethers/lib/utils');
// const provider = new ethers.providers.JsonRpcProvider("https://speedy-nodes-nyc.moralis.io/9d80e0ead67926f01ab12c11/eth/ropsten");
// const wallet = new ethers.Wallet("488aa8f8451c153240d7c30797905e261c8f5ea2e39366b6af43c5c17f9c55fa", provider);

// const authorizedContract = new ethers.Contract(ContractDetails.auctionContractAddress, auctionContractABI.abi, wallet);
const AUCTION_ENDER = false;

const provider= new ethers.getDefaultProvider('ropsten');
const wallet = new ethers.Wallet("488aa8f8451c153240d7c30797905e261c8f5ea2e39366b6af43c5c17f9c55fa", provider);
const nftContract = new ethers.Contract(ContractDetails.auctionContractAddress,auctionContractABI.abi,wallet);

async function isTokenOnAuction(contract, token) {
    if (contract.toLowerCase() != ContractDetails.nftContractAddress) {
        return false;
    }

    let onAuction = await auctionContract.methods.isTokenOnBid(token).call();
    console.log(onAuction);
    return onAuction;
}

async function getAuctionDetails(contract, token) {
    if (contract.toLowerCase() != ContractDetails.nftContractAddress) {
        return false;
    }

    let onAuction = await auctionContract.methods.BidInfoWithTokenID(token).call();
    return onAuction;
}


async function getAuctionBiddingDetails(contract, token) {
    if (contract.toLowerCase() != ContractDetails.nftContractAddress) {
        return false;
    }

    let onAuction = await auctionContract.methods.listPrevBids(token).call();
    console.log(onAuction);
    return onAuction;
}


let locker = []
let local_nonce = 0;
let nonceOffset = 0;


async function auctionEnder() {

    try {

        for (let k = 0; k < 25; k++) {
            let t = await getAuctionDetails(ContractDetails.nftContractAddress, k);

        
            if (t.nftid != 0 && t.ended == false && t.endAt != 0 && Date.now() > (t.endAt * 1000)) {
                
                if (locker.includes(k)) 
                {
                    continue;
                }

                console.log("Ending auction id: ", k);

                locker.push(k);

                let trx = await nftContract.finishBid(k, ContractDetails.nftContractAddress);
                
                // payBackPrevBids
                // Buraya eklenecek

                console.log(trx)

                // let baseNonce = authorizedContract.provider.getTransactionCount(wallet.getAddress());


                // function getNonce() {
                //     return baseNonce.then((nonce) => (nonce + (nonceOffset ++)));
                // }

                // let data = await auctionContract.methods.finishBid(k, ContractDetails.nftContractAddress).encodeABI();

                // let tx = {
                //     'nonce': getNonce(),
                //     'to': ContractDetails.auctionContractAddress,
                //     'type': 1,
                //     'data': data,
                //     'chainId': 3, // for ropsten
                //     'gasLimit': 30000, //(just check what its consumed before and add some),
                //     'gasPrice': ethers.utils.parseUnits('100', 'gwei')
                // }

                // // let unsignedTx = await authorizedContract.populateTransaction.release(tx)

                // let transaction = await authorizedContract.signer.signTransaction(tx);
                
                // let receipt = await authorizedContract.provider.sendTransaction(transaction);
                // console.log(receipt);
                // await authorizedContract.provider.sendTransaction(tx).then((reszs)=>{
                //     console.log(reszs)
                // });

            }
        }
    }
    catch (err) {
        console.log(err);
    }   

    // for (let k = 4; k < 5; k++) {
    //     try {
    //         // let data = await auctionContract.methods.finishBid(k, ContractDetails.nftContractAddress).encodeABI();

    //         let tx = {
    //             "to"
    //         }

    //         // authorizedContract.
    //         authorizedContract.provider.sendTransaction({

    //         })

    //         // await authorizedContract.finishBid(k, ContractDetails.nftContractAddress);            
    //         console.log("sss")
    //     }
    //     catch (err) {
    //         console.log(err);    
    //     }
    // }
}

async function getUsersAuctions(wallet) {
    let auctions = await auctionContract.methods.listUserActiveBid(wallet).call();
    console.log(auctions);
    return auctions;
}

if(AUCTION_ENDER)
{
    setInterval(() => {
        auctionEnder()
    }, 10000);    
}

module.exports = { auctionContract, isTokenOnAuction, getAuctionDetails, getAuctionBiddingDetails, getUsersAuctions };