import { ethers } from 'ethers';
import crypto from 'crypto';

// Type for the activity with distance
interface StravaActivity {
    id: string;
    athlete: {
        id: number;
    };
    name: string;
    distance: number;  // meters
    start_date: string;
    type: string;      // e.g., "Run", "Ride"
    // ... other fields
}

/**
 * Generate a proof of distance from a Strava activity
 * @param activity Strava activity object
 * @param signerPrivateKey Ethereum private key for signing
 * @returns Object with proof details
 */
export async function generateDistanceProof(activity: StravaActivity, signerPrivateKey: string) {
    // Extract the needed info
    const { id, distance, start_date, type, athlete } = activity;
    const athleteId = athlete.id;

    // Convert distance from meters to kilometers (rounded to 2 decimal places)
    const distanceKm = Math.round(distance / 10) / 100;

    // Create an activity hash to uniquely identify this activity
    const activityData = `${id}-${athleteId}-${distanceKm}-${start_date}-${type}`;
    const activityHash = crypto.createHash('sha256').update(activityData).digest('hex');

    // Create a wallet from the private key
    const wallet = new ethers.Wallet(signerPrivateKey);

    // Format data for signing
    // Include the relevant fields that need to be verified on-chain
    const dataToSign = ethers.solidityPackedKeccak256(
        ['uint256', 'uint256', 'string', 'string'],
        [athleteId, Math.floor(distanceKm * 100), start_date, activityHash]
    );

    // Sign the data
    const signature = await wallet.signMessage(ethers.getBytes(dataToSign));

    // Return the proof object
    return {
        athleteId,
        activityId: id,
        distanceKm,
        activityDate: start_date,
        activityType: type,
        activityHash,
        dataToSign: dataToSign.toString(),
        signature,
        signerAddress: wallet.address
    };
}

/**
 * Format proof data for a smart contract call
 * @param proof The proof object from generateDistanceProof
 * @returns Object formatted for smart contract call
 */
export function formatProofForContract(proof: any) {
    // This depends on your smart contract's expected format
    return {
        athlete_id: proof.athleteId,
        activity_id: proof.activityId,
        distance_km: proof.distanceKm,
        activity_date: proof.activityDate,
        activity_hash: proof.activityHash,
        signature: proof.signature
    };
} 