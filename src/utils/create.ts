import { getDb, initDb } from "@/lib/surreal";
import { RecordId } from "surrealdb";

// Call this function after Spotify login
export async function createUserInDb(spotifyUser:any) {

    type user = {
        id: string;
        username: string;
        email: string;
        access_token: string;
        refresh_token: string;
        signup_date: Date;
        last_login : Date;
    }
    let db = getDb();
    if (!db) {
        db = await initDb();
    }

    try {
        const userId = `user:${spotifyUser.id}`; // Consider using a consistent format
        if (!db) {
            throw new Error("Database connection is not initialized.");
        }
        //fetch user from database
        const existingUser = await db.select(new RecordId('user', userId));
        if (existingUser) {
            console.log("User already exists in SurrealDB:", existingUser);
            //update user
            const updatedUser = await db.update<user>(new RecordId('user', userId), {
                id: userId,
                username: spotifyUser.user.name || "Unknown User",
                email: spotifyUser.user.email || "",
                access_token: spotifyUser.accessToken,
                refresh_token: spotifyUser.refreshToken,
                signup_date: existingUser.signup_date as Date,
                last_login: new Date(),
            });
            console.log("User updated Successfully", updatedUser)
            return "updateduser";
        }        
        const user = await db.create('user', {
            id: userId,  // Unique user ID
            username: spotifyUser.user.name || "Unknown User",  // Fallback if display name is null
            email: spotifyUser.user.email || "",  // Fallback if email is null
            access_token: spotifyUser.accessToken,  // Spotify access token
            refresh_token: spotifyUser.refreshToken,  // Spotify refresh token
            signup_date: new Date(),
            last_login: new Date(),
        });
        console.log("User successfully created in SurrealDB:", user);
        return "newuser"
    } catch (err) {
        console.error("Failed to create user in SurrealDB:", err);
        if (err instanceof Error) {
            throw new Error(`Failed to create user in SurrealDB: ${err.message}`); // Add context to the error
        } else {
            throw new Error("Failed to create user in SurrealDB: Unknown error"); // Fallback for unknown error type
        }
    }
}
