import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Use your athlete ID from Strava
const ATHLETE_ID = 163516953;  // Replace with your actual Strava athlete ID if different
// Use a random activity ID - in real webhook this would be a real activity ID
const ACTIVITY_ID = '123456789';

async function simulateWebhook() {
    try {
        console.log('Simulating webhook notification from Strava...');

        // This simulates the payload Strava would send when a new activity is created
        const webhookPayload = {
            aspect_type: 'create',
            event_time: Math.floor(Date.now() / 1000),
            object_id: ACTIVITY_ID,
            object_type: 'activity',
            owner_id: ATHLETE_ID,
            subscription_id: 278244, // Your actual subscription ID from Strava
            updates: {}
        };

        // Send POST request to your local webhook endpoint
        const response = await axios.post('http://localhost:3000/strava-webhook', webhookPayload);

        console.log('Webhook simulation response:', response.status, response.data);
        console.log('Webhook simulation successful!');
        console.log('Check your server logs to see the webhook processing');
    } catch (error) {
        console.log('Error simulating webhook:', error);
        if (axios.isAxiosError(error) && error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
}

// Run the simulation
simulateWebhook(); 