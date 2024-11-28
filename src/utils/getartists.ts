import axios from 'axios';

const SPOTIFY_API_URL = 'https://api.spotify.com/v1/me/top/artists';

export async function getTopArtists(bearerToken: string, limit: number = 10, timeRange: string = 'short_term') {
    try {
        const response = await axios.get(SPOTIFY_API_URL, {
            headers: {
                'Authorization': `Bearer ${bearerToken}`
            },
            params: {
                limit, // Number of items to return (default is 20, max is 50)
                time_range: timeRange // Valid values: 'short_term', 'medium_term', 'long_term'
            }
        });
        return response.data.items; // Array of artist objects
    } catch (error) {
        console.error('Error fetching top artists:', error);
        throw error;
    }
}
