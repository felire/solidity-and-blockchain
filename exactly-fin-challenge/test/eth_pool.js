const ETHPool = artifacts.require("ETHPool");

const executeTranactionAndReturnGas = (transactionFunction) => async () => {
  const transaction = await transactionFunction();
  const gasUsed = transaction.receipt.gasUsed;
  const tx = await web3.eth.getTransaction(transaction.tx);
  const gasPrice = tx.gasPrice;
  return parseInt(gasPrice) * parseInt(gasUsed)
}
contract('ETHPool', (accounts) => {
  let [owner, address1, address2, address3] = accounts;
  let ethPoolInstance;
  beforeEach(async () => {
    ethPoolInstance = await ETHPool.new();
  })
  it('deposit method', async () => {
    const initialBalance = await ethPoolInstance.balance();
    const initialAddress1Balance = await web3.eth.getBalance(address1);
    const initialAddress2Balance = await web3.eth.getBalance(address2);
    await ethPoolInstance.deposit({from: address1, value: web3.utils.toWei("1", "ether")});
    await ethPoolInstance.deposit({from: address2, value: web3.utils.toWei("1", "ether")});
    const finalBalance = await ethPoolInstance.balance();
    const finalAddress1Balance = await web3.eth.getBalance(address1);
    const finalAddress2Balance = await web3.eth.getBalance(address2);
    assert.equal(finalBalance.valueOf(), web3.utils.toWei("2", "ether"));
    assert.isAbove(initialAddress1Balance.valueOf() - finalAddress1Balance.valueOf(), parseInt(web3.utils.toWei("1", "ether")));
    assert.isAbove(initialAddress2Balance.valueOf() - finalAddress2Balance.valueOf(), parseInt(web3.utils.toWei("1", "ether")));
  });
  it('multiple deposits from single user', async () => {
    await ethPoolInstance.deposit({from: address1, value: web3.utils.toWei("1", "ether")});
    await ethPoolInstance.deposit({from: address1, value: web3.utils.toWei("1", "ether")});
    await ethPoolInstance.deposit({from: address1, value: web3.utils.toWei("1", "ether")});
    const userAddress = await ethPoolInstance.usersAddress(0);
    assert.equal(userAddress, address1);
    try {
      await ethPoolInstance.usersAddress(1);
    } catch {
      assert.isOk(true);
      return;
    }
    assert.isOk(false);
  });
  it('withdraw same amount when there was no rewards', async () => {
    const initialAddress1Balance = await web3.eth.getBalance(address1);
    const gas1 = await executeTranactionAndReturnGas(() => ethPoolInstance.deposit({from: address1, value: web3.utils.toWei("1", "ether")}))();
    const gas2 = await executeTranactionAndReturnGas(() => ethPoolInstance.withdraw({from: address1}))()
    const finalBalance = await web3.eth.getBalance(address1);
    assert.equal((parseInt(finalBalance) + gas1 + gas2).toString(), initialAddress1Balance.toString());
  });
  it('Not distribute rewards on empty pull', async () => {
    try{
      await ethPoolInstance.addRewards({from: owner, value: web3.utils.toWei("1", "ether")});
    }
    catch {
      assert.isOk(true);
      return;
    }
    assert.isOk(false);
  });
  it('Distribute rewards on non empty pull', async () => {
    await ethPoolInstance.deposit({from: address1, value: web3.utils.toWei("1", "ether")});
    await ethPoolInstance.deposit({from: address2, value: web3.utils.toWei("1", "ether")});
    await ethPoolInstance.addRewards({from: owner, value: web3.utils.toWei("1", "ether")});
    const finalBalance = await ethPoolInstance.balance();
    assert.equal(finalBalance.valueOf(), web3.utils.toWei("3", "ether"));
  });
  it('non team member try to add rewards', async () => {
    await ethPoolInstance.deposit({from: address1, value: web3.utils.toWei("1", "ether")});
    await ethPoolInstance.deposit({from: address2, value: web3.utils.toWei("1", "ether")});
    try{
      await ethPoolInstance.addRewards({from: address1, value: web3.utils.toWei("1", "ether")});
    }
    catch {
      assert.isOk(true);
      return;
    }
    assert.isOk(false);
  });
  it('Add team member and add reward', async () => {
    await ethPoolInstance.addTeamMember(address3);
    await ethPoolInstance.deposit({from: address1, value: web3.utils.toWei("1", "ether")});
    await ethPoolInstance.deposit({from: address2, value: web3.utils.toWei("1", "ether")});
    await ethPoolInstance.addRewards({from: address3, value: web3.utils.toWei("1", "ether")});
    const finalBalance = await ethPoolInstance.balance();
    assert.equal(finalBalance.valueOf(), web3.utils.toWei("3", "ether"));
  });
  it('Add team member and remove it', async () => {
    await ethPoolInstance.addTeamMember(address3);
    await ethPoolInstance.deposit({from: address1, value: web3.utils.toWei("1", "ether")});
    await ethPoolInstance.deposit({from: address2, value: web3.utils.toWei("1", "ether")});
    await ethPoolInstance.addRewards({from: address3, value: web3.utils.toWei("1", "ether")});
    await ethPoolInstance.removeTeamMember(address3);
    try{
      await ethPoolInstance.addRewards({from: address3, value: web3.utils.toWei("1", "ether")});
    }
    catch {
      assert.isOk(true);
      return;
    }
    assert.isOk(false);
  });
  it('Rewards distribution', async () => {
    await ethPoolInstance.deposit({from: address1, value: web3.utils.toWei("1", "ether")});
    await ethPoolInstance.deposit({from: address2, value: web3.utils.toWei("1", "ether")});
    await ethPoolInstance.deposit({from: address3, value: web3.utils.toWei("2", "ether")});
    await ethPoolInstance.addRewards({from: owner, value: web3.utils.toWei("1", "ether")});
    const user1 = await ethPoolInstance.users(address1);
    const user2 = await ethPoolInstance.users(address2);
    const user3 = await ethPoolInstance.users(address3);
    const finalBalance = await ethPoolInstance.balance();
    assert.equal(user1.depositAmount.valueOf(), web3.utils.toWei("1.25", "ether"));
    assert.equal(user2.depositAmount.valueOf(), web3.utils.toWei("1.25", "ether"));
    assert.equal(user3.depositAmount.valueOf(), web3.utils.toWei("2.5", "ether"));
  });
  it('deposit, rewards and withdraw', async () => {
    const initialAddress1Balance = await web3.eth.getBalance(address1);
    const initialAddress2Balance = await web3.eth.getBalance(address2);
    const initialAddress3Balance = await web3.eth.getBalance(address3);
  
    const gasDepositUser1 = await executeTranactionAndReturnGas(() => ethPoolInstance.deposit({from: address1, value: web3.utils.toWei("1", "ether")}))();
    const gasDepositUser2 = await executeTranactionAndReturnGas(() => ethPoolInstance.deposit({from: address2, value: web3.utils.toWei("1", "ether")}))();
    const gasDepositUser3 = await executeTranactionAndReturnGas(() => ethPoolInstance.deposit({from: address3, value: web3.utils.toWei("2", "ether")}))();
    
    await ethPoolInstance.addRewards({from: owner, value: web3.utils.toWei("1", "ether")});

    const gasWithdraw1 = await executeTranactionAndReturnGas(() => ethPoolInstance.withdraw({from: address1}))()
    const gasWithdraw2 = await executeTranactionAndReturnGas(() => ethPoolInstance.withdraw({from: address2}))()
    const gasWithdraw3 = await executeTranactionAndReturnGas(() => ethPoolInstance.withdraw({from: address3}))()

    const finalAddress1Balance = await web3.eth.getBalance(address1);
    const finalAddress2Balance = await web3.eth.getBalance(address2);
    const finalAddress3Balance = await web3.eth.getBalance(address3);
    const finalBalance = await ethPoolInstance.balance();
    assert.equal(parseInt(finalAddress1Balance) + gasDepositUser1 + gasWithdraw1, parseInt(initialAddress1Balance) + parseInt(web3.utils.toWei("0.25", "ether")));
    assert.equal(parseInt(finalAddress2Balance) + gasDepositUser2 + gasWithdraw2, parseInt(initialAddress2Balance) + parseInt(web3.utils.toWei("0.25", "ether")));
    assert.equal(parseInt(finalAddress3Balance) + gasDepositUser3 + gasWithdraw3, parseInt(initialAddress3Balance) + parseInt(web3.utils.toWei("0.5", "ether")));
    assert.equal(finalBalance, 0);
  });
});
