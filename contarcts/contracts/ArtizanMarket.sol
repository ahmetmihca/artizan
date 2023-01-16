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
    Counters.Counter private _listID;
    address payable owner;

    struct ListInfo {
        uint256 nft_id;
        uint256 price;
        uint256 time; //in second
        uint256 expire_date; // inital 0
        address owner;
        address seller;
        string company;
    }
    mapping(uint256 => uint256) private tokenIDToListID;
    mapping(uint256 => ListInfo) private ListIDToListInfo;
    mapping(address => uint256[]) private usersTotokenID;


    event Listing(
        uint256 indexed tokenID,
        uint256 time,
        address seller,
        uint256 price
    );

    event Buying(
        uint256 nft_id,
        uint256 time,
        uint256 expire_date,
        address owner
    );
    constructor() {
        owner = payable(msg.sender);
        addToWhitelist(payable(msg.sender),payable(msg.sender) ,"contract_owner");
    }

    function createMarketItem(
        uint256 price,
        uint256 nft_id,
        uint256 time,
        address nft_address,
        string memory company
    ) public payable nonReentrant {
        require(price > 0, "Too low");
        _listID.increment();
        uint256 listID = _listID.current();
        tokenIDToListID[nft_id] = listID;
        ListIDToListInfo[listID] = ListInfo(
            nft_id,
            price,
            time,
            0,
            payable(address(this)),
            payable(msg.sender),
            company
        );
        IERC721(nft_address).transferFrom(msg.sender, address(this), nft_id);
        emit Listing(nft_id, time, msg.sender, price);
    }

    function createMarketSale(address nft_address, uint256 nft_id)
        public
        payable
        nonReentrant
    {
        uint256 listID = tokenIDToListID[nft_id];
        uint256 currentPrice = ListIDToListInfo[listID].price;
        uint256 currentTokenId = ListIDToListInfo[listID].nft_id;
        address seller = ListIDToListInfo[listID].seller;
        require(msg.value >= currentPrice, "Please pay the asking price");

        ListIDToListInfo[listID].owner = payable(msg.sender);
        ListIDToListInfo[listID].seller = payable(address(0));
        uint256 lifeTime = ListIDToListInfo[listID].time;
        ListIDToListInfo[listID].expire_date = block.timestamp + lifeTime;
        IERC721(nft_address).transferFrom(
            address(this),
            msg.sender,
            currentTokenId
        );
        payable(seller).transfer(msg.value);
        usersTotokenID[msg.sender].push(nft_id);
        emit Buying(
            nft_id,
            ListIDToListInfo[listID].time,
            ListIDToListInfo[listID].expire_date,
            msg.sender
        );
    }

    function verify(string memory companyToAccess) public view returns (bool) {
        uint256 membershipNumber = usersTotokenID[msg.sender].length;
        for (uint256 i = 0; i < membershipNumber; i++) {
            uint256 tokenID = usersTotokenID[msg.sender][i];
            uint256 listID = tokenIDToListID[tokenID];
            string memory company = ListIDToListInfo[listID].company;
            if (
                keccak256(abi.encodePacked(company)) ==
                keccak256(abi.encodePacked(companyToAccess))
            ) {
                uint256 currentBlock = block.timestamp;
                uint256 expire_date = ListIDToListInfo[listID].expire_date;
                if (expire_date >= currentBlock) {
                    return true;
                } else {
                    return false;
                }
            }
        }
        return false;
    }

    function StopNFTSale(address NftCont, uint256 tokenId)
        public
        payable
        nonReentrant
    {
        uint256 listID = tokenIDToListID[tokenId];
        require(
            msg.sender == ListIDToListInfo[listID].seller,
            "Only item seller can perform this"
        );
        ListIDToListInfo[listID].seller = payable(address(0));
        ListIDToListInfo[listID].owner = payable(msg.sender);

        IERC721(NftCont).transferFrom(address(this), msg.sender, tokenId);
    }

    function NFTItem(uint256 tokenId) public view returns (ListInfo memory) {
        uint256 item = tokenIDToListID[tokenId];
        return ListIDToListInfo[item];
    }
    // The contract defines a struct to represent an address on the
    // whitelist.
    struct WhitelistEntry {
        // The address of the whitelisted account.
        address account;
        // The name of the whitelisted account.
        string name;
    }
    // The contract defines a mapping to store the whitelist entries.
    // The keys of the mapping are the whitelisted addresses, and the
    // values are the corresponding whitelist entries.
    mapping(address => WhitelistEntry) public whitelist;

    // The contract also defines an array to store the whitelist entries
    // in the order in which they were added. This allows us to iterate
    // over the whitelist entries in the order in which they were added.
    WhitelistEntry[] public whitelistArray;

    // The contract defines an event that is emitted whenever a new
    // address is added to the whitelist.
    event WhitelistAdded(
        // The address of the account that was added to the whitelist.
        address account,
        // The name of the account that was added to the whitelist.
        string name
    );

    // The contract defines a function to check if a given address is
    // on the whitelist.
    function isWhitelisted(address account) public view returns (bool) {
        // Return true if the given address is on the whitelist,
        // and false otherwise.
        return whitelist[account].account != address(0);
    }
    function isOwner(address account) public view returns (bool) {
        // Return true if the given address is on the whitelist,
        // and false otherwise.
        if(account==owner)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    // The contract defines a function to add a new address to the
    // whitelist. Only the contract owner is allowed to call this
    // function.
    function addToWhitelist(address account, address caller, string memory name)
        public
    {
        // Ensure that the given address is not already on the whitelist.
        require(
            whitelist[account].account == address(0),
            "Address is already on the whitelist."
        );
        require(
            isOwner(caller),
            "Caller is not the owner of the contract."
        );

        // Create a new whitelist entry for the given address.
        WhitelistEntry memory entry = WhitelistEntry({
            account: account,
            name: name
        });

        // Add the entry to the whitelist mapping and array.
        whitelist[account] = entry;
        whitelistArray.push(entry);

        //whitelistArray[0].name= "contractOwnerUgur";

        // Emit an event to indicate that the address was added to the whitelist.
        emit WhitelistAdded(account, name);
    }
    // Define the owner() function to return the contract owner.
    function getOwner() public view returns (address) {
        return owner;
    }
}
