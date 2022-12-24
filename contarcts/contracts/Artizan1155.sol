// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Artizan1155 is ERC1155, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address contractAddress;

    mapping(uint256 => string) private _tokenURIs; //id to uri
    mapping(uint256 => uint256) private _amounts; //id to amount

    constructor(address marketplace) ERC1155("AZ1155") {
        contractAddress = marketplace;
    }

    //constructor() ERC1155("AZ1155") {}

    //uint256 public mintRate = 0.00001 ether;

    function _setTokenURI(uint256 tokenId, string memory _tokenURI)
        internal
        virtual
    {
        _tokenURIs[tokenId] = _tokenURI;
    }

    function _setTokenAmount(uint256 tokenId, uint256 amount) internal virtual {
        _amounts[tokenId] = amount;
    }

    function mintNFT(string memory _tokenURI, uint256 amount)
        public
        returns (uint256)
    {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId, amount, "");
        _setTokenURI(newItemId, _tokenURI);
        _setTokenAmount(newItemId, amount);
        setApprovalForAll(contractAddress, true);
        return newItemId;
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return (_tokenURIs[tokenId]);
    }

    function transferToken(
        address from,
        address to,
        uint256 tokenId,
        uint256 amount
    ) external {
        require(
            balanceOf(from, tokenId) >= 1,
            "From address must have that token id"
        );
        safeTransferFrom(from, to, tokenId, amount, "");
    }

    function amountOf(uint256 tokenId) external view returns (uint256) {
        return _amounts[tokenId];
    }
}
