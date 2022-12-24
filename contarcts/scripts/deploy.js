// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
//const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  
  const NFTMarket = await hre.ethers.getContractFactory("Artizan1155Market");
  const artizanMarket = await NFTMarket.deploy();

  await artizanMarket.deployed();

  console.log("Artizan Market deployed to:", artizanMarket.address);

  const NFT = await hre.ethers.getContractFactory("Artizan1155");
  const artizanNft = await NFT.deploy(artizanMarket.address);

  await artizanNft.deployed();

  console.log("Artizan 1155 deployed to:", artizanNft.address);

}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });




  
  ////Compiled 1 Solidity file successfully
//////Artizan Market deployed to: 0xfE35b5BBCe27Db9bF0941517B2Ad1e227cc7c370
//////Artizan NFT deployed to: 0xcb82814c42d7B5AB540BFC16705Bd30a0491d563

/////New ones
////Artizan Market deployed to: 
////Artizan NFT deployed to: 0xAB34D0e09830c10246e334571eC5fB042b08a079


/////22.05.2022-13.21
/////Artizan Market deployed to: 0x1206397B841F1467eF18ccD4110255DDb63f5Dab
/////Artizan NFT deployed to: 0x6EA48fdA9A1bF98dF6a0BF0Fae1A9CaBF7f7F632

//22.05.2022-19.49
/////Artizan Market deployed to: 0x950877bb1cfC64E90D56fBe0FCD6D18515100663
/////Artizan NFT deployed to: 0xfCBa2352DF25158310c37CcEEB3c4dE5264fA2C0


///22.05.2022-23.12
///Artizan Market deployed to: 0x036A287Fa41E316a8700FaCa500c5240c4ca244C
///Artizan NFT deployed to: 0x2569eb6AE543c8e0482212ccfe1E540c09693F62

//Artizan Market deployed to: 0x43B9C4cBc4F5a836e3fA0Af1Ca85Cf9a1c0c6F4A
//Artizan NFT deployed to: 0x677AF9f9A631176b66A36c95254d26CDD5888e6e

//24/05
//Artizan Market deployed to: 0x8e580182493ABe9eca3a4D9EE2081ea178B78636
//Artizan NFT deployed to: 0x6A2DbcCfc04E620fDbfaF47f4DE5328663eD6ee4


//29/05
///Artizan Market deployed to: 0x73c86E2664367Aa6Ef9fA0784807E6aC782b51c1
///Artizan NFT deployed to: 0x24fF3210f6c2b05C5A7C987864b75a00302a32a7


//Mumbai
//Artizan Market deployed to: 0x90Ffa158Bc8345B7573Faa7F551d97b099Ca43ef
//Artizan NFT deployed to: 0xDc59eDA176ef60a035e453e6e4377abeF106B515
//goerli
//Artizan Market deployed to: 0x90Ffa158Bc8345B7573Faa7F551d97b099Ca43ef
//Artizan NFT deployed to: 0xDc59eDA176ef60a035e453e6e4377abeF106B515
//ropsten
//Artizan Market deployed to: 0x12d54855199a6A9361C798D0151825843eAD5D55
//Artizan NFT deployed to: 0x7ae5191f057ab66544f4877A951a397D8414D430
//Artizan Auction deployed to: 0x418eCdE15D66e5151ED2bba9593D69f65AF617D8
//03.06/18.58 Artizan Auction deployed to: 0xca8641663E2658b8e09F575f5492D45918f35E1e

//ahmetmihca
//Artizan 1155 deployed to: 0xB9d127A9320E3959E951a1A885Dbec25fd03A42B
//Artizan 1155 deployed to: 0x34d5c665603A0D0163b914843e8F1a1AF5377Eae

//gizemf 1155 with market
//Artizan Market deployed to: 0x649AB034Dbd884140874cB8f74494834E4E47096
//Artizan 1155 deployed to: 0xd26E22D16113c63D8E1C3D7EE96E85944e2e786B

//Artizan Market deployed to: 0x5E27327c9Ce6fcE310a540Fd7B775Fd76D76782C
//Artizan 1155 deployed to: 0x7C13431e8695C436D7611C1750CB2a63c06C8BB5

