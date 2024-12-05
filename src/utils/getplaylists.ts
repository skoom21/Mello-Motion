import axios from 'axios';
import { getRecentlyPlayedTracks } from './getrecent';
import generateRecommendations  from './getrecommendations';
import { getUserPreferencesFromDB } from './surrealUtils'; // Assuming this utility exists
import { getUserMoodFromDB } from './surrealUtils'; // Assuming this utility exists
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';

const SPOTIFY_API_URL = 'https://api.spotify.com/v1/me/top/artists'; // URL to fetch top artists

// Function to get user recommendations and generate playlists
export async function getPlaylists(session: any) {
    const bearerToken = session.accessToken;
    const userid = session.id;
    // Step 1: Fetch Recently Played Tracks
    const fetchRecentlyPlayedTracksData = async () => {
        try {
            if (bearerToken) {
                const response = await getRecentlyPlayedTracks(bearerToken);
                console.log("Recently played tracks:", response);
                const tracks = response.items.map((track: { track: { name: string } }) => track.track.name); // Extract track IDs\
                const artists = response.items.map((track: { track: { artists: { name: string }[] } }) => track.track.artists[0].name); // Extract artist IDss
                return { tracks, artists };
            }
        } catch (error) {
            console.error("Error fetching recently played tracks:", error);
            throw error;
        }
    };

    // // Step 2: Fetch Top Artists of the Month
    // const fetchTopArtists = async () => {
    //     try {
    //         const response = await axios.get(SPOTIFY_API_URL, {
    //             headers: {
    //                 'Authorization': `Bearer ${bearerToken}`,
    //             },
    //             params: {
    //                 time_range: 'short_term', // Fetch artists of the past 4 weeks
    //                 limit: 10, // Limit to top 10 artists
    //             }
    //         });
    //         console.log("Top Artists:", response.data.items);
    //         return response.data.items.map((artist: { id: string }) => artist.id); // Extract artist IDs
    //     } catch (error) {
    //         console.error("Error fetching top artists:", error);
    //         throw error;
    //     }
    // };

    // Step 3: Fetch Genres from SurrealDB
    const fetchUserGenres = async () => {
        try {
            const userPreferences = await getUserPreferencesFromDB(session.id);
            console.log("User genres from questionnaire:", userPreferences.preferences.genres);
            return userPreferences.preferences.genres; // Return genres array
        } catch (error) {
            console.error("Error fetching genres from SurrealDB:", error);
            throw error;
        }
    };

    // Step 4: Fetch User's Mood from SurrealDB
    const fetchUserMood = async () => {
        try {
            const userMood = await getUserMoodFromDB(session.id);
            console.log("User mood from SurrealDB:", userMood);
            return userMood; // Return user's mood
        } catch (error) {
            console.error("Error fetching mood from SurrealDB:", error);
            throw error;
        }
    };

    const fetchRecommendations = async (seedArtists: string[], seedTracks: string[], seedGenres: string[], userMood: string) => {
        try {
            const recommendations = await generateRecommendations(seedArtists, seedTracks, seedGenres, userMood, bearerToken);
            return recommendations;
        } catch (error) {
            console.error("Error generating recommendations:", error);
            throw error;
        }
        };

    // // Step 5: Generate Recommendations based on all the data
    // const generateRecommendations = async (seedArtists: string[], seedTracks: string[], seedGenres: string[], userMood: string) => {
    //     try {
    //         const recommendations = await getRecommendations(
    //             bearerToken,
    //             {
    //                 energy: 'Medium', // You can adjust this based on mood or preferences
    //                 mood: userMood,
    //                 genres: seedGenres,
    //             },
    //             seedArtists,
    //             seedTracks,
    //             10 // Number of recommendations
    //         );
    //         console.log("Generated Recommendations:", recommendations);
    //         return recommendations; // Return the recommendations
    //     } catch (error) {
    //         console.error("Error generating recommendations:", error);
    //         throw error;
    //     }
    // };

    // Step 6: Create Playlists based on the mood
    const createPlaylists = (recommendations: any, userMood: string) => {
        console.log(recommendations);
        
        // Function to create a playlist image using the top 4 images
        const createPlaylistImage = (recommendations: any) => {
            const images = recommendations.slice(0, 4).map((rec: any) => rec.imageUrl);
            return images;
        };

        // Create playlists using generated names
        const playlists = [
            {
            id: uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals], separator: '-', length: 3 }),
            name: generatePlaylistName(userMood),
            tracks: recommendations.slice(0, 10), // First 10 tracks
            image: createPlaylistImage(recommendations.slice(0, 10))
            },
            {
            id: uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals], separator: '-', length: 3 }),
            name: generatePlaylistName(userMood),
            tracks: recommendations.slice(10, 20), // Next 10 tracks
            image: createPlaylistImage(recommendations.slice(10, 20))
            },
            {
            id: uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals], separator: '-', length: 3 }),
            name: generatePlaylistName(userMood),
            tracks: recommendations.slice(20, 30), // Next 10 tracks
            image: createPlaylistImage(recommendations.slice(20, 30))
            },
            {
            id: uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals], separator: '-', length: 3 }),
            name: generatePlaylistName(userMood),
            tracks: recommendations.slice(30, 40), // Last 10 tracks
            image: createPlaylistImage(recommendations.slice(30, 40))
            }
        ];
        console.log("Playlists:", playlists);
        return playlists;
    };
    // Step 6.1: Import name generator

    // Step 6.2: Generate creative playlist name
    const generatePlaylistName = (mood: string) => {
        const config = {
            dictionaries: [adjectives, colors, animals],
            separator: ' ',
            style: 'capital' as const,
            length: 2
        };
        
        const baseName = uniqueNamesGenerator(config);
        return `${mood} ${baseName}`;
    };


    // Step 7: Main logic to combine all data and send custom response
    try {
        // Fetch all necessary data
        const [recentTracks, genres, mood] = await Promise.all([
            fetchRecentlyPlayedTracksData(),
            fetchUserGenres(),
            fetchUserMood(),
        ]);
        
        console.log("Recent Tracks:", recentTracks.tracks);
        console.log("Top Artists:", recentTracks.artists);
        console.log("User Genres:", genres);
        console.log("User Mood:", mood);

        // Generate recommendations
        const recommendations = await fetchRecommendations(recentTracks.artists, recentTracks.tracks, genres, mood);

        // Create playlists from recommendations
        const playlists = createPlaylists(recommendations, mood);

        // Return the custom JSON response
        return {
            playlists,
            mood: mood,
            userGenres: genres,
        };

    } catch (error) {
        console.error("Error generating playlists:", error);
        throw error;
    }
}
