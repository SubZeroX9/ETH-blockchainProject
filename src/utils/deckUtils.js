export function createDeck() {
    const suits = ['hearts', 'diamonds', 'spades', 'clubs'];
    const ranks = ['6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    let deck = [];

    for (let suit of suits) {
        for (let rank of ranks) {
            deck.push({ rank: rank, suit: suit, isFaceUp: false });
        }
    }

    // shuffle the deck before returning it
    return shuffleDeck(deck);
}

function shuffleDeck(deck) {
    let currentIndex = deck.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = deck[currentIndex];
        deck[currentIndex] = deck[randomIndex];
        deck[randomIndex] = temporaryValue;
    }

    return deck;
}

export const cardValue = (card) => {
    switch (card.rank) {
        case '6': return 6;
        case '7': return 7;
        case '8': return 8;
        case '9': return 9;
        case '10': return 10;
        case 'J': return 11;
        case 'Q': return 12;
        case 'K': return 13;
        case 'A': return 14;
        default: return 0;
    }
  };
  