const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { abi, evm } = require('./compile');

const provider = new HDWalletProvider(
 'real divorce palace sea quick recycle ketchup enrich shy reason range submit',
 'https://rinkeby.infura.io/v3/e2e9616f36924e6c9173233ce785b2a0'
);
const web3 = new Web3(provider);

const deploy = async () => {
 const accounts = await web3.eth.getAccounts();

 console.log('Attempting to deploy from acccount', accounts[0]);

 const result = await new web3.eth.Contract(abi)
 .deploy({data: evm.bytecode.object, arguments: ['Hi there!']})
 .send({from: accounts[0], gas: '1000000'});

 console.log('Contract deployed to', result.options.address);
 provider.engine.stop();
};
deploy();