import {ethers, providers} from 'ethers';
import '../styles/Wallet.css'
import React,{useState} from "react";


const Wallet = () =>{

    const [defaultAccount,setDefaultAccount] = useState(null);
    const [currentContractVal, setCurrentContractVal] = useState(null);

    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);

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

    const updateEthers = () => {
        let tempProvider = new ethers.BrowserProvider(window.ethereum)
        setProvider(tempProvider);
    }

    return <>{defaultAccount === null ? 
        (<button className="button" onClick={connectWalletHandler}>Connect Wallet</button>) 
        : (<div >Address : {defaultAccount}</div>)}
    </>
}

export default Wallet;