import axios from "axios";
import { getToken, saveToken } from "./memoryStore";
import dotenv from "dotenv";

dotenv.config();

export async function refreshToken(athlete_id: number) {
    const token = getToken(athlete_id);
    if (!token) throw new Error("No token found");

    const params = new URLSearchParams();
    params.append('client_id', process.env.STRAVA_CLIENT_ID!);
    params.append('client_secret', process.env.STRAVA_CLIENT_SECRET!);
    params.append('refresh_token', token.refresh_token);
    params.append('grant_type', 'refresh_token');

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
    saveToken(athlete_id, {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: data.expires_at,
    });

    return data.access_token;
}

export async function fetchActivity(activity_id: string, access_token: string) {
    const resp = await axios.get(`https://www.strava.com/api/v3/activities/${activity_id}`, {
        headers: { Authorization: `Bearer ${access_token}` }
    });
    return resp.data;
}