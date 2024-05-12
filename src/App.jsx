import './styles/App.css';
import React, { useEffect } from "react";
import bgdnft from './utils/bgdnft.json';
import bgdimg from './assets/bdg-tu-main.png';
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers5/react'

const App = () => {
  const { address, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const CONTRACT_ADDRESS = "0xD958bC042f41602c0236E8006bAe54Cb2B6c744f";

  const ethers = require("ethers")

  const checkIfWalletIsConnected = async () => {
    if (!isConnected) {
      alert('Please connect your wallet')
    } else {
      alert("Connected", address);
      setupEventListener();
    }
  }

  const setupEventListener = async () => {
    try {
      if (isConnected) {
        const provider = new ethers.providers.Web3Provider(walletProvider);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, bgdnft.abi, signer);

        // capture the event from the smart contract 
        // console.log and alert when the event is emitted
        connectedContract.on("MintedNft", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
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
    const mintPrice = ethers.utils.parseEther("0.0015");

    try {
  
      if (isConnected) {
        const provider = new ethers.providers.Web3Provider(walletProvider);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, bgdnft.abi, signer);
  
        console.log("Going to pop wallet now to pay gas...")
        let nftTxn = await connectedContract.mint({value: mintPrice});
  
        alert("Minting...please wait.")
        await nftTxn.wait();
        
        alert(`Mined, see transaction: https://etherscan.io/tx/${nftTxn.hash}`);
  
      } else {
        alert("Please connect your wallet");
      }
    } catch (error) {
      alert(error.message);
    }
  }

  // renders if we are not connected to any account
  const renderConnectWallet = () => (
    <div className='walletConnect'>
      <w3m-button size='md' loadingLabel='Connecting...'/>
    </div>
  );

  const renderMintButton = () => (
    <div className='btn-container'>
      <button onClick={mintNFTFromContract} className="cta-button connect-wallet-button">
        Mint NFT
      </button>
      <button onClick={()=> window.open("https://opensea.io/collection/0xD958bC042f41602c0236E8006bAe54Cb2B6c744f", "_blank")} className="cta-button connect-wallet-button">
        Show Collection
      </button>
    </div>
  );

  useEffect(() => {
    checkIfWalletIsConnected();
  })

  return (
    <div className="App">
      <div className="container">
        {renderConnectWallet()}
        <div className="header-container">
          <p className="header gradient-text">Big Green Dildo NFT Collection</p>
          <div className="img-ctn">
            <img className="dildo-image" src={bgdimg} alt='Green dildo with smiley face showing thumbs up'/>
          </div>
          <p className="sub-text">
            We at BGD believe that by working together we can show the SEC and that scammer Gary Gensler 
            that crypto is here to stay. 
            <br /><br />
            That is why we have created the BGD NFT Collection! An NFT to use as a PFP on social media, 
            something to be shared on posts and a way to show you are part of the BGD community.
            <br /><br />
            Mint your own unique BGD NFT and join our movement! 
            Let’s stick it up to the SEC and show nothing will stop a Big Green Dildo!
          </p>
          {renderMintButton()}
        </div>
      </div>
    </div>
  );
};

export default App;