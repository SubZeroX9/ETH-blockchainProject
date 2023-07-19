import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import durakGameabi from '../ABIs/durakGameABI.json';
import durakTokenabi from '../ABIs/durakTokenABI.json';

const WalletContext = createContext();

export const useContract = () => {
    return useContext(WalletContext);
};

export const WalletProvider = ({ children }) => {
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [durkaTokenContract, setDurakTokenContract] = useState(null);
    const [durkaGameContract, setDurakGameContract] = useState(null);
    const [tokenBalance, setTokenBalance] = useState(null);

    const contractAddressDurakTokens = "0x4Ebc063Bff53f96E9Cc2Ba0Cf04EA8b27a432aE8";
    const contractAddressDurakGame = "0xCe028B2ba0fe2F68AACc3828DD97239a28FccB7A";

    useEffect(() => {
        if (durkaTokenContract) {
            getMyBalance();
        }
    }, [durkaTokenContract]);

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

        const erc20Contract = new ethers.Contract(contractAddressDurakTokens, durakTokenabi, signer);
        setDurakTokenContract(erc20Contract);
        const tokenName = await erc20Contract.name();
        const tokenSymbol = await erc20Contract.symbol();
        const totalSupply = await erc20Contract.totalSupply();

        const durakGameContract = new ethers.Contract(contractAddressDurakGame, durakGameabi, signer);
        setDurakGameContract(durakGameContract);
    };

    const getMyBalance = async () => {
        let balance = await durkaTokenContract.balanceOf(defaultAccount);
        let decimals = await durkaTokenContract.decimals();
        balance = balance / (10 ** decimals);
        setTokenBalance(balance.toString());
    };

    const buyTokens = async (amount ) => {
        const decimals = await durkaTokenContract.decimals();
        // let amount = ethers.utils.parseUnits("0.2", decimals);
        // i recive token amount exchange to wei
        let parsedAmount = ethers.utils.parseUnits(amount.toString(), decimals);
        try {
            let transactionResponse = await durkaTokenContract.buyTokens({
                value: parsedAmount
            });

            let transactionResult = await transactionResponse.wait();
            console.log(transactionResult);
        } catch (error) {
            console.error("An error occurred", error);
            alert("not enough funds");
        }
    };

    // You can add more functions like transferTokens, etc.

    const value = {
        defaultAccount,
        provider,
        signer,
        connectWalletHandler,
        durkaTokenContract,
        durkaGameContract,
        buyTokens,
        tokenBalance,
    };

    return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

export default WalletProvider;
