import React, { useState } from 'react';
import Card from './Card';
import '../styles/Hand.css';

const Hand = ({ initialCards, isFaceUp, isPlayerHand }) => {
    const [cards, setCards] = useState(initialCards);
    const handClass = isPlayerHand ? 'hand player-hand' : 'hand';

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
