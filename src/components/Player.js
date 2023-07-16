import React, { useEffect } from 'react';
import Hand from './Hand';

const Player = ({ player, updatePlayerHand, isPlayer }) => {
  
  // useEffect(() => {
  //   // Deal cards when the component mounts
  //   updatePlayerHand(player.id, player.hand);
  // }, [player.hand, updatePlayerHand]);  // Added dependencies

  return (
    <div>
      <h2>{isPlayer ? "You" : `AI Player ${player.id}`}</h2>
      <Hand hand={player.hand} isFaceUp={isPlayer} isPlayerHand={isPlayer}/>
    </div>
  );
}

export default Player;
