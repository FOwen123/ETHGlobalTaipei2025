import axios from "axios";
import { Request, Response } from "express";
import { saveToken } from "./memoryStore";
import dotenv from "dotenv";

dotenv.config();

export function initiateAuth(req: Request, res: Response) {
    console.log("Starting Strava OAuth flow...");
    const scope = "activity:read_all";
    const redirectUri = encodeURIComponent(`http://localhost:3000/exchange_token`);
    const authUrl = `https://www.strava.com/oauth/authorize?client_id=${process.env.STRAVA_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
    console.log("Redirecting to Strava auth URL:", authUrl);
    res.redirect(authUrl);
}

export async function exchangeToken(req: Request, res: Response) {
    console.log("Received exchange token request with code:", req.query.code);
    const code = req.query.code;

    // Make sure we have the required env variables
    console.log("Client ID:", process.env.STRAVA_CLIENT_ID);
    console.log("Client Secret available:", !!process.env.STRAVA_CLIENT_SECRET);
    

    try {
        // Try using URLSearchParams format instead of JSON
        const params = new URLSearchParams();
        params.append('client_id', process.env.STRAVA_CLIENT_ID!);
        params.append('client_secret', process.env.STRAVA_CLIENT_SECRET!);
        params.append('code', code as string);
        params.append('grant_type', 'authorization_code');

        console.log("Sending token exchange request with params:", params.toString());

        const resp = await axios.post(
            "https://www.strava.com/oauth/token",
            params,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        const data = resp.data;
        console.log("Successfully exchanged code for token. Athlete ID:", data.athlete.id);

        saveToken(data.athlete.id, {
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            expires_at: data.expires_at,
        });
        console.log("Token response:", data);

        console.log("Token saved successfully");
        res.send("Token saved! You can close this window.");
    } catch (error: any) {
        console.error("Error exchanging token:", error.response?.data || error.message);
        res.status(500).send("Error getting token from Strava");
    }
}
