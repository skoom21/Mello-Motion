import { getDb, initDb } from "@/lib/surreal";
import { RecordId } from "surrealdb";

type MusicRecommendation = {
    id: string;
    user_id: string;
    emotion_id: string;
    song_id: string;
    song_name: string;
    artist_name: string;
    timestamp: Date;
};

export async function saveRecommendations(id: any, recommendations: any[]) {
    console.log("Initializing database connection...");
    let db = getDb();
    if (!db) {
        console.log("Database not initialized. Initializing now...");
        db = await initDb();
    }

    const emotionalProfileId = `profile:${id}`;
    const userId = `user:${id}`;
    const recId = `music_recommendation:${id}`;
    try {
        if (!db) {
            throw new Error("Database connection is not initialized.");
        }

        console.log("Fetching existing recommendations...");
        const existingRecommendations = (await db.select('music_recommendation')) as unknown as MusicRecommendation[];
        console.log("Existing recommendations fetched:", existingRecommendations);

        const savedRecommendations = [];

        for (const rec of recommendations) {
            const uniqueRecId = `music_recommendation:${id}-${rec.songId}-${new Date().getTime()}`;
            const musicRecommendation: MusicRecommendation = {
                id: uniqueRecId,
                user_id: userId,
                emotion_id: emotionalProfileId,
                song_id: rec.songId,
                song_name: rec.songName,
                artist_name: rec.artistName,
                timestamp: new Date(),
            };

            console.log("Processing recommendation:", musicRecommendation);

            if (existingRecommendations && existingRecommendations.length > 0) {
                console.log("Appending to existing recommendations...");
                await db.update(new RecordId('music_recommendation', uniqueRecId), {
                    recommendations: [...existingRecommendations, musicRecommendation]
                });
                console.log("Recommendation appended.");
            } else {
                console.log("Creating new recommendation entry...");
                const savedRecommendation = await db.create('music_recommendation', musicRecommendation);
                savedRecommendations.push(savedRecommendation);
                console.log("New recommendation created:", savedRecommendation);
            }
        }

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