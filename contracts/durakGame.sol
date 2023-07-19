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
        uint256 cost = 10 * (10 ** tokenContract.decimals());
        tokenContract.transferFrom(msg.sender, address(this), cost);
        currentGame[msg.sender] = true;
        tokenContract.addMinter(msg.sender); // Add the player as a minter
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

            tokenContract.transfer(msg.sender, reward);
            lastGameResult[msg.sender] = reward;
        } else {
            lastGameResult[msg.sender] = 0;
        }

        tokenContract.removeMinter(msg.sender); // Remove the player as a minter
    }

    function simulateGame() public {
        endGame((block.timestamp % 2) == 0); // 50% chances of winning
    }
}

//0xDeb3053207846d81648521b63d856DCfcb7Cdc5a