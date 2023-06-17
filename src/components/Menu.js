import React from 'react'
import '../styles/Menu.css';

const Menu = () => {
    return(
    <div className="menu">
        <br></br><br></br><br></br>
            <a className='text'>Connect Wallet</a>
        <br></br><br></br><br></br>
            <hr className='dividers'></hr>
        <br></br><br></br><br></br>
            <a className='text'>How Many Players </a>
            <select className='select'>
            <option value="0" className='selected'>→ Select ←</option>
            <option value="2" className='selected'>2</option>
            <option value="3" className='selected'>3</option>
            <option value="4" className='selected'>4</option>
            <option value="5" className='selected'>5</option>
            <option value="6" className='selected'>6</option>
            </select>
        <br></br><br></br><br></br>
            <hr className='dividers'></hr>
        <br></br><br></br><br></br>
            <button className='button'>Start Game</button>
        <br></br><br></br><br></br>
            <hr className='dividers'></hr>
        <br></br><br></br><br></br>
        <a className='text'>No. of tokens</a>
    </div>
    )
}

export default Menu;