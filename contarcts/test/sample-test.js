const { expect } = require("chai");
const { network } = require("hardhat");

describe("Artizan Market", function () {
  it("Execute Market Sale", async function () {

    const [owner, addr1, addr2] = await ethers.getSigners();

    const Market = await ethers.getContractFactory("ArtizanMarket");
    const testMarket = await Market.deploy();
    await testMarket.deployed();
    const marketAddress=testMarket.address;

    const NFT = await ethers.getContractFactory("ArtizanNFT");
    const testNFT = await NFT.deploy(marketAddress);
    await testNFT.deployed();
    const nftAdress= testNFT.address;

    const Auction = await ethers.getContractFactory("ArtizanAuction");
    const testAuction = await Auction.deploy();
    await testAuction.deployed();
    const AuctionAdress= testAuction.address;

    let listingPrice = await testMarket.getListingPrice();
    listingPrice = listingPrice.toString();

    const auction= ethers.utils.parseUnits('1','ether');

    await testNFT.mintNFT('https://gateway.pinata.cloud/ipfs/Qmbjg2uzqop2kpDwfN8CxhzJpmi34HwJrtXfP7RjKE6QY8');
    await testNFT.mintNFT('https://gateway.pinata.cloud/ipfs/QmWCQVnaa7At9koZiaYhJjyasTcHLE7o3vkgv3UUxD3t9U');

    /*
    await testMarket.createMarketItem(auction,nftAdress,1,{ value: listingPrice });
    await testMarket.createMarketItem(auction,nftAdress,2,{ value: listingPrice });

    await testMarket.connect(addr1).createMarketSale(nftAdress,1, {value: auction});
    
    const items = await testMarket.ListItemsOnSale();
    console.log('items:', items)

    await testMarket.connect(addr1).ResellNFT(auction,nftAdress,1,{ value: listingPrice});
    const items2 = await testMarket.ListItemsOnSale();
    console.log('items:', items2)

    await testMarket.connect(addr1).StopNFTSale(auction,nftAdress,1);
    const items3 = await testMarket.ListItemsOnSale();
    console.log('items:', items3)
    */

    const transaction=await testAuction.createBidItem(nftAdress,1,auction,60,{ value: listingPrice });
    const transactionReceipt= await transaction.wait();
    if (transactionReceipt.status !== 1){
      alert('error message');
        return;
    }
    console.log(transactionReceipt.status);
    console.log(transactionReceipt.from);
    console.log(transactionReceipt.to);
    console.log(AuctionAdress);
    console.log(owner.address);
    console.log(transactionReceipt.logs);

    const a = await testAuction.isTokenOnBid(1);
    const item= await testAuction.BidInfoWithTokenID(1);
    const items= await testAuction.listActiveBids();
    //console.log(a);
    console.log("Before bid",item);
    console.log("items before finish bid",items);
    const beforebalance= await ethers.provider.getBalance(owner.address);
    const beforebalance2=await ethers.provider.getBalance(addr1.address);

    console.log("owner balance before",beforebalance.toString())
    console.log("addr1 balance before",beforebalance2.toString())

    const auction2= ethers.utils.parseUnits('2','ether');

    await testAuction.connect(addr1).placeBid(1,{ value: auction2 });
    const item2= await testAuction.BidInfoWithTokenID(1);
    console.log("After bid",item2);
    await ethers.provider.send("evm_increaseTime", [3600]);

    const transaction2=await testAuction.finishBid(1,nftAdress);
    const transactionReceipt2= await transaction2.wait();
    if (transactionReceipt2.status !== 1){
      alert('error message');
        return;
    }

    const items2= await testAuction.listActiveBids();
    console.log("items2:",items2);

    const afterbalance= await ethers.provider.getBalance(owner.address);
    const afterbalance2= await ethers.provider.getBalance(addr1.address);
    const ad2=await ethers.provider.getBalance(addr2.address);
    console.log("owner balance after",afterbalance.toString());
    console.log("addr1 balance after",afterbalance2.toString());
    console.log("addr2 balance after",ad2.toString());

    const transaction3=await testAuction.connect(addr1).createBidItem(nftAdress,1,auction,60,{ value: listingPrice });
    const transactionReceipt3= await transaction3.wait();
    if (transactionReceipt3.status !== 1){
      alert('error message');
        return;
    }
    const items3= await testAuction.listActiveBids();
    console.log("items3:",items3);
  });
});