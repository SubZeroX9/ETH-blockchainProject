import { cardValue } from "./deckUtils";

const getLowestCardOfSuit = (hand, suit) => {
    // Filter out the cards of the specified suit
    const cardsOfSuit = hand.filter(card => card.suit === suit);
  
    // If no cards of the suit are found, return null
    if (cardsOfSuit.length === 0) {
      return null;
    }
  
    // Find the card with the lowest rank
    let lowestCard = cardsOfSuit[0];
    for (let i = 1; i < cardsOfSuit.length; i++) {
      if (cardValue(cardsOfSuit[i]) < cardValue(lowestCard)) {
        lowestCard = cardsOfSuit[i];
      }
    }
    
    console.log(lowestCard)

    return lowestCard;
  };
  
export const getFirstAttacker = (players, kuzarSuit) => {
    let startingPlayer = null;
    let lowestKuzarValue = Infinity;  // Set initial lowest value high
  
    players.forEach(player => {
      let lowestKuzar = getLowestCardOfSuit(player.hand, kuzarSuit);
      if (lowestKuzar && cardValue(lowestKuzar) < lowestKuzarValue) {
        lowestKuzarValue = cardValue(lowestKuzar);
        startingPlayer = player;
      }
    });
  
    return startingPlayer.id;
  };
