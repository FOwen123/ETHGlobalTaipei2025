// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract Betcha {
    using Chainlink for Chainlink.Request;

    error Betcha__BetAmountMusbtBeGreaterThanZero();
    error Betcha__InvalidOpponent();
    error Betcha__BetIsNotOpen();
    error Betcha__NotTheInvitedOpponent();
    error Betcha__IncorrectAmount();
    error Betcha__NotResolvableYet();

    enum BetStatus {
        PENDING,
        ACTIVE,
        COMPLETED
    }

    struct Bet {
        address creator;
        address opponent;
        uint256 betAmount;
        uint256 distanceGoal;
        uint256 deadline;
        uint256 opponentDistance;
        string betDescription;
        BetStatus status;
    }

    uint256 private _nextBetId = 1;
    mapping(uint256 => Bet) public bets; // betId -> Bet

    // Oracle stuff ??
    address private oracleAddress;
    bytes32 private jobId;
    uint256 private fee;

    // Strava API response tracking??
    mapping(uint256 => uint256) public stravaPlayer1Distance;
    mapping(uint256 => uint256) public stravaPlayer2Distance;

    event BetCreated(uint256 betId, address creator, uint256 amount);
    event BetAccepted(uint256 betId, address opponent);
    event NotificationSend(address to, string message);
    event BetResolved(uint256 betId, address winner);

    constructor(address _oracle, bytes32 _jobId, uint256 _fee) {
        jobId = _jobId;
        fee = _fee;
    }

    function createBet(
        address _opponent,
        uint256 _distanceGoal,
        uint256 _deadline,
        string memory _desc
    ) external payable returns (uint256) {
        require(msg.value > 0, Betcha__BetAmountMusbtBeGreaterThanZero());
        require(
            _opponent != address(0) && _opponent != msg.sender,
            Betcha__InvalidOpponent()
        );

        uint256 betId = _nextBetId++;
        bets[betId] = Bet({
            creator: msg.sender,
            opponent: _opponent,
            betAmount: msg.value,
            distanceGoal: _distanceGoal,
            deadline: block.timestamp + (_deadline * 1 days),
            opponentDistance: 0,
            betDescription: _desc,
            status: BetStatus.PENDING
        });

        emit BetCreated(betId, msg.sender, msg.value);
        emit NotificationSend(_opponent, "You have a new bet!");
        return betId;
    }

    function acceptBet(uint256 _betId) external payable {
        Bet storage bet = bets[_betId];
        require(bet.status == BetStatus.PENDING, Betcha__BetIsNotOpen());
        require(msg.sender == bet.opponent, Betcha__NotTheInvitedOpponent());
        require(msg.value == bet.betAmount, Betcha__IncorrectAmount());

        bet.status = BetStatus.ACTIVE;
        emit BetAccepted(_betId, msg.sender);
    }

    // function submitProof(
    //     uint256 _betId,
    //     uint256 _distance,
    //     string memory _proofLink
    // ) external {
    //     require(msg.sender == oracleVerifier, "Only oracle");
    //     Bet storage bet = bets[_betId];
    //     require(bet.status == BetStatus.Active, "Bet not active");

    //     bet.opponentDistance = _distance;
    //     bet.proofLink = _proofLink;

    //     // Auto-resolve if completed
    //     if (_distance >= bet.distanceGoal) {
    //         _resolveBet(_betId);
    //     }
    // }

    function resolveBet(uint256 _betId) private {
        Bet storage bet = bets[_betId];
        require(
            bet.opponentDistance >= bet.distanceGoal ||
                block.timestamp >= bet.deadline,
            Betcha__NotResolvableYet()
        );

        address winner;
        if (bet.opponentDistance >= bet.distanceGoal) {
            winner = bet.opponent;
        } else {
            winner = bet.creator;
        }

        payable(winner).transfer(bet.betAmount * 2);
        bet.status = BetStatus.COMPLETED;
        emit BetResolved(_betId, winner);
    }
}
