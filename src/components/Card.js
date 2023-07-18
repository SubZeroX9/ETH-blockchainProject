import React from 'react';
import '../styles/Card.css';

const Card = ({ rank, suit, isFaceUp, index, depth=1 ,onCardClick }) => {

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

    const isFaceCard = ['J', 'Q', 'K'].includes(rank);
    const suitSymbol = getSuit(suit);

    const generateSuitSymbols = () => {
        let symbols = [];
        const ranks = ['6', '7', '8', '9', '10'];
        if (ranks.includes(rank)) {
            const numericRank = parseInt(rank, 10);
            let halfwayPoint;
            switch (numericRank) {
                case 6:
                    halfwayPoint = 4;
                    break;
                case 7:
                    halfwayPoint = 5;
                    break;
                case 8:
                    halfwayPoint = 4;
                    break;
                default:
                    halfwayPoint = 5;
                    break;
            }
            for(let i = 0; i < numericRank; i++) {
                let suitClass = i < halfwayPoint ? 'suit-normal' : 'suit-rotated';
                symbols.push(
                    <div
                        key={i}
                        className={`card-middle-suit ${suitClass}`}
                        style={{ gridArea: 'suit'+(i+1) }}
                    >
                        {suitSymbol}
                    </div>
                );
            }
        } else if(rank === 'A') {
            symbols.push(
                <div
                    key={0}
                    className={`suit-normal`}
                >
                    {suitSymbol}
                </div>
            );
        }

        return symbols;
    }
    
    return (
        <div 
            className={`card ${suit} ${isFaceCard ? `face-card-${rank}` : ''}`} 
            data-index={index}
            style={{ transform: `translateZ(-${depth}em)` }}
            onClick={onCardClick}
        >
            {isFaceUp ? (
                <>
                    <div className="card-corner top-left">
                        <div className="card-value">{rank}</div>
                        <div className="card-suit">{suitSymbol}</div>
                    </div>
                    <div className={`card-middle-container rank-${rank}`}>
                        {generateSuitSymbols()}
                    </div>
                    <div className="card-corner bottom-right">
                        <div className="card-value">{rank}</div>
                        <div className="card-suit">{suitSymbol}</div>
                    </div>
                </>
            ) : (
                <div className="card-back"></div>
            )}
        </div>
    );
};

export default Card;
