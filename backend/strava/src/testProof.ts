import { generateDistanceProof, formatProofForContract } from './proof';
import dotenv from 'dotenv';

dotenv.config();

// Get private key from environment variables
const SIGNER_PRIVATE_KEY = process.env.SIGNER_PRIVATE_KEY;

// Validate that private key is set
if (!SIGNER_PRIVATE_KEY) {
    console.error('Error: SIGNER_PRIVATE_KEY environment variable is not set.');
    console.error('Please add it to your .env file: SIGNER_PRIVATE_KEY=your_ethereum_private_key');
    process.exit(1);
}

// Sample activity - similar to what you'd get from Strava
const sampleActivity = {
    id: '123456789',
    name: 'Morning Run',
    distance: 5000, // 5 km in meters
    start_date: '2025-04-05T12:00:00Z',
    type: 'Run',
    athlete: {
        id: 163516953 // Your Strava athlete ID
    }
};

async function testProofGeneration() {
    try {
        console.log('Generating proof for sample activity...');

        const proof = await generateDistanceProof(sampleActivity, SIGNER_PRIVATE_KEY as string);
        console.log('Generated proof:', JSON.stringify(proof, null, 2));

        const contractData = formatProofForContract(proof);
        console.log('Data for smart contract:', JSON.stringify(contractData, null, 2));

        console.log('Signer address (for verification):', proof.signerAddress);
    } catch (error) {
        console.error('Error generating proof:', error);
    }
}

// Run the test
testProofGeneration(); 