import axios from 'axios';

export async function getRecentlyPlayedTracks(accessToken :any) {
    try {
        const response = await axios.get('https://api.spotify.com/v1/me/player/recently-played', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data; // This will include the recently played tracks
    } catch (error) {
        console.error("Error fetching recently played tracks:", error);
        throw error;
    }
}
