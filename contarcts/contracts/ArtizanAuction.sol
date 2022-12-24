// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./ArtizanNFT.sol";

contract ArtizanAuction is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _auctionID;

    uint256 listingPrice = 0.010 ether;

    address payable owner;

    constructor() {
        owner = payable(msg.sender);
    }

    struct AuctionInfo {
        address nft;
        uint256 nftid;
        address payable seller;
        uint256 endAt;
        bool started;
        bool ended;
        address highestBidder;
        uint256 highestBid;
        uint256 startingPrice;
    }

    struct prevBids {
        address bidder;
        uint256 bid;
        bool isBack;
    }

    struct tokenAuction {
        uint256 tokenID;
        uint256 auctionID;
    }

    mapping(uint256 => AuctionInfo) private auctions; //auction id to auction id
    mapping(uint256 => tokenAuction) private tokenToAuction; //token to auction id
    mapping(uint256 => prevBids[]) private bids; // auction id to previos Bid info
    //mapping(uint256 => bool) private biddedBefore; //token to first bid

    event Start();
    event Bid(address indexed sender, uint256 amount);
    event End(address winner, uint256 amount);
    event Withdraw(address indexed bidder, uint256 amount);

    function createBidItem(
        address NftCont,
        uint256 tokenId,
        uint256 startPrice,
        uint256 time
    ) public payable nonReentrant {
        require(startPrice > 0, "Too low");
        require(msg.value == listingPrice, "send the listing Price");
        require(time >= 60, "at least 60 sec");
        _auctionID.increment();
        uint256 currentAuction = _auctionID.current();
        tokenToAuction[tokenId].auctionID = currentAuction;
        uint256 endTime = block.timestamp + time;
        auctions[currentAuction] = AuctionInfo(
            NftCont,
            tokenId,
            payable(msg.sender),
            endTime,
            true,
            false,
            payable(msg.sender),
            startPrice,
            startPrice
        );
        ArtizanNFT tokenContract = ArtizanNFT(NftCont);
        tokenContract.transferToken(msg.sender, address(this), tokenId);
        //IERC721(NftCont).transferFrom(msg.sender, address(this), tokenId);
        emit Start();
    }

    function placeBid(uint256 tokenId) public payable nonReentrant {
        uint256 aID = tokenToAuction[tokenId].auctionID;
        require(auctions[aID].started, "not started");
        require(!auctions[aID].ended, "already end");
        require(block.timestamp < auctions[aID].endAt, "ended");
        require(msg.value > auctions[aID].highestBid, "value < highest");

        address prevBidder = auctions[aID].highestBidder;
        uint256 prevBid = auctions[aID].highestBid;

        prevBids memory pre;
        pre.bidder = prevBidder;
        pre.bid = prevBid;
        pre.isBack = false;

        bids[aID].push(pre);

        auctions[aID].highestBidder = msg.sender;
        auctions[aID].highestBid = msg.value;

        emit Bid(msg.sender, msg.value);
    }

    function finishBid(uint256 tokenId, address nft) public nonReentrant {
        uint256 aID = tokenToAuction[tokenId].auctionID;
        require(auctions[aID].started, "not started");
        require(block.timestamp >= auctions[aID].endAt, "not ended");
        require(!auctions[aID].ended, "ended");

        auctions[aID].ended = true;

        if (auctions[aID].highestBidder != address(0)) {
            ArtizanNFT tokenContract = ArtizanNFT(nft);
            tokenContract.transferToken(
                address(this),
                auctions[aID].highestBidder,
                auctions[aID].nftid
            );
            //IERC721(nft).transferFrom(address(this),auctions[aID].highestBidder,auctions[aID].nftid); //!!!
            auctions[aID].seller.transfer(auctions[aID].highestBid);
        } else {
            ArtizanNFT tokenContract = ArtizanNFT(nft);
            tokenContract.transferToken(
                address(this),
                auctions[aID].seller,
                auctions[aID].nftid
            );
            //IERC721(nft).transferFrom(address(this),auctions[aID].seller,auctions[aID].nftid); //!!!
        }
        payable(owner).transfer(listingPrice);
        emit End(auctions[aID].highestBidder, auctions[aID].highestBid);
    }

    function payBackPrevBids(uint256 tokenId) public {
        uint256 aID = tokenToAuction[tokenId].auctionID;
        uint256 size = bids[aID].length;
        for (uint256 i = 0; i < size; i++) {
            if (bids[aID][i].isBack == false) {
                bids[aID][i].isBack = true;
                uint256 bid = bids[aID][i].bid;
                address bidder = bids[aID][i].bidder;
                payable(msg.sender).transfer(bid);
                emit Withdraw(bidder, bid);
                bids[aID][i].bid = 0;
            }
        }
    }

    function isTokenOnBid(uint256 tokenId) public view returns (bool) {
        uint256 aID = tokenToAuction[tokenId].auctionID;
        if (auctions[aID].started == true && auctions[aID].ended == false) {
            return true;
        } else {
            return false;
        }
    }

    function BidInfoWithTokenID(uint256 tokenId)
        public
        view
        returns (AuctionInfo memory)
    {
        uint256 aID = tokenToAuction[tokenId].auctionID;
        return auctions[aID];
    }

    function BidInfoWithBidID(uint256 aID)
        public
        view
        returns (AuctionInfo memory)
    {
        return auctions[aID];
    }

    function listPrevBids(uint256 tokenId)
        public
        view
        returns (prevBids[] memory)
    {
        uint256 aID = tokenToAuction[tokenId].auctionID;
        return bids[aID];
    }

    function listActiveBids() public view returns (AuctionInfo[] memory) {
        uint256 size = 0;
        uint256 index = 0;
        for (uint256 i = 1; i <= _auctionID.current(); i++) {
            if (auctions[i].started == true && auctions[i].ended == false) {
                size++;
            }
        }
        AuctionInfo[] memory items = new AuctionInfo[](size);
        for (uint256 i = 1; i <= _auctionID.current(); i++) {
            if (auctions[i].started == true && auctions[i].ended == false) {
                AuctionInfo storage current = auctions[i];
                items[index] = current;
                index++;
            }
        }
        return items;
    }

    function listUserActiveBid(address user)
        public
        view
        returns (AuctionInfo[] memory)
    {
        uint256 size = 0;
        uint256 index = 0;
        for (uint256 i = 1; i <= _auctionID.current(); i++) {
            if (
                auctions[i].started == true &&
                auctions[i].ended == false &&
                auctions[i].seller == user
            ) {
                size++;
            }
        }
        AuctionInfo[] memory items = new AuctionInfo[](size);
        for (uint256 i = 1; i <= _auctionID.current(); i++) {
            if (
                auctions[i].started == true &&
                auctions[i].ended == false &&
                auctions[i].seller == user
            ) {
                AuctionInfo storage current = auctions[i];
                items[index] = current;
                index++;
            }
        }
        return items;
    }
}
