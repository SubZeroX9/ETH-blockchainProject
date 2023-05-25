import React from 'react';
import './Card.css';

const Card = ({value, suit}) => {

    const getSuit = (suit) => {
        switch(suit) {
            case 'hearts':
                return '♥';
            case 'diamonds':
                return '♦';
            case 'spades':
                return '♠';
            case 'clubs':
                return '♣';
            default:
                return null;
        }
    }

    const isFaceCard = ['J', 'Q', 'K', 'A'].includes(value);
    const suitSymbol = getSuit(suit);

    return (
        <div className={`card ${suit} ${isFaceCard ? 'face-card' : ''}`}>
            <div className="card-corner top-left">
                <div className="card-value">{value}</div>
                <div className="card-suit">{suitSymbol}</div>
            </div>
            <div className="card-corner bottom-right">
                <div className="card-value">{value}</div>
                <div className="card-suit">{suitSymbol}</div>
            </div>
        </div>
    );
};

export default Card;
