// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ContestScoring is Ownable {
    struct Contest {
        string name;
        bool isLocked;
        bool exists;
    }

    struct Contestant {
        address contestantAddress;
        uint256 totalScore;
        uint256 judgeCount;
    }

    // Contest ID => Contest
    mapping(uint256 => Contest) public contests;
    uint256 public contestCount;

    // Contest ID => Judge Address => Is Judge
    mapping(uint256 => mapping(address => bool)) public isJudge;

    // Contest ID => Contestant Address => Exists
    mapping(uint256 => mapping(address => bool)) public isContestant;

    // Contest ID => Contestant Address => Contestant Data
    mapping(uint256 => mapping(address => Contestant)) public contestants;

    // Contest ID => Array of Contestant Addresses
    mapping(uint256 => address[]) public contestantList;

    // Contest ID => Judge Address => Contestant Address => Has Scored
    mapping(uint256 => mapping(address => mapping(address => bool))) public hasScored;

    // Events
    event ContestCreated(uint256 indexed contestId, string name);
    event JudgeAdded(uint256 indexed contestId, address indexed judge);
    event ContestantAdded(uint256 indexed contestId, address indexed contestant);
    event ScoreSubmitted(
        uint256 indexed contestId,
        address indexed judge,
        address indexed contestant,
        uint256 score
    );
    event ContestLocked(uint256 indexed contestId);

    constructor() Ownable(msg.sender) {}

    // Create a new contest
    function createContest(string memory _name) external onlyOwner {
        contestCount++;
        contests[contestCount] = Contest({
            name: _name,
            isLocked: false,
            exists: true
        });
        emit ContestCreated(contestCount, _name);
    }

    // Add a judge to a contest
    function addJudge(uint256 _contestId, address _judge) external onlyOwner {
        require(contests[_contestId].exists, "Contest does not exist");
        require(!contests[_contestId].isLocked, "Contest is locked");
        require(!isJudge[_contestId][_judge], "Already a judge");

        isJudge[_contestId][_judge] = true;
        emit JudgeAdded(_contestId, _judge);
    }

    // Add a contestant to a contest
    function addContestant(uint256 _contestId, address _contestant) external onlyOwner {
        require(contests[_contestId].exists, "Contest does not exist");
        require(!contests[_contestId].isLocked, "Contest is locked");
        require(!isContestant[_contestId][_contestant], "Already a contestant");

        isContestant[_contestId][_contestant] = true;
        contestants[_contestId][_contestant] = Contestant({
            contestantAddress: _contestant,
            totalScore: 0,
            judgeCount: 0
        });
        contestantList[_contestId].push(_contestant);
        emit ContestantAdded(_contestId, _contestant);
    }

    // Judge submits a score
    function submitScore(
        uint256 _contestId,
        address _contestant,
        uint256 _score
    ) external {
        require(contests[_contestId].exists, "Contest does not exist");
        require(!contests[_contestId].isLocked, "Contest is locked");
        require(isJudge[_contestId][msg.sender], "Not a judge for this contest");
        require(isContestant[_contestId][_contestant], "Not a contestant");
        require(!hasScored[_contestId][msg.sender][_contestant], "Already scored this contestant");
        require(_score <= 100, "Score must be between 0 and 100");

        hasScored[_contestId][msg.sender][_contestant] = true;
        contestants[_contestId][_contestant].totalScore += _score;
        contestants[_contestId][_contestant].judgeCount++;

        emit ScoreSubmitted(_contestId, msg.sender, _contestant, _score);
    }

    // Lock a contest
    function lockContest(uint256 _contestId) external onlyOwner {
        require(contests[_contestId].exists, "Contest does not exist");
        require(!contests[_contestId].isLocked, "Contest already locked");

        contests[_contestId].isLocked = true;
        emit ContestLocked(_contestId);
    }

    // Get leaderboard for a contest
    function getLeaderboard(uint256 _contestId) 
        external 
        view 
        returns (address[] memory, uint256[] memory, uint256[] memory) 
    {
        require(contests[_contestId].exists, "Contest does not exist");

        uint256 length = contestantList[_contestId].length;
        address[] memory addresses = new address[](length);
        uint256[] memory totalScores = new uint256[](length);
        uint256[] memory judgeCounts = new uint256[](length);

        for (uint256 i = 0; i < length; i++) {
            address contestantAddr = contestantList[_contestId][i];
            addresses[i] = contestantAddr;
            totalScores[i] = contestants[_contestId][contestantAddr].totalScore;
            judgeCounts[i] = contestants[_contestId][contestantAddr].judgeCount;
        }

        return (addresses, totalScores, judgeCounts);
    }

    // Get contest details
    function getContest(uint256 _contestId) 
        external 
        view 
        returns (string memory name, bool isLocked, bool exists) 
    {
        Contest memory contest = contests[_contestId];
        return (contest.name, contest.isLocked, contest.exists);
    }
}
