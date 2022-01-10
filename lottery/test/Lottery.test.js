const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require('../compile');

let accounts;
let lotteryContract;

beforeEach(async () => {
 //Get a list of all accounts
 accounts = await web3.eth.getAccounts();
 //Use one of those accounts to deploy contract

 lotteryContract = await new web3.eth.Contract(JSON.parse(interface))
 .deploy({data: bytecode})
 .send({from: accounts[0], gas: '1000000'});
})
describe('Lottery contract', () => {
 it('deploys a contract', () => {
  assert.ok(lotteryContract.options.address);
 });

 it('enter lottery function with multiple accounts ', async () => {
  await lotteryContract.methods.enter().send({from: accounts[0], value: web3.utils.toWei('0.02', 'ether')});
  await lotteryContract.methods.enter().send({from: accounts[1], value: web3.utils.toWei('0.02', 'ether')});
  await lotteryContract.methods.enter().send({from: accounts[2], value: web3.utils.toWei('0.02', 'ether')});
  const players = await lotteryContract.methods.getPlayers().call();
  assert.equal(accounts[0], players[0]);
  assert.equal(accounts[1], players[1]);
  assert.equal(accounts[2], players[2]);
  assert.equal(3, players.length);
 });

 it('require minimum amount of ether', async () => {
 try{
  await lotteryContract.methods.enter().send({from: accounts[0], value: web3.utils.toWei('0.005', 'ether')});
  assert(false);
 } catch (err) {
  assert(err);
 }
 });

 it('only manager can call pickWinner', async () => {
 await lotteryContract.methods.enter().send({from: accounts[0], value: web3.utils.toWei('0.02', 'ether')});
 await lotteryContract.methods.enter().send({from: accounts[1], value: web3.utils.toWei('0.02', 'ether')});
 try{
  await lotteryContract.methods.pickWinner().send({from: accounts[1]});
  assert(false)
 }
 catch(err) {
  assert(err);
  try{
   await lotteryContract.methods.pickWinner().send({from: accounts[0]});
   assert(true);
  }
  catch {
   assert(false)
  }
 }
 })

it('end to end test', async () => {
 await lotteryContract.methods.enter().send({from: accounts[0], value: web3.utils.toWei('2', 'ether')});

 const initialBalance = await web3.eth.getBalance(accounts[0]);

 await lotteryContract.methods.pickWinner().send({from: accounts[0]});

 const finalBalance = await web3.eth.getBalance(accounts[0]);

 const difference = finalBalance - initialBalance;
console.log(difference);
 assert(difference > web3.utils.toWei('1.99', 'ether'))
})
 // it('set new value and check', async () => {
 //  await inboxContract.methods.setMessage('Merlusa').send({from: accounts[0]});
 //  const newMessage =  await lotteryContract.methods.message().call();
 //  assert.length(newMessage, 'Merlusa');
 // })
})