import React from 'react';
import Card from './Card';
import '../styles/Deck.css';

function Deck({ deck }) {
    return (
        <div className="deck">
            {deck.map((card, index) => (
                <Card 
                    key={index} 
                    rank={card.rank} 
                    suit={card.suit} 
                    isFaceUp={card.isFaceUp} 
                    index={index}
                    depth={index * 0.3} // Here, we provide each card its depth
                />
            ))}
        </div>
    );
}

export default Deck;
