// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract durakToken is ERC20 {
    address public owner;
    uint256 public initialSupply;
    mapping(address => bool) public minters;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can execute this");
        _;
    }

    modifier onlyMinter() {
        require(minters[msg.sender], "Only minters can execute this");
        _;
    }

    constructor(uint256 _initialSupply) ERC20("Durak Token", "DURAK") {
        owner = msg.sender;
        initialSupply = _initialSupply * (10**decimals());
        _mint(owner, initialSupply);
        minters[owner] = true; // by default, owner is a minter
    }

    function addMinter(address minter) external onlyOwner {
        minters[minter] = true;
    }

    function removeMinter(address minter) external onlyOwner {
        minters[minter] = false;
    }

    function mintTokens(uint256 amount) external onlyMinter {
        _mint(msg.sender, amount);
    }

    function buyTokens() public payable {
        require(msg.value > 0, "You need to send some Ether");
        uint256 tokensToBuy = msg.value * 10000; // 1 ETH = 10000 DURAK
        _mint(msg.sender, tokensToBuy);
    }
}
//0x4Ebc063Bff53f96E9Cc2Ba0Cf04EA8b27a432aE8