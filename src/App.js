import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import myNFT from './utils/MyNFT.json';

// Constants
const TWITTER_HANDLE = 'alpha_godhand';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
// OPENSEA_LINK = 'https://testnets.opensea.io/collection/akaynft-mswlm7xcfx';
// const TOTAL_MINT_COUNT = 50;

const App = () => {
  const CONTRACT_ADDRESS = "0x40b69848343d7A5d514524EfDbfC5774Fd3e8006";

  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
      setupEventListener();

    } else {
      console.log("No authorized account found");
    }
  }

  const connectWallet = async () => {
    const { ethereum } = window;

    if (!ethereum){
      alert("You do not have metamask. Get https//:metamask.io");
      return;
    }

    try {
      const  { ethereum } = window;

      if(!ethereum){
        alert("Get Metamask!");
        return;
      }

      const accounts = await ethereum.request({method: "eth_requestAccounts"});
      const account = accounts[0];
      setCurrentAccount(account);
      console.log("Connected", account);
      setupEventListener();

      let chainId = await ethereum.request({ method: 'eth_chainId' });
      console.log("Connected to chain " + chainId);

      // String, hex code of the chainId of the Rinkebey test network
      const rinkebyChainId = "0x4"; 
      if (chainId !== rinkebyChainId) {
        alert("You are not connected to the Rinkeby Test Network!");
      }

    } catch(error){
      console.log(error);
    }

  }

  const setupEventListener = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myNFT.abi, signer);

        // capture the event from the smart contract 
        // console.log and alert when the event is emitted
        connectedContract.on("NewAkayNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
        });

        console.log("Setup event listener!")

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const mintNFTFromContract = async () => {

    try {
      const { ethereum } = window;
  
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myNFT.abi, signer);
  
        console.log("Going to pop wallet now to pay gas...")
        let nftTxn = await connectedContract.mintAkayNFT();
  
        console.log("Mining...please wait.")
        await nftTxn.wait();
        
        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
  
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  // renders if we are not connected to any account
  const renderNotConnectedContainer = () => (
    <button className="cta-button connect-wallet-button" onClick={connectWallet}>
      Connect to Wallet
    </button>
  );

  const renderMintButton = () => (
    <div className='btn-container'>
      <button onClick={mintNFTFromContract} className="cta-button connect-wallet-button">
        Mint NFT
      </button>
      <button onClick={()=> window.open("https://testnets.opensea.io/collection/akaynft-mswlm7xcfx", "_blank")} className="cta-button connect-wallet-button">
        Show Collection
      </button>
    </div>
  );

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Akay's NFT Collection</p>
          <p className="sub-text">
            Mint an NFT from the Xtra Limited Akay Collection.
          </p>
          {currentAccount === "" ? (
            renderNotConnectedContainer()
          ) : ( renderMintButton())}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
