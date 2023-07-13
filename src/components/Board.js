import React, {useState} from 'react'
import '../styles/Board.css';
import '../styles/Card.css';
import Hand from './Hand'; // make sure the path to the Card component is correct



const Board = () => {
    const cards = [
        { rank: '6', suit: 'hearts' },
        { rank: '7', suit: 'clubs' },
        { rank: '8', suit: 'diamonds' },
        { rank: '9', suit: 'spades' },
        { rank: '10', suit: 'hearts' },
        { rank: 'Q', suit: 'hearts' },
        { rank: 'J', suit: 'hearts' },

        // Add more cards as needed
      ];

    return(
        <div>
            <Hand initialCards={cards} isFaceUp={true} isPlayerHand={true}/>
            <Hand initialCards={cards} isFaceUp={false} isPlayerHand={false}/>
        </div>
    )
}

export default Board;