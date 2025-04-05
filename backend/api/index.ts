import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';
import { getLatestActivity } from './strava';

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/strava/activity', async (req, res) => {
  const accessToken = req.query.token as string;

  if (!accessToken) {
    res.status(400).json({ error: 'Access token is required' });
  }

  try {
    const activity = await getLatestActivity(accessToken);
    res.json(activity);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
});

app.get('/api/strava/login', (req, res) => {
  const redirectUri = process.env.STRAVA_REDIRECT_URI;
  const clientId = process.env.STRAVA_CLIENT_ID;

  const authUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&approval_prompt=auto&scope=activity:read_all`;

  res.redirect(authUrl);
});

app.get('/api/strava/callback', async (req, res) => {
  const code = req.query.code;
  const clientId = process.env.STRAVA_CLIENT_ID;
  const clientSecret = process.env.STRAVA_CLIENT_SECRET;

  try {
    const response = await axios.post('https://www.strava.com/oauth/token', {
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code',
    });

    const { access_token, refresh_token, expires_at } = response.data;

    // For testing, just return tokens
    res.json({ access_token, refresh_token, expires_at });
  } catch (err: any) {
    console.error('OAuth error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to exchange code for token' });
  }
});

app.listen(PORT, () => {
  console.log(`Strava API server running at http://localhost:${PORT}`);
});
