import { getDb, initDb } from "@/lib/surreal";
import { RecordId } from "surrealdb";

interface InputTrack {
  id: string;
  name: string;
  artist?: string;
}

interface InputPlaylist {
  id: string;
  name: string;
  image?: string[];
  tracks: InputTrack[];
}

interface Track {
  track_id: string;
  track_name: string;
  artist: string; 
}

interface Playlist {
  id: string;
  user_id: RecordId<'user'>;
  playlist_name: string;
  images: string[];
  tracks: Track[];
  created_at: Date;
}

export async function savePlaylists(userId: string, playlists: InputPlaylist[]) {
  console.log("Initializing database connection...");
  let db = getDb();
  if (!db) {
    console.log("Database not initialized. Initializing now...");
    db = await initDb();
  }

  const userRecordId = `user:${userId}`;
  const savedPlaylists = [];

  try {
    if (!db) {
      throw new Error("Database connection is not initialized.");
    }

    for (const playlist of playlists) {
      const uniquePlaylistId = `playlist:${playlist.id}`;
      const playlistData: Playlist = {
        id: uniquePlaylistId,
        user_id: new RecordId("user", userRecordId),
        playlist_name: playlist.name,
        images: playlist.image || [],
        tracks: playlist.tracks.map((track: any) => ({
          track_id: track.id,
          track_name: track.name,
          artist: track.artist || "Unknown Artist",
        })),
        created_at: new Date(),
      };

      console.log("Processing playlist:", playlistData);

      // Check if the playlist already exists
      const existingPlaylist = await db.select(new RecordId('playlist', uniquePlaylistId));
      if (existingPlaylist) {
        console.log("Updating existing playlist:", uniquePlaylistId);
        await db.update(uniquePlaylistId, {
          ...playlistData,
          timestamp: new Date().toISOString(),
        });
      } else {
        console.log("Creating new playlist entry...");
        const savedPlaylist = await db.create('playlist', { ...playlistData });
        savedPlaylists.push(savedPlaylist);
        console.log("New playlist created:", savedPlaylist);
      }
    }
    
    console.log("Playlists successfully saved in SurrealDB:", savedPlaylists);
    return savedPlaylists;
  } catch (err) {
    console.error("Failed to save playlists in SurrealDB:", err);
    if (err instanceof Error) {
      throw new Error(`Failed to save playlists in SurrealDB: ${err.message}`);
    } else {
      throw new Error("Failed to save playlists in SurrealDB: Unknown error");
    }
  }
}
