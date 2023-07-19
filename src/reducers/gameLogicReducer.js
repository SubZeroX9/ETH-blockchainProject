
export const GAMELOGICACTION = {
    SET_CURRENT_ATTACKER: 'SET_CURRENT_ATTACKER',
    ATTACK: 'ATTACK',
    DEFEND: 'DEFEND',
    SET_INITIALIZED: 'SET_INITIALIZED',
    TURN_OVER: 'TURN_OVER',
    DEAL_CARDS: 'DEAL_CARDS',
    INIT_TURN: 'INIT_TURN',
}

export const GAMEPHASES = {
    INITIALIZE: 'INITIALIZE',
    DEAL_CARDS: 'DEAL_CARDS',
    HUMAN_ATTACK: 'HUMAN_ATTACK',
    HUMAN_DEFEND: 'HUMAN_DEFEND',
    AI_ATTACK: 'AI_ATTACK',
    AI_DEFEND: 'AI_DEFEND',
    ATTACK: 'ATTACK',
    DEFEND: 'DEFEND',
    TURN_OVER: 'TURN_OVER',
}

export const gameLogicReducer = (state, action) => {
    switch (action.type) {
      case GAMELOGICACTION.INIT_TURN:
        return { ...state,gamePhase: GAMEPHASES.ATTACK, mainAttacker: action.payload.nextAttacker, currentAttacker: action.payload.nextAttacker, defender: action.payload.nextDefender};
      case GAMELOGICACTION.SET_CURRENT_ATTACKER:
        return { ...state, currentAttacker: action.payload };
      case GAMELOGICACTION.SET_INITIALIZED:
        return { ...state, gamePhase: GAMEPHASES.ATTACK, initialized: true };
      case GAMELOGICACTION.ATTACK:
        return { ...state, gamePhase: GAMEPHASES.ATTACK , isDefenseSuccessful: action.payload.isDefenseSuccessful};
      case GAMELOGICACTION.DEFEND:
        return { ...state, gamePhase: GAMEPHASES.DEFEND };
      case GAMELOGICACTION.GAME_OVER:
        return { ...state, gamePhase: GAMEPHASES.GAME_OVER };
      case GAMELOGICACTION.TURN_OVER:
        return { ...state, gamePhase: GAMEPHASES.TURN_OVER, isDefenseSuccessful: action.payload.isDefenseSuccessful };
      default:
        return state;
    }
  };
  