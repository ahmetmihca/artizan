require("dotenv").config()
const API_URL = process.env.API_URL
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const { ethers } = require("ethers");

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);

const contract1 = require("../artifacts/contracts/ArtizanNFT.sol/ArtizanNFT.json");
const contractAddress1 = "0x7ae5191f057ab66544f4877A951a397D8414D430";

const contract2 = require("../artifacts/contracts/ArtizanAuction.sol/ArtizanAuction.json");
const contractAddress2 = "0xca8641663E2658b8e09F575f5492D45918f35E1e";

const API_URL2="https://speedy-nodes-nyc.moralis.io/9d80e0ead67926f01ab12c11/eth/ropsten"

//const provider = new ethers.providers.JsonRpcProvider(API_URL2);
const provider= new ethers.getDefaultProvider('ropsten');
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
nftID=4;
async function AuctionEnd(wallet,nftID) {
    //const nftContract = new web3.eth.Contract(contract2.abi, contractAddress2, wallet);
    const nftContract = new ethers.Contract(contractAddress2,contract2.abi,wallet);
    const transaction= await nftContract.finishBid(nftID, contractAddress1);
    const transactionReceipt = await transaction.wait();
    if (transactionReceipt.status !== 1) {
        alert('error message');
        return;
    }
    console.log(transactionReceipt.status);
}

AuctionEnd(wallet,nftID);




