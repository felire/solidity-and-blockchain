import {useState, useEffect} from 'react';

import logo from './logo.svg';
import './App.css';
import web3 from "./web3";
import lottery from './lottery';

function App() {
  const [manager, setManager] = useState('');
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState(''); //on wei
  const [valueToPlay, setValueToPlay] = useState('0');//on ether

  useEffect(() => {
    (async () => {
      const managerAddress = await lottery.methods.manager().call();
      const playersArray = await lottery.methods.getPlayers().call();
      const balanceResult = await web3.eth.getBalance(lottery.options.address);
      setManager(managerAddress);
      setPlayers(playersArray);
      setBalance(balanceResult);
    })()
  }, [])
  web3.eth.getAccounts().then(console.log);

  const handleInput = (event) => {
    setValueToPlay(event.target.value);
  }

  const onSubmit = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    
    await lottery.methods.enter().send({from: accounts[0], value: web3.utils.toWei(valueToPlay, 'ether')});
  }

  const handlePickWinner = async () => {
    const accounts = await web3.eth.getAccounts();
    await lottery.methods.pickWinner().send({from: accounts[0] });
  }
  return (
    <div className="App">
    <h2>Lottery Contract</h2>
    <p>This contract is managed by: {manager}</p>

    <h1>Players</h1>
    <p>{players.join('\n')}</p>

    <h1>Number of players</h1>
    <p>{players.length}</p>


    <h1>Contract Balance</h1>
    <p>Balance: {web3.utils.fromWei(balance, 'ether')} ether</p>

    <form onSubmit={onSubmit}>
      <h4>Do you want to try your luck?</h4>
      <div>
        <label>Amount of ehter to enter </label>
        <input value={valueToPlay} onChange={handleInput} />
      </div>
      <button>Enter</button>
    </form>

    <h4>Ready to pick a winner?</h4>
    <button onClick={handlePickWinner}>Pick a winner!</button>
    </div>
  );
}

export default App;
