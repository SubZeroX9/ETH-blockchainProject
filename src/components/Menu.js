import React, {useState} from 'react'
import '../styles/Menu.css';
import  Wallet  from './Wallet';
const Menu = () => {

    const [errorMessage, setErrorMessage] = useState(null);
    


    return(
    <div className="Menu">
            <Wallet/>
            <hr className='dividers'></hr>
            <a>How Many Players </a>
            <select className='select'>
            <option value="0" className='selected'>→ Select ←</option>
            <option value="2" className='selected'>2</option>
            <option value="3" className='selected'>3</option>
            <option value="4" className='selected'>4</option>
            <option value="5" className='selected'>5</option>
            <option value="6" className='selected'>6</option>
            </select>
            <hr className='dividers'></hr>
            <button className='button'>Start Game</button>
            <hr className='dividers'></hr>
            <a>No. of tokens</a>
    </div>
    )
}

export default Menu;