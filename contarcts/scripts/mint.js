require("dotenv").config()
const API_URL = process.env.API_URL
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);

const contract = require("../artifacts/contracts/ArtizanNFT.sol/ArtizanNFT.json");
//console.log(JSON.stringify(contract.abi));

const contractAddress = "0x93066686C0659160CEbE6528f2B9967a0Ab331F9";

const nftContract = new web3.eth.Contract(contract.abi, contractAddress);
async function mintNFT(tokenURI) {
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest'); //get latest nonce
  //the transaction
    const tx = {
      'from': PUBLIC_KEY,
      'to': contractAddress,
      'nonce': nonce,
      'gas': 500000,
      'maxPriorityFeePerGas': 2999999987,
      'data': nftContract.methods.mintNFT(tokenURI).encodeABI(),
    };
    
    const signedTx = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
    const transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    
    console.log(`Transaction receipt: ${JSON.stringify(transactionReceipt)}`);
  }
  
mintNFT("https://gateway.pinata.cloud/ipfs/Qmbjg2uzqop2kpDwfN8CxhzJpmi34HwJrtXfP7RjKE6QY8");
