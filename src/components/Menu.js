import React, {useState} from 'react'
import '../styles/Menu.css';
import { Link } from 'react-router-dom'
import  Wallet  from './Wallet';
import Board from './Board';
import { GameContext } from './GameContext'; // Make sure the path is correct



const Menu = () => {
  const { playerCount, setPlayerCount } = React.useContext(GameContext);

    const handlePlayerCountChange = (e) => {
      setPlayerCount(Number(e.target.value));
    };
  
    const renderStartButton = () => {
        if (playerCount > 0) {
          return (
            <button className='button'>
              <Link to={{ pathname: "/board", state: { playerCount } }}>Start Game</Link>
            </button>
          );
        } else {
          return (
            <button className='button' onClick={() => alert('Add minimum players')}>
              Start Game
            </button>
          );
        }
      };
  
    return (
      <div className="Menu">
        <Wallet />
        <hr className='dividers' />
        <a>How Many Players</a>
        <select className='select' onChange={handlePlayerCountChange}>
          <option value="0">→ Select ←</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
        <hr className='dividers' />
        {renderStartButton()}
        <hr className='dividers' />
        <a>No. of tokens</a>
      </div>
    );
  };
export default Menu;