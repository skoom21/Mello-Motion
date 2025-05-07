import { getDb, initDb } from "@/lib/surreal";
import { RecordId } from "surrealdb";

interface Song {
    song_id: string;
    song_name: string;
    artist_name: string;
}
  
type MusicRecommendation = {
    id: string;
    user_id: RecordId<'user'>;
    emotion_id: RecordId<'emotional_profile'>;
    timestamp: Date;
    songs: Song[];
};

export async function saveRecommendations(id: string, recommendations: any[]) {
    console.log(recommendations);
    console.log("Initializing database connection...");
    let db = getDb();
    if (!db) {
        console.log("Database not initialized. Initializing now...");
        db = await initDb();
    }

    const emotionalProfileId = `profile:${id}`;
    const userId = `user:${id}`;
    const recID = `recommendation:${id}`;
    try {
        if (!db) {
            throw new Error("Database connection is not initialized.");
        }

        console.log("Fetching existing recommendations...");
        const existingRecommendations = (await db.select(new RecordId('music_recommendation', recID)) as unknown as MusicRecommendation[]) || [];
        console.log("Existing recommendations fetched:", existingRecommendations);

        const savedRecommendations = [];

            const uniqueRecId = recID;
            const musicRecommendation = {
                id: uniqueRecId,
                user_id: new RecordId("user", userId),
                emotion_id: new RecordId("emotional_profile", emotionalProfileId),
                songs: recommendations.length > 0 ? recommendations.map(rec => ({
                    song_id: rec.songId,
                    song_name: rec.songName,
                    artist_name: rec.artistName
                })) : [],
                timestamp: new Date()
            };

            console.log("Processing recommendation:", musicRecommendation);

            // if (existingRecommendations.length > 0) {
            //     console.log("Appending to existing recommendations...");
            //         // Merge new songs with existing ones
            //             const newSongs = musicRecommendation.songs.filter(newSong => 
            //                 existingRecommendations.some(rec => rec.songs.some(existingSong => existingSong.song_id === newSong.song_id))
            //             );
            //             existingRecommendations.songs.push(...newSongs);
            //         await db.update(`music_recommendation:${id}`, {
            //             songs: existingRecommendations.flatMap(rec => rec.songs),
            //             timestamp: new Date().toISOString(),
            //         });
            
            //         console.log("Recommendation appended.");
  
            // } else {
                console.log("Creating new recommendation entry...");
                const savedRecommendation = await db.create('music_recommendation', musicRecommendation);
                savedRecommendations.push(savedRecommendation);
                console.log("New recommendation created:", savedRecommendation);
            // }

            console.log("Recommendations successfully saved in SurrealDB:", savedRecommendations);
            return savedRecommendations;
        } catch (err) {
        console.error("Failed to save recommendations in SurrealDB:", err);
        if (err instanceof Error) {
            throw new Error(`Failed to save recommendations in SurrealDB: ${err.message}`);
        } else {
            throw new Error("Failed to save recommendations in SurrealDB: Unknown error");
        }
    }
}