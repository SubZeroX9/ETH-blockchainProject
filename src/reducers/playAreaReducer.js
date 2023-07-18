export const PLAYAREAACTION = {
    SET_ATTACK_CARDS: 'SET_ATTACK_CARDS',
    SET_DEFENSE_CARDS: 'SET_DEFENSE_CARDS',
}

export const playAreaReducer = (state, action) => {
    switch (action.type) {
      case PLAYAREAACTION.SET_ATTACK_CARDS:
        return { ...state, attackCardsInPlay: action.payload };
      case PLAYAREAACTION.SET_DEFENSE_CARDS:
        return { ...state, defenseCardsInPlay: action.payload };
      default:
        return state;
    }
  };
  