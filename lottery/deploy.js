const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider(
 'real divorce palace sea quick recycle ketchup enrich shy reason range submit',
 'https://rinkeby.infura.io/v3/e2e9616f36924e6c9173233ce785b2a0'
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ gas: '1000000', from: accounts[0] });

  console.log('interface', interface);
  console.log('Contract deployed to', result.options.address);
  provider.engine.stop();
};
deploy();
