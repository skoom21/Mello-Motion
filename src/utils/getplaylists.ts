import axios from 'axios';

const SPOTIFY_API_URL = 'https://api.spotify.com/v1/me/playlists';

export async function getPlaylists(bearerToken: string) {
    try {
        const response = await axios.get(SPOTIFY_API_URL, {
            headers: {
                'Authorization': `Bearer ${bearerToken}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching playlists:', error);
        throw error;
    }
}