import { useState, useEffect, useCallback } from 'react';
import { Button, Navbar, Segment, Header } from 'decentraland-ui'
import TransferModal from './components/TransferModal';
import './App.css';
import {useBlockchainInfo} from './context/blockchain-info';

function App() {
  const {connect, tokenContract, connectLoading, selectedAccount} = useBlockchainInfo();
  const [dummyBalance, setDummyBalance] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  const getBalance = useCallback(async () => {
    if(selectedAccount && tokenContract?.current){
        const dummyBalance = await tokenContract.current.methods.balanceOf(selectedAccount).call();
        setDummyBalance(dummyBalance);
      };
  }, [selectedAccount, tokenContract])
  useEffect(() => {
    getBalance()
  }, [getBalance])

  const handleModalVisibility = () => {
    setModalVisible(true);
  }
  const handleClose = () => {
    setModalVisible(false);
  }

  const onTransferSuccess = () => {
    getBalance();
  }
  return (
  <div>
    <TransferModal isVisible={modalVisible} onClose={handleClose} onTransferSuccess={onTransferSuccess} />
    <Navbar />
    <div className="container">
      {!selectedAccount ? 
        <Button color="red" onClick={connect} loading={connectLoading}>Connect</Button> 
      : 
        <Segment style={{ width: 400 }}>
          <Header>Wallet</Header>
          <p><b>Address: </b>{selectedAccount}</p>
          <p><b>Balance: </b>{dummyBalance} DUMMY</p>
          <Button basic onClick={handleModalVisibility} className="transferButton">Transfer</Button>
        </Segment>
      }
    </div>
  </div>
  );
}

export default App;
