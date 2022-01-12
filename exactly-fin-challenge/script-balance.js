const fs = require('fs');
const path = require('path');
const Web3 = require('web3');
const { exec } = require("child_process");

const CONTRACT_ADDRESS = '0x7Ac207b24966E3922749a337C243e3dDe6A6E99A';
const provider = new Web3.providers.HttpProvider(
  "https://rinkeby.infura.io/v3/e2e9616f36924e6c9173233ce785b2a0"
);
const web3 = new Web3(provider);


exec('truffle compile', () => {
 const ETHPoolPath = path.resolve(__dirname, 'build', 'contracts', 'ETHPool.json');
 const source = fs.readFileSync(ETHPoolPath, 'utf8');

 const ABI = JSON.parse(source).abi;

 const scriptFunction = async () => {
  const ethPoolContract = await new web3.eth.Contract(ABI, CONTRACT_ADDRESS);
  const theoricalBalance = await ethPoolContract.methods.balance().call();
  const realBalance = await web3.eth.getBalance(CONTRACT_ADDRESS)
  console.log(theoricalBalance);
  console.log(realBalance);
 }

 scriptFunction();
});

