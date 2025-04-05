import express from "express";
import bodyParser from "body-parser";
import { exchangeToken, initiateAuth } from "./auth";
import { handleWebhook, verifyWebhook } from "./webhook";
import dotenv from "dotenv";

dotenv.config();

// Hardcode verification token for testing
if (!process.env.STRAVA_VERIFY_TOKEN) {
    process.env.STRAVA_VERIFY_TOKEN = "super_secret";
    console.log("Using hardcoded verification token");
}

const app = express();
app.use(bodyParser.json());

// Debug endpoint to check configuration
app.get("/check-config", (req, res) => {
    res.json({
        client_id_set: !!process.env.STRAVA_CLIENT_ID,
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret_set: !!process.env.STRAVA_CLIENT_SECRET,
        client_secret_prefix: process.env.STRAVA_CLIENT_SECRET ? process.env.STRAVA_CLIENT_SECRET.substring(0, 5) + "..." : null,
        verify_token_set: !!process.env.STRAVA_VERIFY_TOKEN
    });
});

app.get("/auth", initiateAuth);
app.get("/exchange_token", exchangeToken);
app.get("/strava-webhook", verifyWebhook);
app.post("/strava-webhook", handleWebhook);

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
