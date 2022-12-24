//Contract based on [https://docs.openzeppelin.com/contracts/3.x/erc721](https://docs.openzeppelin.com/contracts/3.x/erc721)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./ArtizanNFT.sol";

contract ArtizanMarket is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _itemsID;
    Counters.Counter private _itemsSold; // keep track how many sale happened

    address payable owner;
    uint256 listingPrice = 0.010 ether;

    constructor() {
        owner = payable(msg.sender);
    }

    struct MarketItem {
        address nftContract;
        uint256 tokenID;
        address payable owner;
        address payable seller;
        uint256 price;
        bool sold;
        bool soldBefore;
    }

    mapping(uint256 => MarketItem) private idMarketItem;
    mapping(uint256 => uint256) private tokenToItem;

    event MarketItemCreation(
        address nftContract,
        uint256 indexed tokenID,
        address owner,
        address seller,
        uint256 price,
        bool sold,
        bool soldBefore
    );

    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    function updateListingPrice(uint256 _listingPrice) public payable {
        require(
            owner == msg.sender,
            "Only marketplace owner can update listing price."
        );
        listingPrice = _listingPrice;
    }

    ////This function operates putting an NFT on the market which is not sold before, it is a new item.
    function createMarketItem(
        uint256 price,
        address NftCont,
        uint256 tokenId
    ) public payable nonReentrant {
        require(price > 0, "Too low");
        require(
            msg.value == listingPrice,
            "Make sure you have the listing Price"
        );
        _itemsID.increment();
        uint256 currentItemID = _itemsID.current();
        tokenToItem[tokenId] = currentItemID;
        idMarketItem[currentItemID] = MarketItem(
            NftCont,
            tokenId,
            payable(address(this)),
            payable(msg.sender),
            price,
            false,
            false
        );
        IERC721(NftCont).transferFrom(msg.sender, address(this), tokenId);
        emit MarketItemCreation(
            NftCont,
            tokenId,
            address(this),
            msg.sender,
            price,
            false,
            false
        );
    }

    ////This function operates putting an NFT on the market which is sold before, it is a new item.
    function isSoldBefore(uint256 tokenId) public view returns (bool) {
        uint256 item = tokenToItem[tokenId];
        if (idMarketItem[item].soldBefore == true) {
            return true;
        } else {
            return false;
        }
    }

    function ResellNFT(
        uint256 price,
        address NftCont,
        uint256 tokenId
    ) public payable nonReentrant {
        uint256 item = tokenToItem[tokenId];
        require(
            idMarketItem[item].owner == msg.sender,
            "Only item owner can perform this operation"
        );
        require(
            msg.value == listingPrice,
            "Price must be equal to listing price"
        );

        ArtizanNFT tokenContract = ArtizanNFT(NftCont);
        tokenContract.transferToken(msg.sender, address(this), tokenId);

        idMarketItem[item].sold = false;
        idMarketItem[item].price = price;
        idMarketItem[item].seller = payable(msg.sender);
        idMarketItem[item].owner = payable(address(this));
        _itemsSold.decrement();
    }

    ////This function operates stopping an NFT Sale
    function StopNFTSale(
        uint256 price,
        address NftCont,
        uint256 tokenId
    ) public payable nonReentrant {
        uint256 item = tokenToItem[tokenId];
        require(
            msg.sender == idMarketItem[item].seller || msg.sender == owner,
            "Only item owner or seller can perform this"
        );
        /*
        ArtizanToken tokenContract = ArtizanToken(NftCont);
        tokenContract.transferToken(msg.sender, address(this), tokenId);
        */
        idMarketItem[item].sold = true;
        idMarketItem[item].price = price;
        idMarketItem[item].seller = payable(address(0));
        idMarketItem[item].owner = payable(msg.sender);
        idMarketItem[item].soldBefore = true;
        _itemsSold.increment();

        IERC721(NftCont).transferFrom(address(this), msg.sender, tokenId);
    }

    //// This function operates an NFT Sale/Transaction
    function createMarketSale(address NftCont, uint256 tokenId)
        public
        payable
        nonReentrant
    {
        uint256 item = tokenToItem[tokenId];
        uint256 currentPrice = idMarketItem[item].price;
        uint256 currentTokenId = idMarketItem[item].tokenID;
        address seller = idMarketItem[item].seller;
        require(msg.value >= currentPrice, "Please pay the asking price");
        require(idMarketItem[item].sold == false, "Item has been already sold");

        idMarketItem[item].owner = payable(msg.sender); //// market item i guncelle yeni sahip
        idMarketItem[item].sold = true; ////market item i guncelle satildi
        idMarketItem[item].seller = payable(address(0));
        idMarketItem[item].soldBefore = true;
        _itemsSold.increment(); //// toplam satisi guncelle
        IERC721(NftCont).transferFrom(
            address(this),
            msg.sender,
            currentTokenId
        ); //// Bu contracttaki tokenId si currenttokenid olanin sahipligini msg.sender'a ver
        payable(owner).transfer(listingPrice); // pazarcinin komisyonu (contract sahibi)
        payable(seller).transfer(msg.value); //// NFT yi satan kisiye parayi gonder
    }

    //// This function operates listing NFTs on marketsale (unsold items)
    function ListItemsOnSale() public view returns (MarketItem[] memory) {
        uint256 itemCount = _itemsID.current();
        uint256 itemUnsold = _itemsID.current() - _itemsSold.current();
        uint256 currentindex = 0;

        MarketItem[] memory items = new MarketItem[](itemUnsold);
        for (uint256 index = 0; index < itemCount; index++) {
            if (idMarketItem[index + 1].owner == address(this)) {
                uint256 currentItemID = index + 1;
                MarketItem storage currentItem = idMarketItem[currentItemID];
                items[currentindex] = currentItem;
                currentindex += 1;
            }
        }
        return items;
    }

    /*
    function buyNFT(uint256 tokenId) public payable nonReentrant {
        uint256 item=tokenToItem[tokenId];
        idMarketItem[tokenId].owner = payable(msg.sender); //// market item i guncelle yeni sahip
        idMarketItem[tokenId].sold = true; ////market item i guncelle satildi
        idMarketItem[tokenId].seller = payable(address(0));
        idMarketItem[tokenId].soldBefore = true;
        _itemsSold.increment();
    }
*/
    //// This function operates User's NFTs (purchased)
    function ListUserOwnItems() public view returns (MarketItem[] memory) {
        uint256 totalItem = _itemsID.current();
        uint256 itemCount = 0;
        uint256 currentindex = 0;

        for (uint256 index = 0; index < totalItem; index++) {
            if (idMarketItem[index + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }
        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 index = 0; index < totalItem; index++) {
            if (idMarketItem[index + 1].owner == msg.sender) {
                uint256 currentItemID = index + 1;
                MarketItem storage currentItem = idMarketItem[currentItemID];
                items[currentindex] = currentItem;
                currentindex += 1;
            }
        }
        return items;
    }

    //// This function operates User's listed NFTs (on sale)
    function ListUserSaleItems() public view returns (MarketItem[] memory) {
        uint256 totalItem = _itemsID.current();
        uint256 itemCount = 0;
        uint256 currentindex = 0;

        for (uint256 index = 0; index < totalItem; index++) {
            if (idMarketItem[index + 1].seller == msg.sender) {
                itemCount += 1;
            }
        }
        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 index = 0; index < totalItem; index++) {
            if (idMarketItem[index + 1].seller == msg.sender) {
                uint256 currentItemID = index + 1;
                MarketItem storage currentItem = idMarketItem[currentItemID];
                items[currentindex] = currentItem;
                currentindex += 1;
            }
        }
        return items;
    }

    function ListUsersAllItems(address user)
        public
        view
        returns (MarketItem[] memory)
    {
        uint256 totalItem = _itemsID.current();
        uint256 itemCount = 0;
        uint256 currentindex = 0;

        for (uint256 index = 0; index < totalItem; index++) {
            if (
                idMarketItem[index + 1].seller == user ||
                idMarketItem[index + 1].owner == user
            ) {
                itemCount += 1;
            }
        }
        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 index = 0; index < totalItem; index++) {
            if (
                idMarketItem[index + 1].seller == user ||
                idMarketItem[index + 1].owner == user
            ) {
                uint256 currentItemID = index + 1;
                MarketItem storage currentItem = idMarketItem[currentItemID];
                items[currentindex] = currentItem;
                currentindex += 1;
            }
        }
        return items;
    }

    function NFTItem(uint256 tokenId) public view returns (MarketItem memory) {
        uint256 item = tokenToItem[tokenId];
        return idMarketItem[item];
    }
}
