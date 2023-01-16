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




  