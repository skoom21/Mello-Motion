import { getDb, initDb } from "@/lib/surreal";
import { RecordId } from "surrealdb";


export async function getUserPreferencesFromDB(userId: string) {
    type UserPreferences = {
        mood: string;
        energy: string;
        goal: string;
        moodAlignment: string;
        genres: string[];
        location: string;
        musicEnergy: string;
    };

    let db = getDb();
    if (!db) {
        db = await initDb();
    }

    const formattedUserId = `user:${userId}`; // Consider using a consistent format

    try {
        const userPreferencesId = `profile:${userId}`;
        if (!db) {
            throw new Error("Database is not initialized.");
        }
        const userProfile = await db.select(new RecordId('emotional_profile', userPreferencesId)) as unknown as UserPreferences;

        if (userProfile) {
            console.log("User preferences fetched successfully:", userProfile);
            return userProfile;
        } else {
            console.log(`No preferences found for user: ${userId}`);
            return null; // Or return default preferences if needed
        }
    } catch (err) {
        console.error("Failed to fetch user preferences from SurrealDB:", err);
        throw new Error("Error fetching user preferences from SurrealDB.");
    }
}

export async function getUserMoodFromDB(userId: string) {

    type UserProfile = {
        preferences: {
            mood: string;
        };
    };
    let db = getDb();
    if (!db) {
        db = await initDb();
    }; // Consider using a consistent format

    try {
        const userMoodId = `profile:${userId}`;
        if (!db) {
            throw new Error("Database is not initialized.");
        }
        const userProfile = await db.select(new RecordId('emotional_profile', userMoodId)) as unknown as UserProfile;

        if (userProfile) {
            console.log("User mood fetched successfully:", userProfile.preferences.mood);
            return userProfile.preferences.mood
        } else {
            console.log(`No mood data found for user: ${userId}`);
            return null; // Or return a default mood if needed
        }
    } catch (err) {
        console.error("Failed to fetch user mood from SurrealDB:", err);
        throw new Error("Error fetching user mood from SurrealDB.");
    }
}
