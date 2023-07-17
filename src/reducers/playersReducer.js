export const PLAYERACTION = {
    INIT_PLAYERS: 'INIT_PLAYERS',
    UPDATE_HAND: 'UPDATE_HAND',
}

export function playersReducer(state, action) {
    switch (action.type) {
      case PLAYERACTION.INIT_PLAYERS:
        // Assume action.payload is playerCount
        const playerCount = action.payload;
        const players = Array(playerCount).fill().map((_, idx) => ({
          id: idx,
          hand: [],
          score: 0,
        }));
        return { ...state, players: players };
      case PLAYERACTION.UPDATE_HAND:
        // Assume action.payload is an object {playerId, newHand}
        return state.map(player =>
          player.id === action.payload.playerId ? { ...player, hand: action.payload.newHand } : player
        );
      default:
        throw new Error();
    }
  }
  