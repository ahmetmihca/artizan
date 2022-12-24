// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "./Artizan1155.sol";

contract Artizan1155Market is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _itemsID;
    Counters.Counter private _itemsOnSale;

    address payable owner;
    uint256 listingPrice = 0.010 ether;
    uint256 zero = 0 ether;
    uint256 private totalItem = 0;

    constructor() {
        owner = payable(msg.sender);
    }

    struct MarketItem {
        address nftContract;
        uint256 tokenID;
        address payable[] owners;
        address payable[] sellers;
        uint256[] prices;
        bool[] solds;
        uint256 maxAmount;
    }

    mapping(uint256 => MarketItem) private idMarketItem;
    mapping(uint256 => uint256) private tokenToItem;

    event MarketItemCreation(
        address nftContract,
        uint256 tokenID,
        address owner,
        address seller,
        uint256 price
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

    function isToken1155ExistOnMarket(uint256 tokenId)
        public
        view
        returns (bool)
    {
        if (tokenToItem[tokenId] > 0) {
            return true;
        } else {
            return false;
        }
        return false;
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
        Artizan1155 tokenContract = Artizan1155(NftCont);
        uint256 maxAmount = tokenContract.amountOf(tokenId);
        tokenToItem[tokenId] = currentItemID;
        uint256[] memory prices;
        bool[] memory solds;
        address payable[] memory owners;
        address payable[] memory sellers;
        /*
        prices.push(price);
        solds.push(false);
        for(uint i=0;i<maxAmount-1;i++){
            solds.push(true);
        }
        owners.push(payable(address(this)));
        for(uint i=0;i<maxAmount-1;i++){
            owners.push(payable(address(msg.sender)));
        }
        sellers.push(payable(msg.sender)); */
        idMarketItem[currentItemID] = MarketItem(
            NftCont,
            tokenId,
            owners,
            sellers,
            prices,
            solds,
            maxAmount
        );
        IERC1155(NftCont).safeTransferFrom(
            msg.sender,
            address(this),
            tokenId,
            1,
            ""
        );
        totalItem = totalItem + maxAmount;
        emit MarketItemCreation(
            NftCont,
            tokenId,
            address(this),
            msg.sender,
            price
        );
        idMarketItem[currentItemID].prices.push(price);
        for (uint256 i = 0; i < maxAmount - 1; i++) {
            idMarketItem[currentItemID].prices.push(zero);
        }
        idMarketItem[currentItemID].solds.push(false);
        for (uint256 i = 0; i < maxAmount - 1; i++) {
            idMarketItem[currentItemID].solds.push(true);
        }
        idMarketItem[currentItemID].owners.push(payable(address(this)));
        for (uint256 i = 0; i < maxAmount - 1; i++) {
            idMarketItem[currentItemID].owners.push(
                payable(address(msg.sender))
            );
        }
        idMarketItem[currentItemID].sellers.push(payable(msg.sender));
        for (uint256 i = 0; i < maxAmount - 1; i++) {
            idMarketItem[currentItemID].sellers.push(
                payable(address(msg.sender))
            );
        }
        _itemsOnSale.increment();
    }

    function onERC1155Received(
        address _operator,
        address _from,
        uint256 _id,
        uint256 _value,
        bytes calldata _data
    ) external returns (bytes4) {
        return
            bytes4(
                keccak256(
                    "onERC1155Received(address,address,uint256,uint256,bytes)"
                )
            );
    }

    /*
    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal (ERC1155, ERC1155Supply) {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }*/

    function ResellNFT1155(
        uint256 price,
        address NftCont,
        uint256 tokenId
    ) public payable nonReentrant {
        uint256 item = tokenToItem[tokenId];
        bool checkOwner = false;
        uint256 index;
        for (uint256 i = 0; i < idMarketItem[item].maxAmount; i++) {
            if (idMarketItem[item].owners[i] == msg.sender) {
                checkOwner = true;
                index = i;
            }
        }
        require(checkOwner, "not an owner");
        require(msg.value == listingPrice, "no listing price");

        Artizan1155 tokenContract = Artizan1155(NftCont);
        tokenContract.transferToken(msg.sender, address(this), tokenId, 1);

        idMarketItem[item].solds[index] = false;
        idMarketItem[item].prices[index] = price;
        idMarketItem[item].sellers[index] = payable(msg.sender);
        idMarketItem[item].owners[index] = payable(address(this));
        _itemsOnSale.increment();
    }

    function createMarketSale1155(address NftCont, uint256 tokenId)
        public
        payable
        nonReentrant
    {
        uint256 item = tokenToItem[tokenId];
        uint256 index;
        bool checkPrice = false;
        bool check = false;
        uint256 currentPrice;
        uint256 currentTokenId;
        address seller;
        for (uint256 i = 0; i < idMarketItem[item].maxAmount; i++) {
            if (idMarketItem[item].prices[i] == msg.value) {
                checkPrice = true;
                check = true;
                currentPrice = idMarketItem[item].prices[i];
                currentTokenId = idMarketItem[item].tokenID;
                seller = idMarketItem[item].sellers[i];
                index = i;
            }
        }
        require(check, "no token with that price&id");
        require(idMarketItem[item].solds[index] == false, "already sold");
        require(checkPrice, "make sure you send the exact price");

        idMarketItem[item].owners[index] = payable(msg.sender);
        idMarketItem[item].solds[index] = true;
        idMarketItem[item].sellers[index] = payable(address(0));

        IERC1155(NftCont).safeTransferFrom(
            address(this),
            msg.sender,
            currentTokenId,
            1,
            ""
        );
        payable(owner).transfer(listingPrice);
        payable(seller).transfer(msg.value);

        _itemsOnSale.decrement();
    }

    //function StopNFTSale1155() {}

    function ListItemsOnSale1155() public view returns (MarketItem[] memory) {
        uint256 itemCount = _itemsID.current();
        uint256 onSale = _itemsOnSale.current();
        uint256 currentindex = 0;
        MarketItem[] memory items = new MarketItem[](onSale);
        for (uint256 index = 0; index < itemCount; index++) {
            uint256 a = idMarketItem[index + 1].maxAmount;
            for (uint256 i = 0; i < a; i++) {
                if (idMarketItem[index + 1].owners[i] == address(this)) {
                    uint256 currentItemID = index + 1;
                    MarketItem storage currentItem = idMarketItem[
                        currentItemID
                    ];
                    items[currentindex] = currentItem;
                    currentindex += 1;
                }
            }
        }
        return items;
    }

    /*function ListUserOwnItem1155() public view {
        uint256 itemCount = _itemsID.current();
        uint256 onSale = _itemsOnSale.current();
        uint256 currentindex = 0;

        
    }

    function ListUserSaleItem1155() public view {
        uint256 itemCount = _itemsID.current();
        uint256 onSale = _itemsOnSale.current();

    }
*/
    function ListUserAllItem1155(address user)
        public
        view
        returns (MarketItem[] memory)
    {
        uint256 total = _itemsID.current();
        uint256 itemCount = 0;
        uint256 currentindex = 0;

        for (uint256 index = 0; index < total; index++) {
            uint256 a = idMarketItem[index + 1].maxAmount;
            for (uint256 i = 0; i < a; i++) {
                if (
                    idMarketItem[index + 1].sellers[i] == user ||
                    idMarketItem[index + 1].owners[i] == user
                ) {
                    itemCount += 1;
                }
            }
        }
        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 index = 0; index < total; index++) {
            uint256 a = idMarketItem[index + 1].maxAmount;
            for (uint256 i = 0; i < a; i++) {
                if (
                    idMarketItem[index + 1].sellers[i] == user ||
                    idMarketItem[index + 1].owners[i] == user
                ) {
                    uint256 currentItemID = index + 1;
                    MarketItem storage currentItem = idMarketItem[
                        currentItemID
                    ];
                    items[currentindex] = currentItem;
                    currentindex += 1;
                }
            }
        }
        return items;
    }

    function NFTItem(uint256 tokenId) public view returns (MarketItem memory) {
        uint256 item = tokenToItem[tokenId];
        uint256 a = idMarketItem[item].maxAmount;

        for (uint256 index = 0; index < a; index++) {
            if (idMarketItem[item].solds[index] == false) {
                return idMarketItem[item];
            }
        }
        MarketItem memory f;
        return f;
    }
}
