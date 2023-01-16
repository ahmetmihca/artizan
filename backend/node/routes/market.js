require("dotenv").config();

const express = require("express");
const axios = require("axios").default;
const auth = require("../middlewares/auth");
const Nft = require("../models/nft");
const { ethers, ContractFactory } = require("ethers");

const alchemyAPIUrl = process.env["ALCHEMY_API_URL"]


const { createAlchemyWeb3 } = require("@alch/alchemy-web3");

const marketContractABI = require('../contracts/ArtizanMarket.json')
const nftContractAddress = "0xa15e32d75d12E93D2c88C175AFcD86d41C783d6C".toLocaleLowerCase();
const marketContractAddress = "0xF92acb3Fdb26ca19aA955feaCD2996f4AaB27b23".toLocaleLowerCase();

// Using HTTPS
const web3 = createAlchemyWeb3(
  alchemyAPIUrl // `https://eth-ropsten.alchemyapi.io/v2/${alchemyAPIKey}`,
);

const ContractDetails = require("../contracts/ContractDetails");
const Market1155Helper = require("../contracts/Market1155");


const router = express.Router()



const globalContract = new web3.eth.Contract(
  marketContractABI.abi,
  marketContractAddress
);
const auctionContract = new web3.eth.Contract(
  auctionContractABI.abi,
  ContractDetails.auctionContractAddress
);

function MarketItem(contract, token, cost, sold) {
  this.contract = contract;
  this.token = token;
  this.cost = cost;
  this.sold = sold;
}

router.post("/add-to-whitelist", async (req, res) => {
  const username = req.body.username;
  const walletAddress = req.body.walletAddress;
  if (!username || !walletAddress) return console.log("Data is missing");
  try {
    //const marketplaceContract = new web3.eth.Contract(marketContractABI.abi, marketContractAddress);
    console.log("WL WALLET ADD OPERATION");
    await globalContract.methods
      .addToWhitelist(walletAddress, username)
      .encodeABI();

    //await marketplaceContract.addToWhitelist(walletAddress,username);
    //router.push("/searchPage");
  } catch (error) {
    console.log("Error while adding whitelisted wallet");
    console.log(error);
  }
});
router.post("/contract-owner-check", async (req, res) => {
  const accountAddress = req.body.accountAddress;
  try {
    //const marketplaceContract = new web3.eth.Contract(marketContractABI.abi, marketContractAddress);
    console.log("Contract Owner Check");
    const ownerAddress = await globalContract.methods.getOwner().call();
    var isOwner;
    if (ownerAddress.toLowerCase() === accountAddress.toLowerCase()) {
      isOwner = true;
    } else {
      isOwner = false;
    }
    console.log("resultc : " + isOwner);
    console.log("ownerAddress : " + ownerAddress);
    console.log("accountAddress : " + accountAddress);
    res.send(isOwner);
  } catch (error) {
    console.log("Error while adding whitelisted wallet");
    console.log(error);
  }
});
router.post("/whitelist-check", async (req, res) => {
  const accountAddress = req.body.accountAddress;
  console.log("req:", req);
  console.log("req.body:", req.body);
  try {
    //const marketplaceContract = new web3.eth.Contract(marketContractABI.abi, marketContractAddress);
    console.log("Whitelist Check");

    const isWhitelisted = await globalContract.methods
      .isWhitelisted(accountAddress)
      .call();

    console.log("isWhitelisted:" + isWhitelisted);

    res.send(isWhitelisted);
  } catch (error) {
    console.log("Error while checking whitelist", error);
  }
});

function ParseMarketItem(item_array) {
  let return_array = [];
  console.log(item_array);
  item_array.forEach((element) => {
    let item = new MarketItem(
      element["nftContract"],
      element["tokenID"],
      element["price"],
      element["sold"]
    );
    console.log(item.contract);
    return_array.push(item);
  });
  return return_array;
}

router.get("/", async (req, res) => {
  res.send("artizan market");
});

function isHex(num) {
  return Boolean(num.match(/^0x[0-9a-f]+$/i));
}

router.post("/sell", auth, async (req, res) => {
  const { contract, tokenID, price } = req.body;
  console.log(tokenID);

  let nft = await Nft.findOne({
    contract: contract,
    tokenID: tokenID,
  });

  if (!nft) {
    res.json({ status: "not found" });
    return;
  }

  let tokenInt;
  if (isHex(tokenID)) {
    tokenInt = parseInt(tokenID, 16);
  }

  let transaction, nftContract;

  let transactionParameters = {
    to: marketContractAddress, // Required except during contract publications.
    from: req.user.id, // must match user's active address.
    value: web3.utils.toWei("0.01", "ether"),
  };

  if (contract.toLocaleLowerCase() == ContractDetails.nftContractAddress) {
    nftContract = new web3.eth.Contract(
      marketContractABI.abi,
      marketContractAddress
    );
    transaction = await nftContract.methods
      .createMarketItem(
        web3.utils.toWei(price, "ether"),
        nftContractAddress,
        tokenInt
      )
      .encodeABI();
  }
  if (contract.toLocaleLowerCase() == ContractDetails.nftContractAddress1155) {
    transaction = await Market1155Helper.sellNFT(
      web3.utils.toWei(price, "ether"),
      tokenInt
    );
    transactionParameters["to"] = ContractDetails.marketContractAddress1155;
  }

  transactionParameters["data"] = transaction;

  res.json(transactionParameters);
  return;
});

router.post("/buy", auth, async (req, res) => {
  let { contract, token, buyerWallet, price } = req.body;
  console.log("ON BUY => " + contract);

  if (
    contract == null ||
    token == null ||
    buyerWallet == null ||
    price == null
  ) {
    res.status(401);
    return;
  }

  if (
    contract.toUpperCase() != nftContractAddress.toUpperCase() &&
    contract.toLowerCase() != ContractDetails.nftContractAddress1155
  ) {
    res.json("{status: bad}");
    res.status(403);
    return;
  }

  let transactionParameters = {
    to: marketContractAddress, // Required except during contract publications.
    from: buyerWallet, // must match user's active address.
    price: web3.utils.toWei(price, "ether"),
  };

  let transaction;
  if (contract.toLowerCase() == ContractDetails.nftContractAddress) {
    let nftContract = new web3.eth.Contract(
      marketContractABI.abi,
      marketContractAddress
    );
    transaction = await nftContract.methods
      .createMarketSale(nftContractAddress, token)
      .encodeABI();
  } else if (contract.toLowerCase() == ContractDetails.nftContractAddress1155) {
    transaction = await Market1155Helper.buyNFT(
      ContractDetails.nftContractAddress1155,
      token
    );
    transactionParameters["to"] = ContractDetails.marketContractAddress1155;
  }

  transactionParameters["data"] = transaction;

  res.json(transactionParameters);
  return;
});

router.post("/stopSale", auth, async (req, res) => {
  const { contract, tokenID } = req.body;

  let stopContract = await globalContract.methods
    .StopNFTSale(10000000, contract, tokenID)
    .encodeABI();

  const transactionParameters = {
    to: marketContractAddress, // Required except during contract publications.
    from: req.user.id, // must match user's active address.
    data: stopContract,
  };

  res.json(transactionParameters);
  return;
});

router.get("/items", async (req, res) => {
    if (req.query['user'] != null) {
        try {
            // let addr = req.query['user'].substring(2);
            let addr = req.query['user'];

            if (!web3.utils.isAddress(addr)) {
                res.status(404);
                return;
            }

            // This function should be changed 
            let nfts = await web3.alchemy.getNfts({
                contractAddress: ContractDetails.nftContractAddress,
                owner: ContractDetails.marketContractAddress,
            });

            console.log({"NFTS":nfts})

            let items = nfts.ownedNfts.filter((x) => x.metadata && x.metadata.creator.toLowerCase() == req.query['user'].toLowerCase());
            let resp = []

            items.forEach(element => {
                resp.push({
                    "contract": element.contract.address,
                    "token": element.id.tokenId,
                })
            });

            // let items = await globalContract.methods.ListUsersAllItems(addr.toLocaleLowerCase()).call();
            // items = ParseMarketItem(items).filter((x) => x.sold != true && x.tokenID != 0);
            res.json(resp); 
            return;
        }
        catch (err) {
            console.log(err)

            res.status(404)
            return;
        }
    }
    else {
        const items = await globalContract.methods.ListItemsOnSale().call();
        res.json(items);
        return;
    }

router.post("/transactions", async (req, res) => {
  const txhash = req.body.txhash;

  let result = await axios(
    "https://api-ropsten.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=" +
      txhash +
      "&apikey=" +
      process.env["ETHERSCAN_API_KEY"]
  );

  const data = { value: 0, type: "null" };

  data.value = parseInt(result.data.result.value.substring(2), 16) / 10e18;
  data.type = getTransactionType(result.data.result.input);

  res.send(data);
});

function getTransactionType(input) {
    const substr = input.substring(0, 10);
    if (substr.includes('0xc23b139e')) {
        return "Sale";
    }
    else if (substr.includes('0xfb37e88')) {
        return "Mint";
    }
    else if (substr.includes('0x829950')) {
        return "Listing"
    }
    else
    {
        return "Transfer";
    }
}

module.exports = router;
