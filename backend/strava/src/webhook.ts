import { Request, Response } from "express";
import { getToken } from "./memoryStore";
import { fetchActivity, refreshToken } from "./strava";
import { generateDistanceProof, formatProofForContract } from "./proof";
import dotenv from "dotenv";
dotenv.config();

// Get private key from environment variables
const SIGNER_PRIVATE_KEY = process.env.SIGNER_PRIVATE_KEY;

// Log warning if private key is not set
if (!SIGNER_PRIVATE_KEY) {
    console.warn('Warning: SIGNER_PRIVATE_KEY environment variable is not set.');
    console.warn('Webhook will be able to receive activities but will not generate proofs.');
    console.warn('Add SIGNER_PRIVATE_KEY to your .env file to enable proof generation.');
}

export function verifyWebhook(req: Request, res: Response) {
    console.log("Verifying webhook with query:", req.query);
    console.log("ENV token:", process.env.STRAVA_VERIFY_TOKEN);

    // Strava requires a specific format for webhook verification
    if (req.query["hub.mode"] === "subscribe" &&
        req.query["hub.verify_token"] === process.env.STRAVA_VERIFY_TOKEN) {
        console.log("Verification successful, responding with challenge:", req.query["hub.challenge"]);
        res.json({ "hub.challenge": req.query["hub.challenge"] });
    } else {
        console.log("Verification failed");
        res.status(403).send("Verification failed");
    }
}

export async function handleWebhook(req: Request, res: Response) {
    const body = req.body;
    const { aspect_type, object_id, owner_id } = body;

    console.log("Webhook received:", body);

    if (aspect_type === "create") {
        const token = getToken(owner_id);
        console.log("Webhook received for owner_id:", owner_id);
        console.log("Token found in store:", token);

        if (!token) {
            console.log("No token found for owner_id:", owner_id);
            res.status(400).send("Token not found");
            return;
        }

        try {
            // Refresh token if needed
            let access_token = token.access_token;
            const isExpired = Date.now() / 1000 >= (token.expires_at - 300);
            console.log("Token expired?", isExpired);

            if (isExpired) {
                console.log("Attempting to refresh token...");
                access_token = await refreshToken(owner_id);
                console.log("Token refreshed successfully");
            }

            console.log("Using access token:", access_token.substring(0, 10) + "...");
            const activity = await fetchActivity(object_id, access_token);
            console.log("Fetched activity:", activity);

            // Generate proof for the activity if private key is set
            if (SIGNER_PRIVATE_KEY) {
                try {
                    const proof = await generateDistanceProof(activity, SIGNER_PRIVATE_KEY);
                    console.log("Generated proof:", proof);

                    // Here you would typically:
                    // 1. Store the proof in a database
                    // 2. Allow the user to claim rewards based on this proof
                    // 3. Potentially call a smart contract directly

                    const contractData = formatProofForContract(proof);
                    console.log("Data for smart contract:", contractData);
                } catch (proofError) {
                    console.error("Error generating proof:", proofError);
                }
            } else {
                console.log("Skipping proof generation - no private key set");
            }

            res.status(200).send("ok");
        } catch (error) {
            console.error("Error processing webhook:", error);
            res.status(500).send("Internal server error");
        }
    } else {
        res.status(200).send("ok");
    }
}
