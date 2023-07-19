// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./durakToken.sol";

contract durakGame {
    durakToken public tokenContract;
    mapping(address => bool) public currentGame;
    mapping(address => uint256) public lastGameResult;
    mapping(address => uint256) public userDeposits;  // Keep track of each user's deposit

    constructor(address _tokenContractAddress) {
        tokenContract = durakToken(_tokenContractAddress);
    }

    // Allows user to deposit tokens into the game contract
    function depositTokens(uint256 amount) external {
        require(amount > 0, "Amount should be greater than 0");
        tokenContract.transferFrom(msg.sender, address(this), amount);
        userDeposits[msg.sender] += amount;
    }

    // Retrieves the deposited amount for the caller
    function getDeposit() external view returns (uint256) {
        return userDeposits[msg.sender];
    }

    function startGame() public {
        uint256 cost = 10 * (10 ** tokenContract.decimals());
        require(userDeposits[msg.sender] >= cost, "Insufficient deposited funds");

        userDeposits[msg.sender] -= cost;  // Deduct from the user's deposit
        currentGame[msg.sender] = true;
    }

    function endGame(bool won) public {
        require(currentGame[msg.sender], "You need to start a game first");
        currentGame[msg.sender] = false;

        if (won) {
            uint256 reward = 12 * (10 ** tokenContract.decimals());
            uint256 contractBalance = tokenContract.balanceOf(address(this));

            if (contractBalance < reward) {
                uint256 amountToMint = reward - contractBalance;
                tokenContract.mintTokens(amountToMint);
            }

            userDeposits[msg.sender] += reward;  // Add the reward to the user's deposit
            lastGameResult[msg.sender] = reward;
        } else {
            lastGameResult[msg.sender] = 0;
        }
    }

    // Allows the user to withdraw their deposit
    function withdrawDeposit(uint256 amount) external {
        require(amount <= userDeposits[msg.sender], "Insufficient funds");
        userDeposits[msg.sender] -= amount;
        tokenContract.transfer(msg.sender, amount);
    }

    function simulateGame() public {
        endGame((block.timestamp % 2) == 0); // 50% chances of winning
    }
    function hasActiveGame() external view returns (bool) {
        return currentGame[msg.sender];
    }
}
//0xEd336552424C30Dc0d8d6f793A0fBb5e7D1fa356