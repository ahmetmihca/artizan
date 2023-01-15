require("dotenv").config()
const API_URL = process.env.API_URL
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const { ethers } = require("ethers");

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);

const contract1 = require("../artifacts/contracts/ArtizanNFT.sol/ArtizanNFT.json");
//console.log(JSON.stringify(contract.abi));
const contractAddress1 = "0xf3002665F83fC79A1125bc9E02588c9563fd67b9";


const nftContract1 = new web3.eth.Contract(contract1.abi, contractAddress1);
async function mintNFT(tokenURI) {
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest'); //get latest nonce
  //the transaction
    const tx = {
      'from': PUBLIC_KEY,
      'to': contractAddress1,
      'nonce': nonce,
      'gas': 500000,
      'maxPriorityFeePerGas': 2999999987,
      'data': nftContract1.methods.mintNFT(tokenURI).encodeABI(),
    };
    
    const signedTx = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
    const transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    
    console.log(`Transaction receipt: ${JSON.stringify(transactionReceipt)}`);
}
  
mintNFT("https://gateway.pinata.cloud/ipfs/Qmbjg2uzqop2kpDwfN8CxhzJpmi34HwJrtXfP7RjKE6QY8");

//Market
const contract2 = require("../artifacts/contracts/ArtizanMarket.sol/ArtizanMarket.json");
const contractAddress2="0x52Fc9e3481a2fd3acA3F795047Bb609F4eD57203";

const API_URL2="https://speedy-nodes-nyc.moralis.io/9d80e0ead67926f01ab12c11/eth/ropsten"

const provider = new ethers.providers.JsonRpcProvider(API_URL2);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
//const nftContract = new ethers.Contract(contractAddress2,contract2.abi,wallet);

price= ethers.utils.parseUnits('0.5','ether'); 
nftID=2;

async function SellNFT(price,wallet,nftID) {
    //const nftContract = new web3.eth.Contract(contract2.abi, contractAddress2, wallet);
    const nftContract = new ethers.Contract(contractAddress2,contract2.abi,wallet);
    let listingPrice = await nftContract.getListingPrice();
    listingPrice = listingPrice.toString();

    const transaction= await nftContract.createMarketItem(price, contractAddress1,nftID,
        {value: listingPrice});
    const transactionReceipt = await transaction.wait();
    if (transactionReceipt.status !== 1) {
        alert('error message');
        return;
    }
}

SellNFT(price,wallet,nftID);

const provider2= new ethers.getDefaultProvider('ropsten');
const PRIVATE_KEY2= "d1df550164cb9a3e781c7d5ee9614c64189a2c535ce4e9d09b1e28d481568806";
const wallet2 = new ethers.Wallet(PRIVATE_KEY2, provider2);

async function BuyNFT(wallet,nftID,price) {
    const nftContract = new ethers.Contract(contractAddress2, contract2.abi, wallet);
    let gasLimit = await nftContract.estimateGas.createMarketSale(contractAddress1,nftID,{value:price});
    const transaction= await nftContract.createMarketSale(contractAddress1, nftID, {
        gasLimit: gasLimit.toNumber(),
        gasPrice: ethers.utils.parseUnits("0.14085197", "gwei"),
        value: price});
    const transactionReceipt = await transaction.wait();
    if (transactionReceipt.status !== 1) {
        alert('error message');
        return;
    }

}
async function loadNFTs() {
const provider2 = new ethers.providers.JsonRpcProvider(API_URL2)
const contract = new ethers.Contract(contractAddress2, contract2.abi, provider2)
const data = await contract.ListItemsOnSale()

    /*
    *  map over items returned from smart contract and format 
    *  them as well as fetch their token metadata
    */
    const items = await Promise.all(data.map(async i => {
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenID.toNumber(),
        seller: i.seller,
        owner: i.owner
      }
      return item
    }))
    console.log("items:",items)
}
    loadNFTs();
    BuyNFT(wallet2,nftID,price)
    loadNFTs();
    async function loadAll() {
        const provider2 = new ethers.providers.JsonRpcProvider(API_URL2)
        const contract = new ethers.Contract(contractAddress2, contract2.abi, provider2)
        const data = await contract.ListUserAllItems('0xB5030fDbf9717492D1ba81C3Db0F7708c1642e2F')
        
            /*
            *  map over items returned from smart contract and format 
            *  them as well as fetch their token metadata
            */
            const items = await Promise.all(data.map(async i => {
              let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
              let item = {
                price,
                tokenId: i.tokenID.toNumber(),
                seller: i.seller,
                owner: i.owner
              }
              return item
            }))
            console.log("items:",items)
        }
    //loadAll();