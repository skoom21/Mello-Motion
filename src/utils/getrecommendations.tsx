import axios from 'axios';

const LAST_FM_API_URL = 'https://ws.audioscrobbler.com/2.0/';
const LAST_FM_API_KEY = process.env.NEXT_APP; // Get Last.fm API key from environment variables
if (!LAST_FM_API_KEY) {
    throw new Error("Missing Last.fm API key. Please set the REACT_APP_LAST_FM_API_KEY environment variable.");
}
console.log("Last.fm API key:", LAST_FM_API_KEY);
/**
 * Generates music recommendations using the Last.fm API.
 * @param seedArtists - Array of artist names to use as seeds.
 * @param seedTracks - Array of track names to use as seeds.
 * @param seedGenres - Array of genres to use as filters (if applicable).
 * @param userMood - The user's current mood to guide recommendations.
 * @returns A list of recommended tracks.
 */
const generateRecommendations = async (
    seedArtists: string[],
    seedTracks: string[],
    seedGenres: string[],
    userMood: string,
    BearerToken: string,
) => {
    try {
        if (!Array.isArray(seedArtists) || !Array.isArray(seedTracks) || !Array.isArray(seedGenres)) {
            throw new Error("Invalid input: seedArtists, seedTracks, and seedGenres must be arrays.");
        }

        if (typeof userMood !== 'string') {
            throw new Error("Invalid input: userMood must be a string.");
        }

        const recommendations: any[] = [];

        for (let i = 0; i < seedTracks.length; i++) {
            const track = seedTracks[i];
            const artist = seedArtists[i] || seedArtists[0]; // Use a fallback artist if not enough artists are provided.

            if (!track || !artist) {
                console.warn(`Skipping invalid track or artist at index ${i}`);
                continue;
            }

            try {
                const response = await axios.get(LAST_FM_API_URL, {
                    params: {
                        method: 'track.getsimilar',
                        track: track,
                        artist: artist,
                        api_key: LAST_FM_API_KEY,
                        format: 'json',
                        limit: 4, // Adjust this number as needed.
                        autocorrect: 1, // Enable autocorrection for artist/track names.
                    },
                });

                console.log(`Similar tracks for ${track} by ${artist}:`, response.data);
                if (response.data && response.data.similartracks && response.data.similartracks.track) {
                    const similarTracks = response.data.similartracks.track;

                    // Filter recommendations by user genres (if genres are specified).
                    const filteredTracks = similarTracks.filter((track: any) =>
                        seedGenres.some((genre) => track.tags?.tag?.some((t: any) => t.name.toLowerCase() === genre.toLowerCase()))
                    );

                    // Add an id attribute for each track
                    const tracksWithId = (filteredTracks.length > 0 ? filteredTracks : similarTracks).map((track: any, index: number) => ({
                        ...track,
                        id: `${track.name}-${index}`
                    }));

                    recommendations.push(...tracksWithId);
                } else {
                    console.warn(`No similar tracks found for track: ${track} by artist: ${artist}`);
                }
            } catch (apiError) {
                console.error(`Error fetching similar tracks for track: ${track} by artist: ${artist}`, apiError);
            }
        }
        // Add Spotify image URLs to recommendations
        const SPOTIFY_API_URL = 'https://api.spotify.com/v1/search';
        for (let rec of recommendations) {
            try {
                const spotifyResponse = await axios.get(SPOTIFY_API_URL, {
                    headers: {
                        'Authorization': `Bearer ${BearerToken}`
                    },
                    params: {
                        q: `track:${rec.name} artist:${rec.artist.name}`,
                        type: 'track',
                        limit: 1
                    }
                });

                if (spotifyResponse.data.tracks.items.length > 0) {
                    rec.imageUrl = spotifyResponse.data.tracks.items[0].album.images[1].url;
                }
            } catch (error) {
                console.error(`Error fetching Spotify image for ${rec.name}:`, error);
                rec.imageUrl = null;
            }
        }

        console.log("Generated Recommendations:", recommendations);

        // You can further enhance the filtering based on userMood if necessary.
        return recommendations;
    } catch (error) {
        console.error("Error generating recommendations:", error);
        throw error;
    }
};

export default generateRecommendations;
