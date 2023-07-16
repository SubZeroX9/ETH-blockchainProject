import React, { useEffect, useState, useContext,useRef } from 'react';
import Player from './Player';
import Card from './Card';
import Deck from './Deck';
import { createDeck, cardValue } from '../utils/deckUtils';
import { GameContext } from './GameContext';
import '../styles/Board.css';

const Board = () => {
  const initialized = useRef(false)
  const { playerCount } = useContext(GameContext);
  const [deck, setDeck] = useState([]);
  const [kuzar, setKuzar] = useState(null);
  const [players, setPlayers] = useState([]);
  const [mainAtttacker, setMainAttacker] = useState(null);
  const [currentAttacker, setCurrentAttacker] = useState(null);
  const [defender, setDefender] = useState(null);

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
      firstAttacker();
  }, [deck]); // This runs after deck has been set

  const firstAttacker = () => {
      // After dealing the cards, determine the starting player
    const sortedPlayers = [...players].sort((a, b) => {
      const aLowestCard = Math.min(...a.hand.map(card => cardValue(card)));
      const bLowestCard = Math.min(...b.hand.map(card => cardValue(card)));
      return aLowestCard - bLowestCard;
    });

  // set the first player to be the one with the lowest kuzar
    setMainAttacker(sortedPlayers[0]);
    setCurrentAttacker(sortedPlayers[0]);
    setDefender((sortedPlayers[0].id + 1) % playerCount);
  }

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
    <div className='gameBoard'>
       {players.map(player => (
        <Player 
          key={player.id} 
          player={player}
          updatePlayerHand={updatePlayerHand}
          isPlayer={player.id === 0}
        />
      ))}
      <div className='mainDeck'>
        { kuzar && <Card rank={kuzar.rank} suit={kuzar.suit} isFaceUp={true} /> }
        <Deck deck={deck} className='deck' />
      </div>
      <div className='playArea'></div>
    </div>
  );
}

export default Board;
