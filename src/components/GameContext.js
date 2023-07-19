import React from "react";

export const GameContext = React.createContext();

export const GameProvider = ({ children }) => {
  const [playerCount, setPlayerCount] = React.useState(0);

  return (
    <GameContext.Provider value={{ playerCount, setPlayerCount}}>
      {children}
    </GameContext.Provider>
  );
};
