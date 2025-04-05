import axios from 'axios';

export async function getLatestActivity(accessToken: string) {
  try {
    const response = await axios.get(
      'https://www.strava.com/api/v3/athlete/activities',
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { per_page: 1 },
      }
    );

    const [latestActivity] = response.data;
    return {
      id: latestActivity.id,
      name: latestActivity.name,
      distance: latestActivity.distance,
      type: latestActivity.type,
      start_date: latestActivity.start_date,
    };
  } catch (error: any) {
    console.error('❌ Strava API error:', error.response?.data || error.message);
    throw new Error('Failed to fetch activity');
  }
}
