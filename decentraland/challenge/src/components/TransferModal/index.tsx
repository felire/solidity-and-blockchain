import { useState, useRef } from 'react';
import { Button, Field, Modal, Close, InputOnChangeData } from 'decentraland-ui'
import { useBlockchainInfo } from '../../context/blockchain-info';

interface TransferModalProps {
 isVisible: boolean;
 onClose: () => void;
 onTransferSuccess: () => void;
}
function TransferModal({isVisible, onClose, onTransferSuccess}: TransferModalProps)  {
  const {tokenContract, selectedAccount} = useBlockchainInfo();
  const amountRef = useRef('');
  const addressRef = useRef('');
  const [transactionLoading, setTransactionLoading] = useState(false);

  const handleOnAmountChange = (_:React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
   amountRef.current = (data.value)
  }
  const handleOnAddressChange = (_:React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
   addressRef.current = (data.value)
  }
  const handleOnTransferPress = async () => {
   if(tokenContract?.current && selectedAccount){
    setTransactionLoading(true);
    await tokenContract.current.methods.transfer(addressRef.current, amountRef.current).send({from: selectedAccount});
    setTransactionLoading(false);
    onTransferSuccess();
   }
  }
  return (
      <Modal open={isVisible} closeIcon={<Close />} onClose={onClose}>
        <Modal.Header>Transfer</Modal.Header>
        <Modal.Description>Send tokens to an account!</Modal.Description>
        <Modal.Content>
          <Field type="numeric" label="Amount" placeholder="100" onChange={handleOnAmountChange} />
          <Field type="address" label="Address" placeholder="0x..." onChange={handleOnAddressChange} />
        </Modal.Content>
        <Modal.Actions>
          <Button primary onClick={handleOnTransferPress} loading={transactionLoading}>Transfer</Button>
        </Modal.Actions>
      </Modal>
  );
}

export default TransferModal;
