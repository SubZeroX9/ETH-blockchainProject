import React from 'react';
import '../styles/Card.css';

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

    const rankClass = ['6', '7', '8'].includes(rank) 
        ? 'rank-6-8' 
        : ['9', '10'].includes(rank) 
            ? 'rank-9-10' 
            : '';

    const generateSuitSymbols = () => {
        let symbols = [];
        if (['A', '6', '7', '8', '9', '10'].includes(rank)) {
            const numericRank = rank === 'A' ? 1 : parseInt(rank, 10);
            for(let i = 0; i < numericRank; i++) {
                symbols.push(<div key={i} className={`card-middle-suit ${rankClass}`}>{suitSymbol}</div>);
            }
        }
        return symbols;
    }

    return (
        <div className={`card ${suit} ${isFaceCard ? 'face-card' : ''}`} data-index={index}>
            {isFaceUp ? (
                <>
                    <div className="card-corner top-left">
                        <div className="card-value">{rank}</div>
                        <div className="card-suit">{suitSymbol}</div>
                    </div>
                    <div className="card-middle-container">
                        {generateSuitSymbols()}
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
