import React, {useState} from 'react'
import '../styles/Menu.css';
import { Link } from 'react-router-dom'
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
        <br></br>{defaultAccount === null ? 
    (<button className="button" onClick={connectWalletHandler}>Connect Wallet</button>) 
    : (<div>
        Address: {defaultAccount}
        <br />
        <hr className='dividers' />
        Token balance: {tokenBalance || 'Loading...'}
        <hr className='dividers' />
        <button className="button" onClick={buyTokens}>Buy Tokens</button>
        <select className='select' defaultChecked='50'>
          <option value="0" className='selected'>→ Select Amount←</option>
          <option value="2" className='selected'>50</option>
          <option value="3" className='selected'>100</option>
          <option value="4" className='selected'>150</option>
          <option value="3" className='selected'>200</option>
          <option value="4" className='selected'>250</option>
          <option value="3" className='selected'>100</option>
          <option value="4" className='selected'>300</option>
        </select>
    </div>)}
        <hr className='dividers' />
        <a>How Many Players</a>
        <select className='select' onChange={handlePlayerCountChange}>
          <option value="0" className='selected'>→ Select ←</option>
          <option value="2" className='selected'>2</option>
          <option value="3" className='selected'>3</option>
          <option value="4" className='selected'>4</option>
        </select>
        <hr className='dividers' />
        {renderStartButton()}<br></br><br></br>
      </div>
    );
  };
export default Menu;