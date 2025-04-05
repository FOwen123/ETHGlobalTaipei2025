import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Hardcoded values - use these instead of environment variables
const CALLBACK_URL = 'https://9f8c-111-235-226-130.ngrok-free.app/strava-webhook';
const VERIFY_TOKEN = 'super_secret';

async function registerWebhook() {
    try {
        console.log("Registering webhook with:");
        console.log(`- Client ID: ${process.env.STRAVA_CLIENT_ID}`);
        console.log(`- Callback URL: ${CALLBACK_URL}`);
        console.log(`- Verify Token: ${VERIFY_TOKEN}`);

        const params = new URLSearchParams();
        params.append('client_id', process.env.STRAVA_CLIENT_ID!);
        params.append('client_secret', process.env.STRAVA_CLIENT_SECRET!);
        params.append('callback_url', CALLBACK_URL);
        params.append('verify_token', VERIFY_TOKEN);

        // Add this parameter
        params.append('subscription_type', 'activities');

        console.log("Request params:", params.toString());

        const response = await axios.post(
            'https://www.strava.com/api/v3/push_subscriptions',
            params,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        console.log('Webhook registered successfully:', response.data);
    } catch (error: any) {
        console.error('Error registering webhook:', error.response?.data || error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
        }
    }
}

// Function to view existing webhooks
async function viewWebhooks() {
    try {
        const response = await axios.get(
            `https://www.strava.com/api/v3/push_subscriptions?client_id=${process.env.STRAVA_CLIENT_ID}&client_secret=${process.env.STRAVA_CLIENT_SECRET}`
        );

        console.log('Existing webhooks:', response.data);
    } catch (error: any) {
        console.error('Error viewing webhooks:', error.response?.data || error.message);
    }
}

// First check for existing webhooks
viewWebhooks();

// Register the webhook
registerWebhook(); 