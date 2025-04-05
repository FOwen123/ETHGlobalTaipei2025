import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Function to delete a webhook by ID
async function deleteWebhook(id: number) {
    try {
        const response = await axios.delete(
            `https://www.strava.com/api/v3/push_subscriptions/${id}`,
            {
                params: {
                    client_id: process.env.STRAVA_CLIENT_ID,
                    client_secret: process.env.STRAVA_CLIENT_SECRET
                }
            }
        );

        console.log('Webhook deleted successfully:', response.data);
    } catch (error: any) {
        console.error('Error deleting webhook:', error.response?.data || error.message);
    }
}

// Replace with your webhook ID
const webhookId = 0; // Update this with the actual ID from viewWebhooks

// Uncomment to delete a webhook
// deleteWebhook(webhookId);

// To view existing webhooks first, run the registerWebhook.ts script 