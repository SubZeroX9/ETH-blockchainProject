import { cardValue } from "./deckUtils";

export const chooseFirstCardToAttackWith = (hand, kuzar,state) =>{
    // Find the lowest value card in the hand

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
    const attackAndDefenseRanks = [...attackCards, ...defenseCards].map(card => card.rank);

    // Check if the player has a card with the same rank as one of the attack or defense cards
    const matchingRankCard = hand.find(card => attackAndDefenseRanks.includes(card.rank));

    // If there's a matching rank card, return it
    if (matchingRankCard) {
        return matchingRankCard;
    }
    else
    {
        return null;
    }
}

export const chooseCardToDefendWith = (hand,attackCards,defenseCards ,state) => {

}