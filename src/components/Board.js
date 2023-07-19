import React, { useReducer,useContext,useEffect,useRef, useState } from 'react';
import { deckReducer, DECKACTIONS } from '../reducers/deckReducer';
import { gameLogicReducer, GAMELOGICACTION,GAMEPHASES } from '../reducers/gameLogicReducer';
import { getFirstAttacker } from '../utils/gameLogic';
import { createDeck } from '../utils/deckUtils';
import { GameContext } from './GameContext';
import Player from './Player';
import Card from './Card';
import Deck from './Deck';
import '../styles/Board.css';
import { chooseFirstCardToAttackWith, chooseCardToAttackWith,chooseCardToDefendWith,isCardValidToAttackWith,isCardValidToDefendWith } from '../utils/aiLogic';
import { useNavigate } from 'react-router-dom';
import durakGameabi from '../ABIs/durakGameABI.json';
import { ethers } from 'ethers';





const Board = () => {
  const navigate = useNavigate();
  const { playerCount } = useContext(GameContext);
  const [deckState, deckDispatch] = useReducer(deckReducer, { deck: createDeck() , kuzar: null});
  const [gameLogicState, gameLogicDispatch] = useReducer(gameLogicReducer, {initialized: false, mainAttacker: null, currentAttacker: null, defender: null, firstAttack: true, gamePhase: 'INITIALIZE'});
  const [attackCardsInPlay, setAttackCardsInPlay] = useState([]);
  const [defenseCardsInPlay, setDefenseCardsInPlay] = useState([null, null, null, null, null, null]);
  const [players, setPlayers] = useState([]);
  let isFirstAttack = useRef(true);
  let initialized = useRef(false);
  const [isHumanTurn, setIsHumanTurn] = useState(false);
  const [gameWinner, setGameWinner] = useState(null);
  const [gameLoser, setGameLoser] = useState(null);
  const isKuzarDealt = useRef(false);
  const [canPlay,setCanPlay] = useState([]);
  let cardPlayed = useRef(false);
  const [durakContract, setDurakContract] = useState(null);

  const contractAddressDurakTokens = "0x996b0fBBE26b9C7Ce3Cf3A2955aa4f19Cb036AF5";
  const contractAddressDurakGame = "0xEd336552424C30Dc0d8d6f793A0fBb5e7D1fa356";
  
  // let isDefenseSuccessful = useRef(false);

    // Setup the game with initial values
    useEffect(() => {
        if(initialized.current) return
        initPlayers();
        initialized.current = true;
    }, []);

    useEffect(() => {
        if(!players.length) return;
        console.log(players)
        // // Use the new INIT_GAME action
        deckDispatch({ 
            type: DECKACTIONS.INIT_GAME, 
            payload: { players: players, deck: deckState.deck } 
        });
        console.log(deckState)
    },[players]);

    useEffect(() => {
        if(!deckState.kuzar) return;
        console.log(deckState)
        const firstAttacker = getFirstAttacker(players, deckState.kuzar.suit);
        console.log("first attacker is: " + firstAttacker)
        setCanPlay([...Array(players.length).keys()].map((canPlay,i) => i !== firstAttacker));
        let defender = (firstAttacker + 1) % players.length;
        gameLogicDispatch({ type: GAMELOGICACTION.INIT_TURN, payload: {nextAttacker: players[firstAttacker], nextDefender: players[defender]}});
        gameLogicDispatch({ type: GAMELOGICACTION.SET_INITIALIZED });
    }, [deckState]);

    useEffect(() => {
      switch(gameLogicState.gamePhase) {
        case GAMEPHASES.INITIALIZE:
          // wait for the game to initialize
          break;
        case GAMELOGICACTION.TURN_OVER:
          // turn over
          console.log("turn over")
          console.log("dealing cards")
          dealCards();
          updateAttackerAndDefender();
          isFirstAttack.current = true;
          break;
        case GAMEPHASES.ATTACK:
            // attack
            console.log("attacking")
            attack();
          break;
        case GAMEPHASES.DEFEND:
            // defend
            console.log("defending")
            defend();
          break;
        default:
            //do nothing
      }

    }, [gameLogicState.gamePhase]);

    
  useEffect(() => {
    if(gameLogicState.gamePhase === GAMEPHASES.TURN_OVER){}
    else if(gameLogicState.gamePhase === GAMEPHASES.ATTACK){
      attack();
    }
    else if(gameLogicState.gamePhase === GAMEPHASES.DEFEND){
      defend();
    }

  },[attackCardsInPlay, defenseCardsInPlay]);

  useEffect(() => {
    if(!canPlay.length) return
    if(canPlay.every((canPlay) => canPlay === false)){
      gameLogicDispatch({ type: GAMELOGICACTION.TURN_OVER,
        payload:{ isDefenseSuccessful : true} });
        clearCardsInPlay();
    }
  },[canPlay]);

    const initPlayers = () => {
      const players = Array(playerCount).fill().map((_, idx) => ({
        id: idx,
        hand: [],
        score: 0,
      }));
      setPlayers(players);
    }

    const checkWinner = () => {
      let winner = null;

      if(deckState.deck.length === 0 && gameLogicState.defender.hand.length === 0){
        winner = gameLogicState.defender;
        setPlayers(players.filter(player => player.id !== winner.id));
      }
      if(winner !== null){
        if(winner.id === 0){
          //change to local function
          GameOverWinner();
        }
        setGameWinner(winner);
      }

      if(winner === null){
        let playersLeft = players.filter(player => player.id !== gameLogicState.defender.id).sort((a,b) => b.id - a.id);
        for(let player of playersLeft){
          if(player.hand.length === 0){
            winner = player;
            setPlayers(players.filter(player => player.id !== winner.id));
            setGameWinner(winner);
            GameOverLoser();
            break;
          }
        }
      }
    }

    const GameOverWinner = async () => {
      console.log("game over winner");
      try {
        const tx = await durakContract.endGame(true);
        const trx_resp = await tx.wait();

        console.log('Transaction hash:', trx_resp.transactionHash);
        console.log("You were Rewarded!")
        alert("Game Over! You win!");
        moveToManu();
      } catch (error) {
          console.error('Error fetching deposited amount:', error);
      }
    }

    const GameOverLoser = async () => {
      console.log("game over sorry you didnt win")
      try {
        const tx = await durakContract.endGame(false);
        const trx_resp = await tx.wait();

        console.log('Transaction hash:', trx_resp.transactionHash);
        console.log("You didnt get anything!")
        alert("Game Over! You didnt win!");
        moveToManu();
      } catch (error) {
          console.error('Error fetching deposited amount:', error);
      }
    }

    useEffect(() => {
      getContract();
    },[]);

    const getContract = async () => {
      let tempProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = await tempProvider.getSigner();
      const durakGameContract = new ethers.Contract(contractAddressDurakGame, durakGameabi, signer);
      setDurakContract(durakGameContract);
    }

    

    const moveToManu = () => {
      navigate('/');
    }

    const updateAttackerAndDefender = () => {
      console.log("updating attacker and defender")
      let nextAttackerId = gameLogicState.currentAttacker.id;
      let nextAttacker = null;
      let nextDefender = null;
      let nextDefenderId;
      if(gameLogicState.isDefenseSuccessful){
        nextAttacker = gameLogicState.defender;
        nextDefenderId = (gameLogicState.defender.id + 1) % players.length;
        nextDefender = players[nextDefenderId];
        console.log("next defender is: " , nextDefender)
        console.log("next attacker is: " , nextAttacker)
        gameLogicDispatch({ type: GAMELOGICACTION.INIT_TURN, payload: {nextAttacker: nextAttacker, nextDefender: nextDefender}});
      }
      else{
        nextAttackerId = (gameLogicState.defender.id + 1) % players.length;
        nextAttacker = players[nextAttackerId];
        nextDefenderId = (nextAttackerId + 1) % players.length;
        nextDefender = players[nextDefenderId];
        gameLogicDispatch({ type: GAMELOGICACTION.INIT_TURN, payload: {nextAttacker: nextAttacker, nextDefender: nextDefender}});
      }
      setCanPlay((oldCanPlay) => oldCanPlay.map((player, index) => index !== nextDefender.id));
    }

  const dealCards = () => {
    let cardsToDeal =6 - gameLogicState.mainAttacker.hand.length;
    let cardsDealt = 0;
    let defenderId = gameLogicState.defender.id;
    let attackersId = gameLogicState.mainAttacker.id;
    if(isKuzarDealt.current){
      checkWinner();
    }
    for(let i = 0; i < players.length ; i++){
      cardsToDeal = 6 - players[attackersId].hand.length;
      cardsDealt = 0;
      if(players[attackersId].id === gameLogicState.defender.id) continue;
      while(cardsDealt < cardsToDeal){
        let card = deckState.deck.pop();
        console.log("card ",card," dealt to: ", players[attackersId].id)
        if(card === undefined){
          card = deckState.kuzar;
          players[attackersId].hand.push(card);
          isKuzarDealt.current = true;
          checkWinner();
          return;
        }
        players[attackersId].hand.push(card);
        cardsDealt++;
      }
      attackersId = (attackersId + 1) % players.length;
    }

    cardsToDeal = 6 - players[defenderId].hand.length;
    cardsDealt = 0;
    while(cardsDealt < cardsToDeal){
      let card = deckState.deck.pop();
      if(card === undefined){
        card = deckState.kuzar;
        players[defenderId].hand.push(card);
        return;
      }
      players[defenderId].hand.push(card);
      cardsDealt++;
    }
  }


  const attack = () => {
    
    if(gameLogicState.currentAttacker.id === 0){
      setIsHumanTurn(true);
      console.log("human attack")
      return;
    }

    setIsHumanTurn(false);
    console.log("ai attack")
    let cardToPlay = null;
    if(isFirstAttack.current){
      cardToPlay = chooseFirstCardToAttackWith(gameLogicState.currentAttacker.hand, deckState.kuzar);
      isFirstAttack.current = false;
    }
    else
      cardToPlay = chooseCardToAttackWith(gameLogicState.currentAttacker.hand,attackCardsInPlay,defenseCardsInPlay, deckState.kuzar);
    
    if(cardToPlay !== null && cardToPlay !== undefined  && attackCardsInPlay.length < 6 && (gameLogicState.defender.hand.length - attackCardsInPlay.length ) > 0){
      console.log("card to play: " ,cardToPlay);
      cardToPlay.isFaceUp = true;
      gameLogicState.currentAttacker.hand = gameLogicState.currentAttacker.hand.filter(card => card !== cardToPlay);
      setAttackCardsInPlay(oldCards => [...oldCards, cardToPlay]);
      setCanPlay((oldCanPlay) => oldCanPlay.map((canPlay, index) => index === gameLogicState.currentAttacker.id ? true : canPlay));
    }
    else{
      console.log("no card to play")
      setCanPlay((oldCanPlay) => oldCanPlay.map((canPlay, index) => index === gameLogicState.currentAttacker.id ? false : canPlay));
      setNextAttacker();
      gameLogicDispatch({ type: GAMELOGICACTION.DEFEND});
    }
  }

  const setNextAttacker = () => {
    let nextAttackerId = gameLogicState.currentAttacker.id;
    let nextAttacker = null;
    let checkRounds = 0;
    while(nextAttacker !== gameLogicState.defender){
      nextAttacker = players[(nextAttackerId + 1) % playerCount];
      if(nextAttackerId !== gameLogicState.defender.id && nextAttacker.hand.length > 0){
        gameLogicDispatch({ type: GAMELOGICACTION.SET_NEXT_ATTACKER, payload: {nextAttacker: nextAttacker}});
        return;
      }
      if(nextAttackerId === gameLogicState.defender.id){
        checkRounds++;
      }
      nextAttackerId = (nextAttackerId + 1) % playerCount;
      
      if(checkRounds > 3){
        // game over set dispatch
        break;
      }
    }
  }

  const defend = () => {
    if(gameLogicState.defender.id === 0){
      setIsHumanTurn(true); 
      console.log("human defend")
      return;
    }

    setIsHumanTurn(false);
    console.log("ai defend")
    let cardToDefendWith = null;

    // Choose a card to defend with
    console.log("AI defender hand: ", gameLogicState.defender.hand)

    cardToDefendWith = chooseCardToDefendWith(gameLogicState.defender.hand, attackCardsInPlay,defenseCardsInPlay, deckState.kuzar);
    if (cardToDefendWith.isValidDefense) {
      // Add the card to defenseCardsInPlay and remove it from the defender's hand
      gameLogicState.defender.hand = gameLogicState.defender.hand.filter(card => card !== cardToDefendWith.card);
      setDefenseCardsInPlay(oldCards => 
        oldCards.map((oldCard, index) => index === cardToDefendWith.index ? cardToDefendWith.card : oldCard)
      );
      const nonNullDefenseCards = defenseCardsInPlay.filter(card => card !== null);
      if (nonNullDefenseCards.length === attackCardsInPlay.length) {
        gameLogicDispatch({ type: GAMELOGICACTION.ATTACK, payload: { isDefenseSuccessful: true }});
      }
      else if(gameLogicState.defender.hand.length === 0 || nonNullDefenseCards.length === 6){
        gameLogicDispatch({ type: GAMELOGICACTION.TURN_OVER, payload: { isDefenseSuccessful: true }});
        clearCardsInPlay();
      }
    }
    else {
      const nonNullDefenseCards = defenseCardsInPlay.filter(card => card !== null);
      if (nonNullDefenseCards.length === attackCardsInPlay.length) {
        gameLogicDispatch({ type: GAMELOGICACTION.ATTACK, payload: { isDefenseSuccessful: true }});
        return;
      }
      console.log("AI defender has no valid defense");
      pickUpCards();
    }
  }

  const isDefenseNeeded = () => {
    let isNeeded = false;
    let nonNullDefenseCards = defenseCardsInPlay.filter(card => card !== null);
    for(let player of players){
      if(player.id === gameLogicState.defender.id) continue;
      for(let card of player.hand){
        if((nonNullDefenseCards.length === attackCardsInPlay.length) && isCardValidToAttackWith(card, attackCardsInPlay, defenseCardsInPlay, deckState.kuzar)){
          isNeeded = true;
          return isNeeded;
        }
      }
    }
    return isNeeded;
  }

  const handleCardClick = (player, card) => {
    if (gameLogicState.gamePhase === GAMEPHASES.ATTACK && player.id === gameLogicState.currentAttacker.id) {
      if(isFirstAttack.current){
        card.isFaceUp = true;
        player.hand = player.hand.filter(c => c !== card); // Remove the played card from hand
        setAttackCardsInPlay(oldCards => [...oldCards, card]);
        isFirstAttack.current = false;
        cardPlayed.current = true;
      }
      else{
        if(attackCardsInPlay.length < 6 && (gameLogicState.defender.hand.length - attackCardsInPlay.length ) > 0){
          card.isFaceUp = true;
          if(!isCardValidToAttackWith(card, attackCardsInPlay, defenseCardsInPlay, deckState.kuzar))
            return;
          player.hand = player.hand.filter(c => c !== card); // Remove the played card from hand
          setAttackCardsInPlay(oldCards => [...oldCards, card]);
        }
      }
    } else if (gameLogicState.gamePhase === GAMEPHASES.DEFEND && player.id === gameLogicState.defender.id) {
      let validCardIndex =isCardValidToDefendWith(card, attackCardsInPlay, defenseCardsInPlay,deckState.kuzar)
      if(!validCardIndex.isValid)
        return;
      
      player.hand = player.hand.filter(c => c !== card); // Remove the played card from hand
      setDefenseCardsInPlay(oldCards => 
        oldCards.map((oldCard, index) => index === validCardIndex.validIndex[0] ? card : oldCard)
      );
      console.log("card to defend with: " ,card)
    }
  };

  const handleDoneClick = () => {
    if (gameLogicState.gamePhase === GAMEPHASES.ATTACK) {
      if(cardPlayed.current){
        setCanPlay((oldCanPlay) => oldCanPlay.map((player, index) => index !== gameLogicState.defender.id));
        cardPlayed.current = false;
      }else{
        setCanPlay((oldCanPlay) => 
        oldCanPlay.map((canPlay, index) => index === 0 ? false : canPlay)
        );
        cardPlayed.current = false;
      }
      setNextAttacker();
      gameLogicDispatch({ type: GAMELOGICACTION.DEFEND });
    } else if (gameLogicState.gamePhase === GAMEPHASES.DEFEND) {
      const nonNullDefenseCards = defenseCardsInPlay.filter(card => card !== null);
      if (nonNullDefenseCards.length === attackCardsInPlay.length) {
        if(gameLogicState.defender.hand.length === 0  || nonNullDefenseCards.length === 6){
          gameLogicDispatch({ type: GAMELOGICACTION.TURN_OVER, payload: { isDefenseSuccessful: true } });
          clearCardsInPlay();
        }else{
          gameLogicDispatch({ type: GAMELOGICACTION.ATTACK, payload: { isDefenseSuccessful: true } });
        }
      } else {
        console.log("HUMAN defender has no valid defense");
        pickUpCards();
      }
    }

    setIsHumanTurn(false);
  };

  const pickUpCards = () => {
    let nonNullDefenseCards = defenseCardsInPlay.filter(card => card !== null);
    gameLogicState.defender.hand = gameLogicState.defender.hand.concat(attackCardsInPlay, nonNullDefenseCards);

    clearCardsInPlay();
    gameLogicDispatch({ type: GAMELOGICACTION.TURN_OVER, payload: { isDefenseSuccessful: false }});
  }

  const clearCardsInPlay = () => {
    // Clear the attack and defense cards
    setAttackCardsInPlay([]);
    setDefenseCardsInPlay([null, null, null, null, null, null]);
  }


  return (
    <div className='gameBoard'>
      {isHumanTurn && <button className='button1' onClick={handleDoneClick} >Done</button>}
      { players.map(player => (
        <Player 
          key={player.id} 
          player={player}
          isPlayer={player.id === 0}
          onCardClick={handleCardClick}
        />
      ))}
      <button className='buttonWin' onClick={GameOverWinner}>
        Win
      </button>
      <button className='buttonLose' onClick={GameOverLoser}>
        Lose
      </button>
      <div className='mainDeck'>
        { deckState.kuzar && 
          <Card 
            key={`${deckState.kuzar.rank}-${deckState.kuzar.suit}-kuzar`}
            rank={deckState.kuzar.rank} 
            suit={deckState.kuzar.suit} 
            isFaceUp={true} 
          /> 
        }
        {deckState.deck && <Deck deck={deckState.deck} className='deck' />}
      </div>
      <div className='playArea'>
        { attackCardsInPlay.map((card,index) => 
          <div key={index} style={{ position: "relative" }}> 
            <Card 
              key={`${card.rank}-${card.suit}`} 
              rank={card.rank} 
              suit={card.suit} 
              isFaceUp={true} 
            />
           { defenseCardsInPlay[index] !== null && (
            <div className="defenseCard">
              <Card 
                key={`${card.rank}-${card.suit}`} 
                rank={defenseCardsInPlay[index].rank} 
                suit={defenseCardsInPlay[index].suit} 
                isFaceUp={true} 
              />
            </div>
            )}
        </div>
        )}
      </div>
    </div>
  );
  
}

export default Board;
