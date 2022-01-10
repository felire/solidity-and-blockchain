const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const { abi, evm } = require('../compile');

let accounts;
let inboxContract;

beforeEach(async () => {
 //Get a list of all accounts
 accounts = await web3.eth.getAccounts();
 //Use one of those accounts to deploy contract

 inboxContract = await new web3.eth.Contract(abi)
 .deploy({data: evm.bytecode.object, arguments: ['Hi there!']})
 .send({from: accounts[0], gas: '1000000'});
})
describe('Inbox contract', () => {
 it('deploys a contract', () => {
  assert.ok(inboxContract.options.address);
 });

 it('has a default value', async () => {
  const message = await inboxContract.methods.message().call();
  assert.equal(message, 'Hi there!');
 });

 it('set new value and check', async () => {
  await inboxContract.methods.setMessage('Merlusa').send({from: accounts[0]});
  const newMessage =  await inboxContract.methods.message().call();
  assert.equal(newMessage, 'Merlusa');
 })
})