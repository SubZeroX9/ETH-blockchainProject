import React, { useState, useEffect } from 'react';
import Card from './Card';
import '../styles/Hand.css';

const Hand = ({ hand, isFaceUp, isPlayerHand }) => {
    const [cards, setCards] = useState(hand);
    const handClass = isPlayerHand ? 'hand player-hand' : 'hand';

    useEffect(() => {
        setCards(hand);
    }, [hand]);  // Added dependencies

    const renderCards = () => {
        return cards.map((card, index) => (
            <Card 
                key={index}
                rank={card.rank} 
                suit={card.suit} 
                isFaceUp={isFaceUp}
                index={index}
                depth={cards.length - index}
            />
        ));
    }

    return (
        <div className={handClass}>
            {renderCards()}
        </div>
    );
};

export default Hand;
