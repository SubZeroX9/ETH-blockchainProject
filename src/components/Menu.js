import React, {useState,useEffect} from 'react'
import '../styles/Menu.css';
import { Link } from 'react-router-dom'
import Board from './Board';
import { GameContext } from './GameContext'; 
import { ethers } from 'ethers';
import durakGameabi from '../ABIs/durakGameABI.json';
import durakTokenabi from '../ABIs/durakTokenABI.json';


const Menu = () => {
  const { playerCount, setPlayerCount } = React.useContext(GameContext);
  const [gameStarted, setGameStarted] = useState(false);
  let [tokensToBuy, setTokensToBuy] = useState(50);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [durakTokenContract, setDurakTokenContract] = useState(null);
  const [durakGameContract, setDurakGameContract] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(null);
  let [decimals, setDecimals] = useState(null);
  let [depositedAmount, setDepositedAmount] = useState(0);

  const contractAddressDurakTokens = "0x996b0fBBE26b9C7Ce3Cf3A2955aa4f19Cb036AF5";
  const contractAddressDurakGame = "0xEd336552424C30Dc0d8d6f793A0fBb5e7D1fa356";

  useEffect(() => {
      if (durakTokenContract) {
          getMyBalance();
      }
  }, [durakTokenContract]);

  const connectWalletHandler = () => {
      if (window.ethereum) {
          window.ethereum.request({ method: 'eth_requestAccounts' })
              .then(result => {
                  accountChangeHandler(result[0]);
              })
      } else {
          alert("Need to install MetaMask!");
      }
  };

  const accountChangeHandler = (newAccount) => {
      setDefaultAccount(newAccount);
      updateEthers();
  };

  const updateEthers = async () => {
      let tempProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(tempProvider);

      const signer = await tempProvider.getSigner();
      setSigner(signer);

      const durakTokeContract = new ethers.Contract(contractAddressDurakTokens, durakTokenabi, signer);
      setDurakTokenContract(durakTokeContract);
      const tokenName = await durakTokeContract.name();
      const tokenSymbol = await durakTokeContract.symbol();
      const totalSupply = await durakTokeContract.totalSupply();

      const durakGameContract = new ethers.Contract(contractAddressDurakGame, durakGameabi, signer);
      setDurakGameContract(durakGameContract);
      const decimals = await durakTokeContract.decimals();
      setDecimals(decimals);
  };

  const getMyBalance = async () => {
      let balance = await durakTokenContract.balanceOf(defaultAccount);
      balance = ethers.formatUnits(balance, decimals);

      setTokenBalance(balance.toString());
  };

  const buyTokens = async ( ) => {
    if (!provider || !signer) {
        alert("Connect your wallet first!");
        return;
    }

    if(tokensToBuy === 0) {
        alert("Select amount of tokens to buy!");
        return;
    }
    let amount = tokensToBuy/10000;

    let parsedAmount = ethers.parseUnits(amount.toString(), decimals);
    try {
        let transactionResponse = await durakTokenContract.buyTokens({
            value: parsedAmount
        });

        let transactionResult = await transactionResponse.wait();
        console.log(transactionResult);
    } catch (error) {
        console.error("An error occurred", error);
        alert("not enough funds or Operation canceled");
    }
  };

  const handlePlayerCountChange = (e) => {
    setPlayerCount(Number(e.target.value));
  };


  const handleStartGame = async () => {
    const GameContract = new ethers.Contract(contractAddressDurakGame, durakGameabi, signer);

    try {
      // Start the game
      let transactionResponse = await GameContract.startGame();
      let transactionResult = await transactionResponse.wait();
      console.log(transactionResult);
      
      // If all transactions are successful, set gameStarted to true
      setGameStarted(true);
    } catch (error) {
        console.error("An error occurred", error);
        alert("Not enough Tokens or Operation canceled");
    }
};



const transferTokens = async () => {
  let recipient = "0x66d6B8CBB15AcE8CEb3b9b2cBdC5D14323f98936"
  try {
      const amountForTenTokens = ethers.parseUnits('100', decimals); // Adjust this as per your game's requirement

      const tx = await durakTokenContract.transfer(recipient, amountForTenTokens);
      await tx.wait();
      console.log("Tokens transferred successfully");
  } catch (error) {
      console.error("Error transferring tokens: ", error);
  }
};

const fetchDepositedAmount = async () => {
  try {
      const depositedAmount = await durakGameContract.getDeposit();
      const readableAmount = ethers.formatUnits(depositedAmount, decimals);
      setDepositedAmount(readableAmount);
      console.log('Deposited amount for user:', readableAmount);
  } catch (error) {
      console.error('Error fetching deposited amount:', error);
  }
};

useEffect(() => {
  if (decimals)
    fetchDepositedAmount();
},[decimals]);


  const renderStartButton = () => {
      if (playerCount > 0 && gameStarted) {
          return (
              <button className='button'>
                  <Link to={{ pathname: "/board", state: { playerCount  } }}>Start Game</Link>
              </button>
          );
      } else if (playerCount > 0) {
          return (
              <button className='button' onClick={handleStartGame}>
                  Deduct Tokens and Start
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

  const handleDepositTokens = async () => {
    try {
        const amountToDeposit = ethers.parseEther('10000'); 
        // First, approve the game contract to move the tokens on behalf of the user
        const approveTx = await durakTokenContract.approve(contractAddressDurakGame, amountToDeposit);
        await approveTx.wait();
        console.log('Approval successful.');

        // Now, call the depositTokens function on the durakGame contract
        const depositTx = await durakGameContract.depositTokens(amountToDeposit);
        await depositTx.wait();
        console.log('Tokens deposited successfully!');
        fetchDepositedAmount();
    } catch (error) {
        console.error('Error during deposit:', error);
    }
};


  const handleTokenAmountChange = (e) => {
      setTokensToBuy(Number(e.target.value));
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
        <select className='select'  onChange={handleTokenAmountChange}>
          <option value="0" className='selected'>→ Select Amount←</option>
          <option value="50" selected="selected" className='selected'>50</option>
          <option value="100" className='selected'>100</option>
          <option value="150" className='selected'>150</option>
          <option value="200" className='selected'>200</option>
          <option value="250" className='selected'>250</option>
          <option value="300" className='selected'>300</option>
          <option value="500" className='selected'>500</option>
        </select>
    </div>)}
        <hr className='dividers' />
        <button className="button" onClick={handleDepositTokens}>Deposite</button>
        <div>Deposited Amount: {depositedAmount}</div>
        <hr className='dividers' />
        <a>How Many Players</a>
        <select className='select' onChange={handlePlayerCountChange}>
          <option value="0" className='selected'>→ Select ←</option>
          <option value="2" className='selected'>2</option>
          <option value="3" className='selected'>3</option>
          <option value="4" className='selected'>4</option>
        </select>
        <hr className='dividers' />
        {/* <button className="button" onClick={transferTokens}>Transfer Tokens</button> */}
        {renderStartButton()}<br></br><br></br>
      </div>
    );
  };
export default Menu;