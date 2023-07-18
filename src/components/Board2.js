import React, { useEffect, useState, useContext,useRef } from 'react';
import Player from './Player';
import Card from './Card';
import Deck from './Deck';
import { createDeck } from '../utils/deckUtils';
import { findStartingPlayer } from '../utils/gameLogic';
import { chooseFirstCardToAttackWith, chooseCardToAttackWith,chooseCardToDefendWith } from '../utils/aiLogic';
import { GameContext } from './GameContext';
import '../styles/Board.css';

// Define the game phases
const gamePhases = ['ATTACK', 'DEFENSE', 'SWITCH_ROLES', 'CHECK_WIN', 'DRAW_CARDS'];


const Board2 = () => {
  const initialized = useRef(false);
  const { playerCount } = useContext(GameContext);
  const [deck, setDeck] = useState([]);
  const [kuzar, setKuzar] = useState(null);
  const [players, setPlayers] = useState([]);
  const [gamePhase, setGamePhase] = useState(gamePhases[0]);
  const [attackCardsInPlay, setAttackCardsInPlay] = useState([]);
  const [defenseCardsInPlay, setDefenseCardsInPlay] = useState([]);
  const [isAwaitingCardSelection, setIsAwaitingCardSelection] = useState(false);

  // The below variables are now managed using useRef
  let mainAttacker = useRef(null);
  let currentAttacker = useRef(null);
  let defender = useRef(null);
  let firstAttack = useRef(true);

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

  useEffect(() => {
      if(!kuzar) return;
      firstAttacker();
  }, [kuzar]);

  const firstAttacker = () => {
      // After dealing the cards, determine the starting player
    console.log(kuzar)
    const startingPlayer = findStartingPlayer(players, kuzar.suit)
    console.log("startingPlayer is:\n"+startingPlayer)
    let atackerIndex = startingPlayer;
    let defenderIndex = (atackerIndex + 1) % playerCount;
  // set the first player to be the one with the lowest kuzar
    mainAttacker = players[atackerIndex];
    currentAttacker= players[atackerIndex];
    defender=players[defenderIndex];
    game();
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

  const game = () => {
    while(true){
      if(attackCardsInPlay.length < 6 || defender.hand.length !== 0)
        attack();
      // if (checkForWin()) {
      //   break;
      // }
      if(isAwaitingCardSelection)
        continue;
      defense();
      // if (checkForWin()) {
      //   break;
      // }
      if(defender.hand.length === 0){
        switchRoles();
      }
    }
  }

  const attack = () => {
    if(currentAttacker.id === 0){
      if (isAwaitingCardSelection) {
      // Do nothing, just wait until a card is selected
      } 
      console.log("human attack")
      return;
    }

    let cardToPlay = null;
    do{
      cardToPlay = null;
      if(firstAttack){
        cardToPlay = chooseFirstCardToAttackWith(currentAttacker.hand, kuzar);
        firstAttack = false;
      }
      else
        cardToPlay = chooseCardToAttackWith(currentAttacker.hand,attackCardsInPlay,defenseCardsInPlay, kuzar);
      

      if(cardToPlay !== null && attackCardsInPlay.length < 6 && ((attackCardsInPlay.length - defenseCardsInPlay.length) - defender.hand.length>0)){
        cardToPlay.isFaceUp = true;
        attackCardsInPlay.push(cardToPlay);
        currentAttacker.hand = currentAttacker.hand.filter(card => card !== cardToPlay);
      }
      else{
        setNextAttacker();
      }
      
    }while(cardToPlay === null)
  }

  const defense = () => {
    let defended = true;
    if(defender.id === 0){console.log("human defense")}
    attackCardsInPlay.forEach((attackCard, index) => {
      // Choose a card to defend with
      const defenseCard = chooseCardToDefendWith(defender.hand, attackCard, kuzar);
      if (defenseCard) {
        // Add the card to defenseCardsInPlay and remove it from the defender's hand
        defenseCardsInPlay.push(defenseCard);
        defender.hand = defender.hand.filter(card => card !== defenseCard);
      } else {
        // If the defender cannot defend, end the defense phase
        pickUpCards();
        defended = false;
      }
    });
    
    if (!defended)
      return

    // If all attack cards have been defended, switch roles
    if (defenseCardsInPlay.length === attackCardsInPlay.length) {
      setNextAttacker();
    }
  };

  const pickUpCards = () => {
    // Add the attack and defense cards to the defender's hand
    defender.hand = defender.hand.concat(attackCardsInPlay, defenseCardsInPlay);
  
    // Clear the attack and defense cards
    setAttackCardsInPlay([]);
    setDefenseCardsInPlay([]);
  
    // Switch roles
    skipDefender();
  };

  const skipDefender = () => {
    // The defender becomes the main attacker
    let newAttackerIndex =  (defender.id + 1) % playerCount;
    mainAttacker = players[newAttackerIndex];
    currentAttacker = players[newAttackerIndex];
    defender = players[(newAttackerIndex + 1) % playerCount];
  
    // The next player becomes the defender
    let defenderIndex = (players.findIndex(player => player.id === defender.id) + 1) % playerCount;
    defender = players[defenderIndex];
  };
  
  const switchRoles = () => {
    // The defender becomes the main attacker
    mainAttacker = defender;
    currentAttacker = defender;
  
    // The next player becomes the defender
    let defenderIndex = ( defender.id + 1) % playerCount;
    defender = players[defenderIndex];
  
    // Clear the attack and defense cards
    setAttackCardsInPlay([]);
    setDefenseCardsInPlay([]);
  };

  const setNextAttacker = () => {
    let nextAttackerId = currentAttacker.id;
    let nextAttacker = null;
    while(nextAttacker !== defender){
      nextAttacker = players[(nextAttackerId + 1) % playerCount];
      if(nextAttackerId !== defender.id && nextAttacker.hand.length > 0){
        currentAttacker = nextAttacker;
        return;
      }
      nextAttackerId = (nextAttackerId + 1) % playerCount;
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
      <div className='playArea'>
        { attackCardsInPlay.map(card => <Card key={card.id} rank={card.rank} suit={card.suit} isFaceUp={true} />) }
        { defenseCardsInPlay.map(card => <Card key={card.id} rank={card.rank} suit={card.suit} isFaceUp={true} />) }
      </div>
    </div>
  );
}

export default Board2;
