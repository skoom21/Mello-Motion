import { Surreal } from "surrealdb";

let db: Surreal | undefined;

export async function initDb(): Promise<Surreal | undefined> {
    if (db) {
        console.log("Database connection already initialized.");
        return db;
    }
    db = new Surreal();
    try {
        console.log("Attempting to connect to SurrealDB...");
        // Connect to SurrealDB running on local endpoint
        await db.connect("http://127.0.0.1:8000/rpc", {
            auth: {
                username: 'root',
                password: 'root'
            }
        });
        console.log("Connected to SurrealDB.");
        
        // Use a specific namespace and database
        await db.use({ namespace: "Main", database: "Mello-Motion" });
        console.log("Using namespace 'main' and database 'Mello-Motion'.");
        
        return db;
    } catch (err) {
        console.error("Failed to connect to SurrealDB:", err);
        throw err;
    }
}

export async function closeDb(): Promise<void> {
    if (!db) return;
    await db.close();
    db = undefined;
}

export function getDb(): Surreal | undefined {
    return db;
}
