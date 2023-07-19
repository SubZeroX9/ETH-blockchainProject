import React, { useEffect } from 'react';
import Hand from './Hand';
import '../styles/Player.css';

const Player = ({ player, isPlayer,onCardClick }) => {
  
  // }, [player.hand, updatePlayerHand]);  // Added dependencies

  return (
    <div className={`player player${player.id}`}>
      <h2>{isPlayer ? "You" : `AI Player ${player.id}`}</h2>
      <Hand hand={player.hand} isFaceUp={isPlayer} isPlayerHand={isPlayer} onCardClick={(card) => onCardClick(player, card)}/>
    </div>
  );
}

export default Player;
