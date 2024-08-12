// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//import "hardhat/console.sol";

contract Assessment {
    address payable public owner;
    uint256 public Rating;

    event PositiveRating(uint256 Rate);
    event NegativeRating(uint256 Rate);

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        Rating = initBalance;
    }

    function getBalance() public view returns(uint256){
        return Rating;
    }

    function Positiverating(uint256 _Rate) public payable {
        uint _PreviousRating = Rating;

        // make sure this is the owner
        require(msg.sender == owner, "You are not the owner of this account");

        // perform transaction
        Rating += _Rate;

        // assert transaction completed successfully
        assert(Rating == _PreviousRating + _Rate);

        // emit the event
        emit PositiveRating(_Rate);
    }

    // custom error
    error InsufficientRating(uint256 Rating, uint256 NegativeRatingRate);

    function Negativerating(uint256 _NegativeRatingRate) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint _PreviousRating = Rating;
        if (Rating < _NegativeRatingRate) {
            revert InsufficientRating({
                Rating: Rating,
                NegativeRatingRate: _NegativeRatingRate
            });
        }

        // NegativeRating the given Rate
        Rating -= _NegativeRatingRate;

        // assert the Rating is correct
        assert(Rating == (_PreviousRating - _NegativeRatingRate));

        // emit the event
        emit NegativeRating(_NegativeRatingRate);
    }
}
