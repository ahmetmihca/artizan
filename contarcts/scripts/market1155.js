require("dotenv").config()
const API_URL = process.env.API_URL
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const { ethers } = require("ethers");

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);

const contractNFT = require("../artifacts/contracts/Artizan1155.sol/Artizan1155.json");
const contractAddressNFT = "0xd26E22D16113c63D8E1C3D7EE96E85944e2e786B";

const contractMarket = require("../artifacts/contracts/Artizan1155Market.sol/Artizan1155Market.json");
const contractAddressMarket = "0x649AB034Dbd884140874cB8f74494834E4E47096";


const nftContract = new web3.eth.Contract(contractNFT.abi, contractAddressNFT);
async function mintNFT(tokenURI,amount) {
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest'); //get latest nonce
  //the transaction
    const tx = {
      'from': PUBLIC_KEY,
      'to': contractAddressNFT,
      'nonce': nonce,
      'gas': 500000,
      'maxPriorityFeePerGas': 2999999987,
      'data': nftContract.methods.mintNFT(tokenURI,amount).encodeABI(),
    };
    
    const signedTx = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
    const transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    
    console.log(`Transaction receipt: ${JSON.stringify(transactionReceipt)}`);
}
  
//mintNFT("https://gateway.pinata.cloud/ipfs/Qmbjg2uzqop2kpDwfN8CxhzJpmi34HwJrtXfP7RjKE6QY8",3);


//Market

const API_URL2="https://speedy-nodes-nyc.moralis.io/9d80e0ead67926f01ab12c11/eth/ropsten"

const provider = new ethers.getDefaultProvider('ropsten')
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
//const nftContract = new ethers.Contract(contractAddress2,contract2.abi,wallet);

price= ethers.utils.parseUnits('0.05','ether'); 
nftID=1;
const MarketContract = new ethers.Contract(contractAddressMarket,contractMarket.abi,wallet);

async function SellNFT(price,nftID) {
    //const nftContract = new web3.eth.Contract(contract2.abi, contractAddress2, wallet);
    let listingPrice = await MarketContract.getListingPrice();
    listingPrice = listingPrice.toString();

    const transaction= await MarketContract.createMarketItem(price, contractAddressNFT,nftID,
        {value: listingPrice});
    const transactionReceipt = await transaction.wait();
    if (transactionReceipt.status !== 1) {
        alert('error message');
        return;
    }
}
async function checkMarket(nftid){
  const provider2 = new ethers.getDefaultProvider('ropsten');
  const contract = new ethers.Contract(contractAddressMarket, contractMarket.abi, provider2)
  const check = await contract.isToken1155ExistOnMarket(nftid);
  console.log(check)
  return check;
}

/*
checkMarket(nftID).then(function(check){
  c =check;
  if(c==false){
    console.log('not sold before',c);
    SellNFT(price,nftID);
  }
  else{
    console.log('sold before',c);
    loadNFTs()
  }
});
*/


const provider2= new ethers.getDefaultProvider("ropsten");
const PRIVATE_KEY2= "a009fdeed6048bf3edaa253c4da3a50deb10ab2ad27639005b9dd80e14a2c906";
const wallet2 = new ethers.Wallet(PRIVATE_KEY2, provider2);

async function BuyNFT(wallet,nftID,price) {
    const nftContract = new ethers.Contract(contractAddressMarket, contractMarket.abi, wallet);
    /*let gasLimit = await nftContract.estimateGas.createMarketSale(
        contractAddressNFT,
        nftID,
        {value:price}
      );*/
    const transaction= await nftContract.createMarketSale1155(contractAddressNFT, nftID, {
        //gasLimit: gasLimit,
        //gasPrice: ethers.utils.parseUnits("0.14085197", "gwei"),
        value: price});
    const transactionReceipt = await transaction.wait();
    if (transactionReceipt.status !== 1) {
        alert('error message');
        return;
    }

}
async function loadNFTs() {
const provider2 = new ethers.providers.JsonRpcProvider(API_URL2)
const contract = new ethers.Contract(contractAddressMarket, contractMarket.abi, provider2)
const data = await contract.ListItemsOnSale1155()
    const items = await Promise.all(data.map(async i => {
      let item = {
        prices:i.prices,
        tokenId: i.tokenID.toNumber(),
        sellers: i.sellers,
        owners: i.owners
      }
      return item}))
      console.log("items:",items)}
//loadNFTs();
BuyNFT(wallet2,nftID,price)
  