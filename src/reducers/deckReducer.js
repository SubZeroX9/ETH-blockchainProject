
export const DECKACTIONS = {
  INIT_GAME: "INIT_GAME",
  DRAW_CARD: "DRAW_CARD",
}

export function deckReducer(state, action) {
  switch (action.type) {
    case DECKACTIONS.INIT_GAME:
      const { players, deck } = action.payload;

      let kuzar = deck.pop();

      players.forEach(player => {
        for (let i = 0; i < 6; i++) {
          player.hand.push(deck.pop());
        }
      });

      return { ...state, deck: deck, kuzar: kuzar };

      // case DECKACTIONS.DRAW_CARD:
      //     return { ...state, deck: state.deck.pop() };

      default:
          throw new Error();
  }
}
