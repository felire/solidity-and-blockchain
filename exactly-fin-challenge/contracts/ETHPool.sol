//SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.11;
import "@openzeppelin/contracts/access/AccessControl.sol";

contract ETHPool is AccessControl {
    bytes32 public constant TEAM_MEMBER = keccak256("TEAM_MEMBER");
    struct UserData {
        bool hasInteracted;
        uint depositAmount;
    }

    address[] public usersAddress;
    mapping(address => UserData) public users;
    uint public balance;
    constructor() {
       _setupRole(TEAM_MEMBER, msg.sender);
       _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
    
    function addTeamMember(address teamMember) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _setupRole(TEAM_MEMBER, teamMember);
    }

    function removeTeamMember(address teamMember) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(TEAM_MEMBER, teamMember);
    }


    function deposit() public payable {
        UserData storage userData = users[msg.sender];
        if(!userData.hasInteracted){
            usersAddress.push(msg.sender);
            userData.hasInteracted = true;
        }
        userData.depositAmount += msg.value;
        balance += msg.value;
    }

    function addRewards() public payable onlyRole(TEAM_MEMBER) {
        require(balance > 0, "There isn't any user with deposits inside the contract, reverting in order to avoid losing money");
        for(uint i = 0; i < usersAddress.length; i++){
            UserData storage userData = users[usersAddress[i]];
            uint rewards = ((userData.depositAmount*msg.value)/balance);
            userData.depositAmount += rewards;
        }
        balance += msg.value;
    }

    function withdraw() public {
        UserData storage userData = users[msg.sender];
        require(userData.depositAmount > 0);
        uint amount = userData.depositAmount;
        userData.depositAmount = 0;
        balance -= amount;
        (bool success, ) = msg.sender.call{value:amount}("");
        require(success, "Transfer failed.");
    }
}