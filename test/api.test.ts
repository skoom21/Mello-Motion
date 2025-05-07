import axios from 'axios';
import getUserProfile from '../src/utils/getuserprofile';
import { getTopArtists } from '../src/utils/getartists';
import { getPlaylists } from '../src/utils/getplaylists';
import { getRecentlyPlayedTracks } from '../src/utils/getrecent';
import generateRecommendations from '../src/utils/getrecommendations';
import { getUserPreferencesFromDB, getUserMoodFromDB } from '../src/utils/surrealUtils';
import { savePlaylists } from '../src/utils/saveplayslist';
import { saveRecommendations } from '../src/utils/saveRecommendations';
import { getDb, initDb } from '@/lib/surreal'; // Import from the actual path
import { createOrUpdateEmotionalProfile } from '../src/utils/emotional_profile';
import { createUserInDb } from '../src/utils/create';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock other dependencies
jest.mock('../src/utils/getrecent');
jest.mock('../src/utils/getrecommendations');
jest.mock('../src/utils/surrealUtils');
jest.mock('@/lib/surreal'); // Mock the surreal DB library

describe('API Utility Functions', () => {
  describe('getPlaylists', () => {
    const mockSession = {
      accessToken: 'mock-access-token',
      id: 'mock-user-id',
    };

    beforeEach(() => {
      // Reset mocks before each test
      (getRecentlyPlayedTracks as jest.Mock).mockReset();
      (generateRecommendations as jest.Mock).mockReset();
      (getUserPreferencesFromDB as jest.Mock).mockReset();
      (getUserMoodFromDB as jest.Mock).mockReset();
    });

    it('should fetch and process data to create playlists', async () => {
      // Mock responses from dependencies
      (getRecentlyPlayedTracks as jest.Mock).mockResolvedValue({
        items: [
          { track: { name: 'Track 1', artists: [{ name: 'Artist 1' }] } },
          { track: { name: 'Track 2', artists: [{ name: 'Artist 2' }] } },
        ],
      });
      (getUserPreferencesFromDB as jest.Mock).mockResolvedValue({
        preferences: { genres: ['pop', 'rock'] },
      });
      (getUserMoodFromDB as jest.Mock).mockResolvedValue('Happy');
      (generateRecommendations as jest.Mock).mockResolvedValue([
        { imageUrl: 'img1.jpg', name: 'Rec Track 1' },
        { imageUrl: 'img2.jpg', name: 'Rec Track 2' },
        // Add more mock recommendations as needed for 4 playlists
        ...Array(38).fill({ imageUrl: 'img.jpg', name: 'Mock Rec' }),
      ]);

      const result = await getPlaylists(mockSession);

      expect(getRecentlyPlayedTracks).toHaveBeenCalledWith(mockSession.accessToken);
      expect(getUserPreferencesFromDB).toHaveBeenCalledWith(mockSession.id);
      expect(getUserMoodFromDB).toHaveBeenCalledWith(mockSession.id);
      expect(generateRecommendations).toHaveBeenCalledWith(
        ['Artist 1', 'Artist 2'], // seedArtists
        ['Track 1', 'Track 2'], // seedTracks
        ['pop', 'rock'], // seedGenres
        'Happy', // userMood
        mockSession.accessToken
      );

      expect(result.playlists).toHaveLength(4);
      expect(result.playlists[0].name).toContain('Happy');
      expect(result.playlists[0].tracks).toHaveLength(10);
      expect(result.playlists[0].image).toHaveLength(4);
      expect(result.mood).toBe('Happy');
      expect(result.userGenres).toEqual(['pop', 'rock']);
    });

    it('should throw an error if fetching recently played tracks fails', async () => {
      (getRecentlyPlayedTracks as jest.Mock).mockRejectedValue(new Error('Failed to fetch recent tracks'));

      await expect(getPlaylists(mockSession)).rejects.toThrow('Failed to fetch recent tracks');
    });

    it('should throw an error if fetching user preferences fails', async () => {
      (getRecentlyPlayedTracks as jest.Mock).mockResolvedValue({ items: [] }); // Assume this succeeds
      (getUserPreferencesFromDB as jest.Mock).mockRejectedValue(new Error('Failed to fetch preferences'));

      await expect(getPlaylists(mockSession)).rejects.toThrow('Failed to fetch preferences');
    });

    it('should throw an error if fetching user mood fails', async () => {
      (getRecentlyPlayedTracks as jest.Mock).mockResolvedValue({ items: [] });
      (getUserPreferencesFromDB as jest.Mock).mockResolvedValue({ preferences: { genres: [] } });
      (getUserMoodFromDB as jest.Mock).mockRejectedValue(new Error('Failed to fetch mood'));

      await expect(getPlaylists(mockSession)).rejects.toThrow('Failed to fetch mood');
    });

    it('should throw an error if generating recommendations fails', async () => {
      (getRecentlyPlayedTracks as jest.Mock).mockResolvedValue({ items: [] });
      (getUserPreferencesFromDB as jest.Mock).mockResolvedValue({ preferences: { genres: [] } });
      (getUserMoodFromDB as jest.Mock).mockResolvedValue('Neutral');
      (generateRecommendations as jest.Mock).mockRejectedValue(new Error('Failed to generate recommendations'));

      await expect(getPlaylists(mockSession)).rejects.toThrow('Failed to generate recommendations');
    });
  });

  describe('savePlaylists', () => {
    const mockUserId = 'test-user';
    const mockPlaylists = [
      {
        id: 'playlist1',
        name: 'My Awesome Playlist',
        image: ['img1.jpg'],
        tracks: [
          { id: 'track1', name: 'Song A', artist: 'Artist X' },
          { id: 'track2', name: 'Song B', artist: 'Artist Y' },
        ],
      },
      {
        id: 'playlist2',
        name: 'Chill Vibes',
        // No image
        tracks: [
          { id: 'track3', name: 'Song C', artist: 'Artist Z' },
        ],
      },
    ];

    const mockDb = {
      select: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };

    beforeEach(() => {
      mockDb.select.mockReset();
      mockDb.create.mockReset();
      mockDb.update.mockReset();
      (getDb as jest.Mock).mockReturnValue(mockDb);
      (initDb as jest.Mock).mockResolvedValue(mockDb as any);
    });

    it('should create new playlists if they do not exist', async () => {
      mockDb.select.mockResolvedValue(null); // Simulate playlist not existing
      mockDb.create.mockImplementation((table, data) => Promise.resolve([data])); // Simulate successful creation

      const result = await savePlaylists(mockUserId, mockPlaylists);

      expect(initDb).toHaveBeenCalledTimes(0); // Should use existing DB connection if getDb returns one
      expect(getDb).toHaveBeenCalledTimes(1);
      expect(mockDb.select).toHaveBeenCalledTimes(mockPlaylists.length);
      expect(mockDb.create).toHaveBeenCalledTimes(mockPlaylists.length);
      expect(mockDb.update).not.toHaveBeenCalled();

      expect(mockDb.create).toHaveBeenNthCalledWith(1, 'playlist', expect.objectContaining({
        id: `playlist:${mockPlaylists[0].id}`,
        user_id: expect.any(Object), // Accept any RecordId object
        playlist_name: mockPlaylists[0].name,
        images: mockPlaylists[0].image,
        tracks: expect.arrayContaining([
          expect.objectContaining({ track_id: 'track1', track_name: 'Song A', artist: 'Artist X' }),
        ]),
        created_at: expect.any(Date),
      }));
      expect(mockDb.create).toHaveBeenNthCalledWith(2, 'playlist', expect.objectContaining({
        id: `playlist:${mockPlaylists[1].id}`,
        playlist_name: mockPlaylists[1].name,
        images: [], // Expect empty array if no image provided
      }));
      expect(result).toHaveLength(mockPlaylists.length);
    });

    it('should update existing playlists', async () => {
      mockDb.select.mockResolvedValue({ id: 'existing-playlist' }); // Simulate playlist existing
      mockDb.update.mockImplementation((id, data) => Promise.resolve([data])); // Simulate successful update

      await savePlaylists(mockUserId, mockPlaylists);

      expect(mockDb.select).toHaveBeenCalledTimes(mockPlaylists.length);
      expect(mockDb.update).toHaveBeenCalledTimes(mockPlaylists.length);
      expect(mockDb.create).not.toHaveBeenCalled();

      expect(mockDb.update).toHaveBeenNthCalledWith(1, `playlist:${mockPlaylists[0].id}`, expect.objectContaining({
        playlist_name: mockPlaylists[0].name,
        timestamp: expect.any(String),
      }));
    });

    it('should initialize DB if getDb returns null', async () => {
      (getDb as jest.Mock).mockReturnValue(null); // Simulate no existing DB connection
      mockDb.select.mockResolvedValue(null);
      mockDb.create.mockImplementation((table, data) => Promise.resolve([data]));

      await savePlaylists(mockUserId, mockPlaylists);

      expect(initDb).toHaveBeenCalledTimes(1);
      expect(mockDb.create).toHaveBeenCalledTimes(mockPlaylists.length);
    });

    it('should throw an error if database connection is not initialized and initDb fails', async () => {
      (getDb as jest.Mock).mockReturnValue(null);
      (initDb as jest.Mock).mockResolvedValue(null as any); // Simulate initDb failing to return a db object

      await expect(savePlaylists(mockUserId, mockPlaylists)).rejects.toThrow("Database connection is not initialized.");
    });

    it('should throw an error if db.create fails', async () => {
      mockDb.select.mockResolvedValue(null);
      mockDb.create.mockRejectedValue(new Error('DB create error'));

      await expect(savePlaylists(mockUserId, mockPlaylists)).rejects.toThrow('Failed to save playlists in SurrealDB: DB create error');
    });

    it('should throw an error if db.update fails', async () => {
      mockDb.select.mockResolvedValue({ id: 'existing-playlist' });
      mockDb.update.mockRejectedValue(new Error('DB update error'));

      await expect(savePlaylists(mockUserId, mockPlaylists)).rejects.toThrow('Failed to save playlists in SurrealDB: DB update error');
    });

     it('should use "Unknown Artist" if artist is not provided for a track', async () => {
      const playlistsWithMissingArtist = [
        {
          id: 'playlist3',
          name: 'Test Playlist No Artist',
          tracks: [{ id: 'track4', name: 'Song D' }], // Artist missing
        },
      ];
      mockDb.select.mockResolvedValue(null);
      mockDb.create.mockImplementation((table, data) => Promise.resolve([data]));

      await savePlaylists(mockUserId, playlistsWithMissingArtist);

      expect(mockDb.create).toHaveBeenCalledWith('playlist', expect.objectContaining({
        tracks: expect.arrayContaining([
          expect.objectContaining({ track_name: 'Song D', artist: 'Unknown Artist' }),
        ]),
      }));
    });
  });

  describe('saveRecommendations', () => {
    const mockUserId = 'test-user';
    const mockRecommendations = [
      { songId: 'song1', songName: 'Song One', artistName: 'Artist Alpha' },
      { songId: 'song2', songName: 'Song Two', artistName: 'Artist Beta' },
    ];

    const mockDb = {
      select: jest.fn(),
      create: jest.fn(),
      update: jest.fn(), // Added update for completeness, though not used in current saveRecommendations logic
    };

    beforeEach(() => {
      mockDb.select.mockReset();
      mockDb.create.mockReset();
      mockDb.update.mockReset();
      (getDb as jest.Mock).mockReturnValue(mockDb);
      (initDb as jest.Mock).mockResolvedValue(mockDb as any);
    });

    it('should throw an error if database connection is not initialized and initDb fails', async () => {
      (getDb as jest.Mock).mockReturnValue(null);
      (initDb as jest.Mock).mockResolvedValue(null as any);

      await expect(saveRecommendations(mockUserId, mockRecommendations)).rejects.toThrow("Database connection is not initialized.");
    });

    it('should throw an error if db.create fails', async () => {
      mockDb.select.mockResolvedValue([]);
      mockDb.create.mockRejectedValue(new Error('DB create error'));

      await expect(saveRecommendations(mockUserId, mockRecommendations)).rejects.toThrow('Failed to save recommendations in SurrealDB: DB create error');
    });
  });

  describe('surrealUtils', () => {
    const mockUserId = 'test-user';
    const mockDb = {
      select: jest.fn(),
    };

    beforeEach(() => {
      mockDb.select.mockReset();
      (getDb as jest.Mock).mockReturnValue(mockDb);
      (initDb as jest.Mock).mockResolvedValue(mockDb as any);
    });

    describe('getUserPreferencesFromDB', () => {
    });

    describe('getUserMoodFromDB', () => {
    });
  });

  describe('createOrUpdateEmotionalProfile', () => {
    const mockUserId = 'test-user';
    const mockEmotionalData = {
      preferences: {
        mood: 'Happy',
        energy: 'High',
        goal: 'Focus',
        moodAlignment: 'Match',
        genres: ['electronic', 'pop'],
        location: 'Work',
        musicEnergy: 'Upbeat',
      },
      mentalWellness: {
        dailyEntries: [
          {
            date: new Date().toISOString().split('T')[0],
            moodScore: 8,
            mood: 'Happy',
            energy: 'High',
            notes: 'Feeling great today!',
          },
        ],
      },
    };

    const mockDb = {
      select: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };

    beforeEach(() => {
      mockDb.select.mockReset();
      mockDb.create.mockReset();
      mockDb.update.mockReset();
      (getDb as jest.Mock).mockReturnValue(mockDb);
      (initDb as jest.Mock).mockResolvedValue(mockDb as any);
    });

    it('should create a new emotional profile if one does not exist', async () => {
      mockDb.select.mockResolvedValue(null); // No existing profile
      mockDb.create.mockImplementation((table, data) => Promise.resolve([data]));

      const result = await createOrUpdateEmotionalProfile(mockUserId, mockEmotionalData);

      expect(mockDb.select).toHaveBeenCalledWith(expect.any(Object));
      expect(mockDb.create).toHaveBeenCalledTimes(1);
      expect(mockDb.create).toHaveBeenCalledWith('emotional_profile', expect.objectContaining({
        id: `profile:${mockUserId}`,
        user: expect.any(Object), // Accept any RecordId object
        preferences: mockEmotionalData.preferences,
        mentalWellness: expect.objectContaining({
          dailyEntries: mockEmotionalData.mentalWellness.dailyEntries,
          weeklyScore: mockEmotionalData.mentalWellness.dailyEntries[0].moodScore, // Initial weekly score
        }),
        timestamp: expect.any(Date),
      }));
      expect(mockDb.update).not.toHaveBeenCalled();
      expect(result).toBe('newProfile');
    });

    it('should update an existing emotional profile', async () => {
      const existingProfile = {
        id: `profile:${mockUserId}`,
        user: { tb: 'user', id: { String: `user:${mockUserId}` } },
        preferences: { mood: 'Neutral', energy: 'Medium' }, // Old preferences
        mentalWellness: {
          dailyEntries: [
            { date: '2023-01-01', moodScore: 5, mood: 'Okay', energy: 'Medium', notes: 'Previous entry' },
          ],
          weeklyScore: 5,
        },
        timestamp: new Date(Date.now() - 86400000), // Yesterday
      };
      // @ts-ignore
      mockDb.select.mockResolvedValue(existingProfile);
      mockDb.update.mockImplementation((id, data) => Promise.resolve([data]));

      const result = await createOrUpdateEmotionalProfile(mockUserId, mockEmotionalData);

      const expectedDailyEntries = [
        ...existingProfile.mentalWellness.dailyEntries,
        mockEmotionalData.mentalWellness.dailyEntries[0],
      ];
      const recentEntries = expectedDailyEntries.slice(-7);
      const expectedWeeklyScore = recentEntries.reduce((acc, entry) => acc + entry.moodScore, 0) / recentEntries.length;

      expect(mockDb.select).toHaveBeenCalledTimes(1);
      expect(mockDb.update).toHaveBeenCalledTimes(1);
      expect(mockDb.update).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          preferences: mockEmotionalData.preferences, // New preferences
          mentalWellness: expect.objectContaining({
            dailyEntries: expectedDailyEntries,
            weeklyScore: expectedWeeklyScore,
          }),
          timestamp: expect.any(Date),
        })
      );
      expect(mockDb.create).not.toHaveBeenCalled();
      expect(result).toBe('updatedProfile');
    });

    it('should throw an error if DB connection fails and initDb also fails', async () => {
      (getDb as jest.Mock).mockReturnValue(null);
      (initDb as jest.Mock).mockResolvedValue(null as any);

      await expect(createOrUpdateEmotionalProfile(mockUserId, mockEmotionalData)).rejects.toThrow("Database connection is not initialized.");
    });

    it('should throw an error if db.create fails', async () => {
      mockDb.select.mockResolvedValue(null);
      mockDb.create.mockRejectedValue(new Error('DB create error'));

      await expect(createOrUpdateEmotionalProfile(mockUserId, mockEmotionalData)).rejects.toThrow('Failed to create or update emotional profile in SurrealDB: DB create error');
    });

    it('should throw an error if db.update fails', async () => {
      const existingProfile = { id: `profile:${mockUserId}`, mentalWellness: { dailyEntries: [] } };
       // @ts-ignore
      mockDb.select.mockResolvedValue(existingProfile);
      mockDb.update.mockRejectedValue(new Error('DB update error'));

      await expect(createOrUpdateEmotionalProfile(mockUserId, mockEmotionalData)).rejects.toThrow('Failed to create or update emotional profile in SurrealDB: DB update error');
    });
  });

  describe('createUserInDb', () => {
    const mockSpotifyUser = {
      id: 'spotify-user-123',
      user: {
        name: 'Test Spotify User',
        email: 'spotify.user@example.com',
      },
      accessToken: 'spotify-access-token',
      refreshToken: 'spotify-refresh-token',
    };

    const mockDb = {
      select: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };

    beforeEach(() => {
      mockDb.select.mockReset();
      mockDb.create.mockReset();
      mockDb.update.mockReset();
      (getDb as jest.Mock).mockReturnValue(mockDb);
      (initDb as jest.Mock).mockResolvedValue(mockDb as any);
    });

    it('should create a new user if one does not exist', async () => {
      mockDb.select.mockResolvedValue(null); // No existing user
      mockDb.create.mockImplementation((table, data) => Promise.resolve([data]));

      const result = await createUserInDb(mockSpotifyUser);

      expect(mockDb.select).toHaveBeenCalledWith(expect.any(Object));
      expect(mockDb.create).toHaveBeenCalledTimes(1);
      expect(mockDb.create).toHaveBeenCalledWith('user', expect.objectContaining({
        id: `user:${mockSpotifyUser.id}`,
        username: mockSpotifyUser.user.name,
        email: mockSpotifyUser.user.email,
        access_token: mockSpotifyUser.accessToken,
        refresh_token: mockSpotifyUser.refreshToken,
        signup_date: expect.any(Date),
        last_login: expect.any(Date),
      }));
      expect(mockDb.update).not.toHaveBeenCalled();
      expect(result).toBe('newuser');
    });

    it('should update an existing user', async () => {
      const existingUserDbEntry = {
        id: `user:${mockSpotifyUser.id}`,
        username: 'Old Name',
        email: 'old.email@example.com',
        access_token: 'old-access-token',
        refresh_token: 'old-refresh-token',
        signup_date: new Date(Date.now() - 86400000 * 2), // 2 days ago
        last_login: new Date(Date.now() - 86400000), // Yesterday
      };
      // @ts-ignore
      mockDb.select.mockResolvedValue(existingUserDbEntry);
      mockDb.update.mockImplementation((id, data) => Promise.resolve([data]));

      const result = await createUserInDb(mockSpotifyUser);

      expect(mockDb.select).toHaveBeenCalledTimes(1);
      expect(mockDb.update).toHaveBeenCalledTimes(1);
      expect(mockDb.update).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          id: `user:${mockSpotifyUser.id}`,
          username: mockSpotifyUser.user.name,
          email: mockSpotifyUser.user.email,
          access_token: mockSpotifyUser.accessToken,
          refresh_token: mockSpotifyUser.refreshToken,
          signup_date: existingUserDbEntry.signup_date, // Should retain original signup_date
          last_login: expect.any(Date), // Should be a new date
        })
      );
      expect(mockDb.create).not.toHaveBeenCalled();
      expect(result).toBe('updateduser');
    });

    it('should use fallback values for username and email if not provided', async () => {
      const userWithoutDetails = {
        ...mockSpotifyUser,
        user: { name: null, email: null },
      };
      mockDb.select.mockResolvedValue(null);
      mockDb.create.mockImplementation((table, data) => Promise.resolve([data]));

      await createUserInDb(userWithoutDetails);

      expect(mockDb.create).toHaveBeenCalledWith('user', expect.objectContaining({
        username: 'Unknown User',
        email: '',
      }));
    });

    it('should throw an error if DB connection fails and initDb also fails', async () => {
      (getDb as jest.Mock).mockReturnValue(null);
      (initDb as jest.Mock).mockResolvedValue(null as any);

      await expect(createUserInDb(mockSpotifyUser)).rejects.toThrow("Database connection is not initialized.");
    });

    it('should throw an error if db.create fails', async () => {
      mockDb.select.mockResolvedValue(null);
      mockDb.create.mockRejectedValue(new Error('DB create error'));

      await expect(createUserInDb(mockSpotifyUser)).rejects.toThrow('Failed to create user in SurrealDB: DB create error');
    });

    it('should throw an error if db.update fails', async () => {
      const existingUserDbEntry = { id: `user:${mockSpotifyUser.id}`, signup_date: new Date() };
      // @ts-ignore
      mockDb.select.mockResolvedValue(existingUserDbEntry);
      mockDb.update.mockRejectedValue(new Error('DB update error'));

      await expect(createUserInDb(mockSpotifyUser)).rejects.toThrow('Failed to create user in SurrealDB: DB update error');
    });
  });
});
