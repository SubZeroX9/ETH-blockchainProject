// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./durakToken.sol";

contract durakGame {
    durakToken public tokenContract;
    mapping(address => bool) public currentGame;
    mapping(address => uint256) public lastGameResult;

    constructor(address _tokenContractAddress) {
        tokenContract = durakToken(_tokenContractAddress);
    }

    function startGame() public {
        uint256 cost = 10 * (10 ** tokenContract.decimals()); // Cost of a game is 10 tokens
        tokenContract.transferFrom(msg.sender, address(this), cost); // Transfer the cost from the player to the contract
        currentGame[msg.sender] = true; // Set the game as started for the user
    }

    // This function should be called by the logic that determines if the user has won
    function endGame(bool won) public {
        require(currentGame[msg.sender] == true, "You need to start a game first");
        currentGame[msg.sender] = false; // Set the game as ended for the user
        if (won) {
            uint256 reward = 12 * (10 ** tokenContract.decimals()); // Winning yields 12 tokens (original 10 + 20%)
            tokenContract.transfer(msg.sender, reward); // Transfer the reward from the contract to the player
            lastGameResult[msg.sender] = reward; // Save the last game result
        } else {
            lastGameResult[msg.sender] = 0; // Save the last game result
        }
    }

    // This function is just for demonstrative purposes
    // In a real-world scenario, you should have a secure way to generate random outcomes or use a provably fair system
    function simulateGame() public {
        endGame((block.timestamp % 2) == 0); // 50% chances of winning
    }
}
