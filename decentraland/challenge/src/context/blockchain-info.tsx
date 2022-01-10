import React, {useRef, useCallback, useState, useEffect} from 'react';
import Web3 from "web3";
import { Contract } from 'web3-eth-contract'

import {ABI_INTERFACE, CONTRACT_ADDRESS} from '../token';
 
interface Props {
  children: React.ReactChild | React.ReactChild[];
}

interface BlockchaionInfoProps {
 web3: React.MutableRefObject<Web3 | null> | null;
 tokenContract: React.MutableRefObject<Contract | null> | null;
 connect: () => void;
 connectLoading: boolean;
 selectedAccount: string | null;
}
const Constants = {
 rinkebyChainId: '0x4',
 rinkebyNetworkId: '4'
}
export const Context = React.createContext<BlockchaionInfoProps>({web3: null, tokenContract: null, connect: () => {}, connectLoading: false, selectedAccount: null});

export const useBlockchainInfo = (): BlockchaionInfoProps => React.useContext(Context);

const BlockchainInfo = ({ children }: Props): JSX.Element => {
 const tokenContractRef = useRef<Contract | null>(null);
 const web3Ref = useRef<Web3 | null>(null);
 const [connectLoading, setConnectLoading] = useState(false);
 const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
 const getAccounts = useCallback(async (): Promise<string[] | undefined> => {
  if(web3Ref?.current){
   const accounts = await web3Ref.current.eth.getAccounts();
   setSelectedAccount(accounts[0]);
   return accounts;
  }
 }, [web3Ref])
//  const switchToRinkebyChain = useCallback(async () => {
//   await window.ethereum.request({
//    method: 'wallet_switchEthereumChain',
//    params: [{ chainId: Constants.rinkebyChainId }],
//   });
//  }, []);
 useEffect(() => {
  (async () => {
     if(window.ethereum){
      // await switchToRinkebyChain()
      web3Ref.current = new Web3(window.ethereum);
      const accounts = await getAccounts();
      if(accounts){
       if(accounts.length > 0){
        tokenContractRef.current = new web3Ref.current.eth.Contract(ABI_INTERFACE, CONTRACT_ADDRESS);
       }
      }
     }
    })()
 }, [getAccounts])

 useEffect(() => {
  if(window.ethereum){
   window.ethereum.on('accountsChanged', () => {
      getAccounts();
    })
  }
  // window.ethereum.on('networkChanged', async (networkId: string) => {
  //  await getAccounts();
  //  if(networkId !== Constants.rinkebyNetworkId){
  //   setSelectedAccount(null);
  //  }
  // });
 }, [getAccounts]);

 const connect = useCallback(async () => {
   try{
    setConnectLoading(true);
    // await switchToRinkebyChain();
    await window.ethereum.request({ method: "eth_requestAccounts" });
    setConnectLoading(false);
   }
   catch {
    setConnectLoading(false);
   }
  web3Ref.current = new Web3(window.ethereum);
  tokenContractRef.current = new web3Ref.current.eth.Contract(ABI_INTERFACE, CONTRACT_ADDRESS);
  await getAccounts();
 }, [getAccounts])

  return (
    <Context.Provider value={{connect, tokenContract: tokenContractRef, web3: web3Ref, connectLoading, selectedAccount}}>
      {children}
    </Context.Provider>
  );
};

export default BlockchainInfo;
