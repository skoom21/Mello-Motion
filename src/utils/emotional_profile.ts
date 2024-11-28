import { getDb, initDb } from "@/lib/surreal";
import { RecordId } from "surrealdb";

export async function createOrUpdateEmotionalProfile(id: string, emotionalData: any) {
    type EmotionalProfile = {
        id: string;
        mentalWellness: {
            dailyEntries: {
                date: string;
                moodScore: number;
                mood: string;
                energy: string;
                notes: string;
            }[];
            weeklyScore: number;
        };
        preferences: {
            mood: string;
            energy: string;
            goal: string;
            moodAlignment: string;
            genres: string[];
            location: string;
            musicEnergy: string;
        };
        timestamp: Date;
        user: RecordId<'user'>;
    };

    let db = getDb();
    if (!db) {
        db = await initDb();
    }

    try {
        const emotionalProfileId = `profile:${id}`;
        const userId = `user:${id}`;

        if (!db) {
            throw new Error("Database connection is not initialized.");
        }

        // Fetch existing profile
        const existingProfile = await db.select(new RecordId('emotional_profile', emotionalProfileId)) as unknown as EmotionalProfile;

        // Prepare new daily entry
        const newDailyEntry = emotionalData.mentalWellness.dailyEntries[0];

        if (existingProfile) {
            console.log("Existing emotional profile found for user:", existingProfile);

            // Append new entry to existing daily entries
            const updatedDailyEntries = [
                ...existingProfile.mentalWellness.dailyEntries,
                newDailyEntry,
            ];

            // Optional: Calculate or update the weekly score (simple average of last 7 entries)
            const recentEntries = updatedDailyEntries.slice(-7);
            const weeklyScore = recentEntries.reduce((acc, entry) => acc + entry.moodScore, 0) / recentEntries.length;

            // Update profile with new entry and preferences
            const updatedProfile = await db.update(new RecordId('emotional_profile', emotionalProfileId), {
                id: emotionalProfileId,
                user: new RecordId('user', userId),
                timestamp: new Date(),
                preferences: emotionalData.preferences,
                mentalWellness: {
                    weeklyScore,
                    dailyEntries: updatedDailyEntries,
                },
            });

            console.log("Emotional profile updated successfully:", updatedProfile);
            return "updatedProfile";
        }

        // If no profile exists, create a new one with initial data
        const newProfile = await db.create('emotional_profile', {
            id: emotionalProfileId,
            user: new RecordId('user', userId),
            timestamp: new Date(),
            preferences: emotionalData.preferences,
            mentalWellness: {
                weeklyScore: newDailyEntry.moodScore, // Initial weekly score
                dailyEntries: [newDailyEntry],
            },
        });

        console.log("Emotional profile created successfully:", newProfile);
        return "newProfile";
    } catch (err) {
        console.error("Failed to create or update emotional profile in SurrealDB:", err);
        if (err instanceof Error) {
            throw new Error(`Failed to create or update emotional profile in SurrealDB: ${err.message}`);
        } else {
            throw new Error("Failed to create or update emotional profile in SurrealDB: Unknown error");
        }
    }
}
