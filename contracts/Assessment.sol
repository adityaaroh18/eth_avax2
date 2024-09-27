// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//import "hardhat/console.sol";

contract Assessment {
    address payable public owner;
    uint256 public Temperature;

    event IncreaseTemperature(uint256 Temp);
    event DecreaseTemperature(uint256 Temp);

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        Temperature = initBalance;
    }

    function getBalance() public view returns(uint256){
        return Temperature;
    }

    function Increasetemperature(uint256 _Temp) public payable {
        uint _Previous = Temperature;

        // make sure this is the owner
        require(msg.sender == owner, "You are not the owner of this account");

        // perform transaction
        Temperature += _Temp;

        // assert transaction completed successfully
        assert(Temperature == _Previous + _Temp);

        // emit the event
        emit IncreaseTemperature(_Temp);
    }

    // custom error
    error Insufficient(uint256 Temperature, uint256 DecreasetemperatureRate);

    function Decreasetemperature(uint256 _Decrease) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint _Previous = Temperature;
        if (Temperature < _Decrease) {
            revert Insufficient({
                Temperature: Temperature,
                DecreasetemperatureRate: _Decrease
            });
        }

        // DecreaseTemperature the given Temp
        Temperature -= _Decrease;

        // assert the Temperature is correct
        assert(Temperature == (_Previous - _Decrease));

        // emit the event
        emit DecreaseTemperature(_Decrease);
    }
}
