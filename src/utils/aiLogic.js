import { cardValue } from "./deckUtils";

export const chooseFirstCardToAttackWith = (hand, kuzar,state) =>{
    // Find the lowest value card in the hand
    console.log("Hand: ",hand);
    // Filter out the non-Kuzar suit cards
    const nonKuzarHand = hand.filter(card => card.suit !== kuzar.suit);

      // If there are non-Kuzar suit cards, find the lowest among them
    if (nonKuzarHand.length > 0) {
        return nonKuzarHand.reduce((lowest, card) =>
        cardValue(card) < cardValue(lowest) ? card : lowest, nonKuzarHand[0]
        );
    }

    // If there are no non-Kuzar suit cards, find the lowest card in the hand
    return hand.reduce((lowest, card) =>
        cardValue(card) < cardValue(lowest) ? card : lowest, hand[0]
    );
}

export const chooseCardToAttackWith = (hand,attackCards,defenseCards ,kuzar,state) => {
    // Concatenate the ranks of attackCards and defenseCards
    const attackAndDefenseRanks = [...attackCards, ...defenseCards].filter(card => card !== null).map(card => cardValue(card));
    console.log("attackAndDefenseRanks: ",attackAndDefenseRanks);
    console.log("Hand: ",hand);
    // Check if the player has a card with the same rank as one of the attack or defense cards
    let matchingRankCard = null;

    for (let card of hand) {
        let cardRank = cardValue(card);

        if (attackAndDefenseRanks.includes(cardRank)) {
            matchingRankCard = card;
            break;
        }
    }
  
    // If there's a matching rank card, return it
    if (matchingRankCard !== undefined && matchingRankCard !== null) {
        console.log("Matching Rank Card: ",matchingRankCard);
        return matchingRankCard;
    }
    else
    {
        return null;
    }
}

export const isCardValidToAttackWith = (card,attackCards,defenseCards ,state) => {
    // Concatenate the ranks of attackCards and defenseCards
    const attackAndDefenseRanks = [...attackCards, ...defenseCards].filter(card => card !== null).map(card => card.rank);

    // Check if the player has a card with the same rank as one of the attack or defense cards
    return attackAndDefenseRanks.includes(card.rank);
}

export const isCardValidToDefendWith = (card,attackCards,defenseCards,kuzar ,state) => {
    // Concatenate the ranks of attackCards and defenseCards
    const cardRank = cardValue(card);
    let index = 0;
    let validCardIndex = [];
    for (let attackCard of attackCards) {
        if((card.suit === kuzar.suit && (attackCard.suit !== kuzar.suit || cardValue(attackCard) < cardRank)) || 
            (card.suit === attackCard.suit && cardValue(attackCard) < cardRank)){
                if(defenseCards[index] === null)
                    validCardIndex.push(index);
            }
        index++;
    }
    let isValid = validCardIndex.length > 0;
    return {isValid:isValid,validIndex: validCardIndex};
}

export const chooseCardToDefendWith = (hand,attackCards,defenseCards,kuzar,state) => {
    let cardToDefendWith = {isValidDefense: false,card:null,index:null};
    let validCard;

    

    for(let card of hand){
        validCard = isCardValidToDefendWith(card,attackCards,defenseCards,kuzar,state);
        if(validCard.isValid){
            cardToDefendWith.isValidDefense = true;
            cardToDefendWith.card = card;
            cardToDefendWith.index = validCard.validIndex[0];
            return cardToDefendWith;
        }
    }

    return cardToDefendWith;
}