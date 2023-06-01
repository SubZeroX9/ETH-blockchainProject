import React, { useState, useEffect } from 'react';
import Card from './Card';
import { createDeck } from '../utils/deckUtils';
import '../styles/Deck.css';

function Deck() {
    const [deck, setDeck] = useState([]);

    useEffect(() => {
        setDeck(createDeck());
    }, []);

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
