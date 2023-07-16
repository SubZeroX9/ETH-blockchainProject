import React, { useReducer,useContext,useEffect,useRef } from 'react';
import { deckReducer, DECKACTIONS } from '../reducers/deckReducer';
import { gameLogicReducer, GAMELOGICACTION } from '../reducers/gameLogicReducer';
import { playAreaReducer, PLAYAREAACTION } from '../reducers/playAreaReducer';
import { playersReducer, PLAYERACTION } from '../reducers/playersReducer';
import { getFirstAttacker } from '../utils/gameLogic';
import { createDeck } from '../utils/deckUtils';
import { GameContext } from './GameContext';
import Player from './Player';
import Card from './Card';
import Deck from './Deck';
import '../styles/Board.css';



const Board = () => {
    const { playerCount } = useContext(GameContext);
    const initialized = useRef(false);

  // Initialize the state and dispatch for each reducer
  const [deckState, deckDispatch] = useReducer(deckReducer, { deck: createDeck() , kuzar: null});
  const [gameLogicState, gameLogicDispatch] = useReducer(gameLogicReducer, {});
  const [playAreaState, playAreaDispatch] = useReducer(playAreaReducer, {attackCardsInPlay: [], defenseCardsInPlay: []});
  const [playersState, playersDispatch] = useReducer(playersReducer, {players: []});

    // Setup the game with initial values
    useEffect(() => {
        if(initialized.current) return
        playersDispatch({ type: PLAYERACTION.INIT_PLAYERS, payload: playerCount });
        initialized.current = true;
    }, []);

    useEffect(() => {
        if(!playersState.players.length) return;
        console.log(playersState)
        // // Use the new INIT_GAME action
        deckDispatch({ 
            type: DECKACTIONS.INIT_GAME, 
            payload: { players: playersState.players, deck: deckState.deck } 
        });
        console.log(deckState)
    },[playersState.players]);

    useEffect(() => {
        if(!deckState.kuzar) return;
        console.log(deckState)
        const firstAttacker = getFirstAttacker(playersState.players, deckState.kuzar.suit);
        console.log("first attacker is: " + firstAttacker)
        gameLogicDispatch({ type: GAMELOGICACTION.SET_MAIN_ATTACKER, payload: firstAttacker });
        gameLogicDispatch({ type: GAMELOGICACTION.SET_CURRENT_ATTACKER, payload: firstAttacker });
    }, [deckState]);

  // your other codes go here

  return (
    <div className='gameBoard'>
      { playersState.players.map(player => (
        <Player 
          key={player.id} 
          player={player}
          isPlayer={player.id === 0}
        />
      ))}
      <div className='mainDeck'>
        { deckState.kuzar && 
          <Card 
            rank={deckState.kuzar.rank} 
            suit={deckState.kuzar.suit} 
            isFaceUp={true} 
          /> 
        }
        {deckState.deck && <Deck deck={deckState.deck} className='deck' />}
      </div>
      <div className='playArea'>
        { playAreaState.attackCardsInPlay.map(card => 
          <Card 
            key={card.id} 
            rank={card.rank} 
            suit={card.suit} 
            isFaceUp={true} 
          />) 
        }
        { playAreaState.defenseCardsInPlay.map(card => 
          <Card 
            key={card.id} 
            rank={card.rank} 
            suit={card.suit} 
            isFaceUp={true} 
          />) 
        }
      </div>
    </div>
  );
  
}

export default Board;
