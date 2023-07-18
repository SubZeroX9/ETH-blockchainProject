// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract durakToken is ERC20 {
    address public owner;
    uint256 public initialSupply;

    constructor(uint256 _initialSupply) ERC20("Durak Token", "DURAK") {
        owner = msg.sender;
        initialSupply = _initialSupply * (10**decimals());
        _mint(owner, initialSupply);
    }

    function mintTokens(uint256 amount) public {
        require(msg.sender == owner, "Only the owner can mint tokens");
        _mint(owner, amount);
    }
}