import React, { useEffect, useState, useContext,useRef } from 'react';
import Player from './Player';
import Card from './Card';
import Deck from './Deck';
import { createDeck } from '../utils/deckUtils';
import { GameContext } from './GameContext';

const Board = () => {
  const initialized = useRef(false)
  const { playerCount } = useContext(GameContext);
  const [deck, setDeck] = useState([]);
  const [kuzar, setKuzar] = useState(null);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    if(initialized.current) return
    const deck = createDeck();
    setDeck(deck);
    const initialPlayers = Array(playerCount).fill().map((_, idx) => ({
      id: idx,
      hand: [],
      score: 0,
    }));
    setPlayers(initialPlayers);
    initialized.current = true;
}, []); // The empty array causes this to only run once

useEffect(() => {
    if(!deck) return;
    const kuzar = drawKuzar(deck);
    setKuzar(kuzar);
    dealInitialCards();
}, [deck]); // This runs after deck has been set


  const drawKuzar = (deck) => {
    return deck.pop();
  }

  const dealInitialCards = () => {
    for (let i = 0; i < 6; i++) {
      players.forEach(player => {
        player.hand.push(deck.pop());
      });
      
    }
  }

  const updatePlayerHand = (playerId, newHand) => {
    // find the player by id, update their hand and set the state
    setPlayers(players.map(player => player.id === playerId ? {...player, hand: newHand} : player));
  }

  return (
    <div>
       {players.map(player => (
        <Player 
          key={player.id} 
          player={player}
          updatePlayerHand={updatePlayerHand}
          isPlayer={player.id === 0}
        />
      ))}
      <h2>Kuzar</h2>
      { kuzar && <Card rank={kuzar.rank} suit={kuzar.suit} isFaceUp={true} /> }
      <Deck deck={deck} />
    </div>
  );
}

export default Board;
