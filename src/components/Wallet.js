import {ethers, providers} from 'ethers';
import '../styles/Wallet.css'
import React,{useEffect, useState} from "react";
import durakGameabi from '../ABIs/durakGameABI.json';
import durakTokenabi from '../ABIs/durakTokenABI.json';



const Wallet = () =>{

    const [defaultAccount,setDefaultAccount] = useState(null);
    const [currentContractVal, setCurrentContractVal] = useState(null);
    

    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [tokenBalance, setTokenBalance] = useState(null);

    const contractAddressDurakTokens = "0xfA82D868D6aF3B64c54954C4aFe72373090c6d5e";

    const contractAddressDurakGame = "0x5f13a20fC75FbfA0258221e8c51Def53F9bB8e18";

    useEffect(() => {
        if (contract) {
            getMyBalance();
        }
    }, [contract]);

    const connectWalletHandler = () =>{
        if(window.ethereum){
            window.ethereum.request({method: 'eth_requestAccounts'})
            .then(result => {
                accountChangeHandler(result[0]);
            })
        } else{
            alert("Need to install MetaMask!");
        }
    }

    const accountChangeHandler = (newAccount) => {
        setDefaultAccount(newAccount);
        updateEthers();
    }

    const updateEthers = async() => {
        let tempProvider = new ethers.BrowserProvider(window.ethereum)
        setProvider(tempProvider);

        const signer = await tempProvider.getSigner();
        setSigner(signer);

        const erc20Contract = new ethers.Contract(contractAddressDurakTokens, durakTokenabi, signer);
        setContract(erc20Contract);
        const tokenName = erc20Contract.name();
        console.log(tokenName);
        const tokenSymbol = erc20Contract.symbol();
        console.log(tokenSymbol);
        const totalSupply = erc20Contract.totalSupply();
        console.log(totalSupply);
    }

    const getMyBalance = async () => {
        let balance = await contract.balanceOf(defaultAccount);
        let decimals = await contract.decimals();
        balance = balance / (10n ** decimals);
        setTokenBalance(balance.toString());
    }

    const buyTokens = async () => {
        // const erc20 = new ethers.Contract(contractAddressDurakTokens, durakTokenabi, signer);
        let amount = 0.2;
        const decimals = await contract.decimals();
        try {
            let durakAmount = ethers.parseUnits(amount.toString(), decimals);
            // Invoke the transfer function
            // let transactionResponse = await contract.buyTokens(durakAmount.toString());
            let transactionResponse = await contract.buyTokens({
                value: durakAmount
            });
    
            // Wait for the transaction to be processed
            let transactionResult = await transactionResponse.wait();
    
            console.log(transactionResult);
        } catch (error) {
            console.error("An error occurred", error);
        }
    }

    const transferTokens = async () => {
        // const erc20 = new ethers.Contract(contractAddressDurakTokens, durakTokenabi, signer);
        let recipientAddr = "0x48727262f4083966317abE1539B1bdfDAbA562D7"
        let amount = 100n;
        const decimals = await contract.decimals();
        try {
            let durakAmount = ethers.parseUnits(amount.toString(), decimals);
            // Invoke the transfer function
            let transactionResponse = await contract.transfer(recipientAddr, durakAmount.toString());
    
            // Wait for the transaction to be processed
            let transactionResult = await transactionResponse.wait();
    
            console.log(transactionResult);
        } catch (error) {
            console.error("An error occurred", error);
        }


    }


    return <>
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
        <hr className='dividers' />
        <button className="button" onClick={transferTokens}>Transfer Tokens</button>
    </div>)}
</>
}

export default Wallet;