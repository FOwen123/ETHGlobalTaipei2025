import { ethers } from "hardhat";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());

    try {
        // Deploy Betcha contract first
        console.log("Deploying Betcha contract...");
        const Betcha = await ethers.getContractFactory("Betcha");
        const betcha = await Betcha.deploy();
        await betcha.waitForDeployment();
        const betchaAddress = await betcha.getAddress();
        console.log("Betcha contract deployed to:", betchaAddress);

        // Get oracle address from environment or use deployer address as fallback
        const oracleAddress = process.env.ORACLE_ADDRESS || deployer.address;
        console.log("Using oracle address:", oracleAddress);

        // Deploy StravaVerifier contract
        console.log("Deploying StravaVerifier contract...");
        const StravaVerifier = await ethers.getContractFactory("StravaVerifier");
        const stravaVerifier = await StravaVerifier.deploy(betchaAddress, oracleAddress);
        await stravaVerifier.waitForDeployment();
        const stravaVerifierAddress = await stravaVerifier.getAddress();
        console.log("StravaVerifier contract deployed to:", stravaVerifierAddress);

        // Set StravaVerifier in Betcha contract
        console.log("Setting StravaVerifier address in Betcha contract...");
        const tx = await betcha.setStravaVerifier(stravaVerifierAddress);
        await tx.wait();
        console.log("StravaVerifier address set in Betcha contract");

        // Log all deployed contract addresses for easy reference
        console.log("\n----- Deployment Summary -----");
        console.log("Betcha Contract:        ", betchaAddress);
        console.log("StravaVerifier Contract:", stravaVerifierAddress);
        console.log("Oracle Address:         ", oracleAddress);
        console.log("-----------------------------\n");

        console.log("Add these addresses to your .env file:");
        console.log(`BETCHA_CONTRACT_ADDRESS=${betchaAddress}`);
        console.log(`STRAVA_VERIFIER_ADDRESS=${stravaVerifierAddress}`);
        console.log(`ORACLE_ADDRESS=${oracleAddress}`);

    } catch (error) {
        console.error("Deployment failed:", error);
        process.exit(1);
    }
}

// Execute the deployment
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 