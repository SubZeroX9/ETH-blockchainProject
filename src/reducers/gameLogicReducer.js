export const GAMELOGICACTION = {
    SET_MAIN_ATTACKER: 'SET_MAIN_ATTACKER',
    SET_CURRENT_ATTACKER: 'SET_CURRENT_ATTACKER',
    SET_DEFENDER: 'SET_DEFENDER',
    ATTACK: 'ATTACK',
    DEFEND: 'DEFEND',
    CHECK_FOR_WINNER: 'CHECK_FOR_WINNER',
}

export const gameLogicReducer = (state, action) => {
    switch (action.type) {
      case GAMELOGICACTION.SET_MAIN_ATTACKER:
        return { ...state, mainAttacker: action.payload };
      case GAMELOGICACTION.SET_CURRENT_ATTACKER:
        return { ...state, currentAttacker: action.payload };
      case GAMELOGICACTION.SET_DEFENDER:
        return { ...state, defender: action.payload };
      default:
        return state;
    }
  };
  