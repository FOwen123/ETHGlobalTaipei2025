// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { Betcha } from "./Betcha.sol";

/**
 * @title StravaVerifier
 * @notice This contract verifies Strava activity proofs and interacts with the Betcha contract
 */
contract StravaVerifier {
    error StravaVerifier__InvalidSignature();
    error StravaVerifier__ActivityAlreadyVerified();
    error StravaVerifier__BetNotActive();
    error StravaVerifier__UnauthorizedSigner();

    // Betcha contract reference
    Betcha public immutable betchaContract;
    
    // Oracle address that signs the activity proofs
    address public oracleAddress;
    
    // Mapping to track verified activities
    mapping(uint256 => mapping(string => bool)) public verifiedActivities; // athleteId -> activityId -> verified
    
    // Mapping from athlete ID to wallet address
    mapping(uint256 => address) public athleteWallets; // athleteId -> wallet address

    // Events
    event ActivityVerified(uint256 indexed athleteId, string activityId, uint256 distanceKm);
    event AthleteRegistered(uint256 indexed athleteId, address wallet);
    event OracleUpdated(address indexed oldOracle, address indexed newOracle);

    constructor(address _betchaContractAddress, address _oracleAddress) {
        betchaContract = Betcha(_betchaContractAddress);
        oracleAddress = _oracleAddress;
    }
    
    /**
     * @notice Register a Strava athlete ID with a wallet address
     * @param athleteId The Strava athlete ID
     */
    function registerAthlete(uint256 athleteId) external {
        athleteWallets[athleteId] = msg.sender;
        emit AthleteRegistered(athleteId, msg.sender);
    }
    
    /**
     * @notice Set a new oracle address
     * @param newOracleAddress The new oracle address
     */
    function setOracleAddress(address newOracleAddress) external {
        // In production, add access control here (e.g., onlyOwner)
        address oldOracle = oracleAddress;
        oracleAddress = newOracleAddress;
        emit OracleUpdated(oldOracle, newOracleAddress);
    }
    
    function verifyActivityAndUpdateBet(
        uint256 betId,
        uint256 athleteId,
        string calldata activityId,
        uint256 distanceKm, // Value is multiplied by 100 (e.g., 5.25 km = 525)
        string calldata activityDate,
        string calldata activityHash,
        bytes calldata signature
    ) external {
        // Check if activity already verified
        if (verifiedActivities[athleteId][activityId]) {
            revert StravaVerifier__ActivityAlreadyVerified();
        }
        
        // Verify the signature
        bytes32 messageHash = keccak256(
            abi.encodePacked(
                athleteId,
                distanceKm,
                activityDate,
                activityHash
            )
        );
        
        bytes32 ethSignedMessageHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash)
        );
        
        address recoveredSigner = recoverSigner(ethSignedMessageHash, signature);
        
        if (recoveredSigner != oracleAddress) {
            revert StravaVerifier__UnauthorizedSigner();
        }
        
        // Mark activity as verified
        verifiedActivities[athleteId][activityId] = true;
        
        // Calculate actual distance in meters (contract expects meters)
        uint256 distanceMeters = distanceKm * 1000; // Convert from km*1000 to meters
        
        // Update the bet with the verified distance
        betchaContract.verifyDistance(betId, athleteId, distanceMeters);
        
        emit ActivityVerified(athleteId, activityId, distanceKm);
    }
    
    /**
     * @notice Recover the signer from a signature
     * @param _ethSignedMessageHash The signed message hash
     * @param _signature The signature
     * @return The address that signed the message
     */
    function recoverSigner(bytes32 _ethSignedMessageHash, bytes memory _signature) 
        internal 
        pure 
        returns (address) 
    {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);
        return ecrecover(_ethSignedMessageHash, v, r, s);
    }
    

    function splitSignature(bytes memory sig)
        internal
        pure
        returns (bytes32 r, bytes32 s, uint8 v)
    {
        require(sig.length == 65, "Invalid signature length");

        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }

        if (v < 27) {
            v += 27;
        }

        return (r, s, v);
    }
} 