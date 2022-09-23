// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Whitelist is ERC1155, Ownable {

    uint256[] supplies = [50];

    uint256[] minted = [0];

    uint256[] rates = [0.25 ether];

    uint256 public maxNumberOfWhitelistedAddresses;

     uint256 public numberOfAddressesWhitelisted;
     mapping(address => bool) whitelistedAddresses;

    constructor(uint256 _maxWhitelistedAddresses) // 5 Addresses
        ERC1155(" https://gateway.pinata.cloud/ipfs/QmTyXAAfUFidfV3UF9HjAGRhR7cuix5iD7MaZsbnVKgvH8")
    {
        maxNumberOfWhitelistedAddresses = _maxWhitelistedAddresses;
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function addUserAddressToWhitelist(address _addressToWhitelist)
        public
        onlyOwner
    {
        require(!whitelistedAddresses[_addressToWhitelist], "Error: Sender already been whitelisted");
           
        require(numberOfAddressesWhitelisted < maxNumberOfWhitelistedAddresses, "Error: Whitelist Limit exceeded" );
     
        whitelistedAddresses[_addressToWhitelist] = true;
        numberOfAddressesWhitelisted += 1;
    }

    function mint(uint256 id, uint256 amount)
        public
        payable
    {    
        require(whitelistedAddresses[msg.sender], "Not in the whitelistedAddresses");
        require(id <= supplies.length, "Token doesn't exit");
        require(id > 0, "Token Doesn't exist");
        uint256 index = id - 1; 
        require(minted[index] + amount <= supplies[index],"not enogh ether");
        require(msg.value >= amount * rates[index],"less than the price");
        _mint(msg.sender, id, amount, "");
        minted[index] += amount;
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
    {
        _mintBatch(to, ids, amounts,data);
    }
}
//0xA8C1ac680055a11Be1Bb03C01e5B31Ab9236aC59 - contract address verified 