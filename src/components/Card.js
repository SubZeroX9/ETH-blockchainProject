import React from 'react';
import './Card.css';

const Card = ({ rank, suit, isFaceUp, index }) => {

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

    const isFaceCard = ['J', 'Q', 'K', 'A'].includes(rank);
    const suitSymbol = getSuit(suit);

    return (
        <div className={`card ${suit} ${isFaceCard ? 'face-card' : ''}`} data-index={index}>
            {isFaceUp ? (
                <>
                    <div className="card-corner top-left">
                        <div className="card-value">{rank}</div>
                        <div className="card-suit">{suitSymbol}</div>
                    </div>
                    <div className="card-corner bottom-right">
                        <div className="card-value">{rank}</div>
                        <div className="card-suit">{suitSymbol}</div>
                    </div>
                </>
            ) : (
                <div className="card-back"> 
                    {/* Here you can add the design or an image for the back of the card. */}
                </div>
            )}
        </div>
    );
};

export default Card;
