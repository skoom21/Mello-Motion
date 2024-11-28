"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart } from "@tremor/react"
import {getTopArtists} from "@/utils/getartists"; // The function from above
import getUserProfile from "@/utils/getuserprofile"
import { useEffect, useState} from "react";
import { useSession } from "next-auth/react"
import {
  Calendar,
  Clock,
  Headphones,
  Heart,
  Music,
  Play,
  Settings,
  Smile,
  User,
} from "lucide-react"

const emotionColors = {
  happy: "#FFD700",
  energetic: "#FF4500",
  calm: "#4682B4",
  melancholy: "#483D8B",
  angry: "#DC143C",
}

const moodData = [
  { date: "Mon", happy: 70, energetic: 80, calm: 50, melancholy: 30, angry: 10 },
  { date: "Tue", happy: 65, energetic: 75, calm: 55, melancholy: 35, angry: 15 },
  { date: "Wed", happy: 75, energetic: 85, calm: 45, melancholy: 25, angry: 5 },
  { date: "Thu", happy: 80, energetic: 90, calm: 40, melancholy: 20, angry: 0 },
  { date: "Fri", happy: 85, energetic: 95, calm: 35, melancholy: 15, angry: 5 },
  { date: "Sat", happy: 90, energetic: 100, calm: 30, melancholy: 10, angry: 0 },
  { date: "Sun", happy: 95, energetic: 90, calm: 40, melancholy: 5, angry: 5 },
]

const genreData = [
  { name: "Pop", value: 30 },
  { name: "Rock", value: 25 },
  { name: "Electronic", value: 20 },
  { name: "Classical", value: 15 },
  { name: "Hip Hop", value: 10 },
]

const topTracks = [
  { name: "Track 1", artist: "Artist 1", duration: "3:45" },
  { name: "Track 2", artist: "Artist 2", duration: "4:12" },
  { name: "Track 3", artist: "Artist 3", duration: "3:30" },
  { name: "Track 4", artist: "Artist 4", duration: "3:58" },
  { name: "Track 5", artist: "Artist 5", duration: "4:05" },
]

const recentPlaylists = [
  { name: "Happy Vibes", image: "/placeholder.svg?height=150&width=150", tracks: 25 },
  { name: "Chill Evening", image: "/placeholder.svg?height=150&width=150", tracks: 30 },
  { name: "Workout Energy", image: "/placeholder.svg?height=150&width=150", tracks: 20 },
  { name: "Melancholy Moments", image: "/placeholder.svg?height=150&width=150", tracks: 15 },
  { name: "Anger Management", image: "/placeholder.svg?height=150&width=150", tracks: 18 },
]

export default function ProfileSection() {
  const [currentMood, setCurrentMood] = React.useState("happy")
  const [topArtists, setTopArtists] = useState<{ name: string; image: string }[]>([]);
  const [userProfile, setUserProfile] = useState({
    userName: "",
    userEmail: "",
    userImage: "/placeholder.svg?height=128&width=128",
    userProduct: "",
    userExternalUrl: "",
    userCountry: "",
    userFollowers: 0,
    });
  const { data: session, status } = useSession();
  
  useEffect(() => {
    async function fetchTopArtists() {
      try {
        if (session?.accessToken) {
          const artists = await getTopArtists(session.accessToken, 20, "short_term");
          setTopArtists(artists.map((artist: { name: string; images?: { url: string }[] }) => ({
            name: artist.name,
            image: artist.images?.[0]?.url || "/placeholder.svg?height=96&width=96"
          })));
        } else {
          console.error("Access token is undefined");
        }
      } catch (error) {
        console.error("Error fetching top artists:", error);
      }
    }
    
    fetchTopArtists();
  }, [session]);
  
  useEffect(() => {
    async function fetchUserProfile() {
      try {
        if (session?.accessToken) {
          const response = await getUserProfile(session.accessToken);
          const profileData = response;
          // Process and use profileData as needed
          const userName = profileData.display_name;
          const userEmail = profileData.email;
          const userImage = profileData.images?.[0]?.url || "/placeholder.svg?height=128&width=128";
          const userProduct = profileData.product;
          const userExternalUrl = profileData.external_urls.spotify;
          const userCountry = profileData.country;
          const userFollowers = profileData.followers.total;

          setUserProfile({
          userName,
          userEmail,
          userImage,
          userProduct,
          userExternalUrl,
          userCountry,
          userFollowers,
          });
        } else {
          console.error("Access token is undefined");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    }

    fetchUserProfile();
  }, [session]);
  
  return (
    <div className="min-h-screen bg-transparent text-white">
      <header className="p-4 md:p-8">
      <div className="flex flex-col items-center gap-6 md:flex-row">
        <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
        <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-[#220F33]">
          <AvatarImage src={userProfile.userImage} alt={userProfile.userName} />
          <AvatarFallback>TY</AvatarFallback>
        </Avatar>
        {userProfile.userProduct === "premium" && (
            <motion.div
            className="absolute top-0 right-0 h-9 w-9 md:h-8 md:w-8 rounded-full flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
            <img
              src="https://img.icons8.com/color/48/verified-badge.png"
              alt="Verified Badge"
              className="h-4 w-4 md:h-6 md:w-6"
            />
            </motion.div>
        )}
        </motion.div>
        <div className="text-center md:text-left">
        <motion.h1
          className="text-2xl md:text-4xl font-bold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {userProfile.userName || "Not found"}
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-gray-300"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Music enthusiast | Emotional explorer
        </motion.p>
        <motion.div
          className="mt-2 flex flex-col items-center gap-2 md:flex-row md:gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <span className="text-sm">21 Public Playlists</span>
          <span className="text-sm">{userProfile.userFollowers} Followers</span>
          <span className="text-sm">822 Following</span>
        </motion.div>
        </div>
      </div>
      </header>
      <main className="p-4 md:p-8">
      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList className="bg-[#220F33]">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="moods">Moods & Emotions</TabsTrigger>
        <TabsTrigger value="music">Music Stats</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="bg-[#220F33] backdrop-blur-lg text-slate-100">
          <CardHeader>
            <CardTitle>Current Mood</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
            <motion.div
              className="relative h-32 w-32 md:h-48 md:w-48"
              animate={{
              backgroundColor: emotionColors[currentMood as keyof typeof emotionColors],
              }}
              transition={{ duration: 0.5 }}
            >
              <Smile className="absolute inset-0 h-full w-full p-4 md:p-8" />
            </motion.div>
            </div>
            <p className="mt-4 text-center text-xl md:text-2xl font-semibold capitalize">{currentMood}</p>
          </CardContent>
          </Card>
          <Card className="bg-[#220F33] backdrop-blur-lg text-slate-100">
          <CardHeader>
            <CardTitle>Mood History</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart
            className="h-48 md:h-64"
            data={moodData}
            index="date"
            categories={["happy", "energetic", "calm", "melancholy", "angry"]}
            colors={["yellow", "orange", "blue", "indigo", "red"]}
            valueFormatter={(value: any) => `${value}%`}
            yAxisWidth={30}
            />
          </CardContent>
          </Card>
        </div>
        </TabsContent>
        <TabsContent value="moods">
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="bg-[#220F33] backdrop-blur-lg text-slate-100">
          <CardHeader>
            <CardTitle>Emotion Color Palette</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
            {Object.entries(emotionColors).map(([emotion, color]) => (
              <motion.div
              key={emotion}
              className="flex flex-col items-center"
              whileHover={{ scale: 1.1 }}
              >
              <div
                className="h-12 w-12 md:h-16 md:w-16 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="mt-2 text-sm capitalize">{emotion}</span>
              </motion.div>
            ))}
            </div>
          </CardContent>
          </Card>
          <Card className="bg-[#220F33] backdrop-blur-lg text-white-100">
          <CardHeader>
            <CardTitle>Top Emotional Genres</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
            className="h-48 md:h-64"
            data={genreData}
            index="name"
            categories={["value"]}
            colors={["purple"]}
            valueFormatter={(value: any) => `${value}%`}
            yAxisWidth={48}
            />
          </CardContent>
          </Card>
        </div>
        </TabsContent>
        <TabsContent value="music">
        <div className="space-y-8">
          <Card className="bg-[#220F33]  text-slate-100 backdrop-blur-lg">
          <CardHeader>
            <CardTitle>Top Artists This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex w-max space-x-4">
              {topArtists.map((artist, index) => (
              <motion.div
                key={artist.name}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Avatar className="h-16 w-16 md:h-24 md:w-24">
                <AvatarImage src={artist.image} alt={artist.name} />
                <AvatarFallback>{artist.name[0]}</AvatarFallback>
                </Avatar>
                <span className="mt-2 text-sm">{artist.name}</span>
              </motion.div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardContent>
          </Card>
          <Card className="bg-[#220F33]  text-slate-100 backdrop-blur-lg">
          <CardHeader>
            <CardTitle>Top Tracks This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
            {topTracks.map((track, index) => (
              <motion.li
              key={track.name}
              className="flex items-center justify-between"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              >
              <div className="flex items-center gap-4">
                <Play className="h-4 w-4" />
                <div>
                <p className="font-semibold">{track.name}</p>
                <p className="text-sm text-gray-400">{track.artist}</p>
                </div>
              </div>
              <span className="text-sm text-gray-400">{track.duration}</span>
              </motion.li>
            ))}
            </ul>
          </CardContent>
          </Card>
        </div>
        </TabsContent>
        <TabsContent value="activity">
        <div className="space-y-8">
          <Card className="bg-[#220F33]  text-slate-100 backdrop-blur-lg">
          <CardHeader>
            <CardTitle>Recent Playlists</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="w-full">
            <div className="flex w-max space-x-4 p-1">
              {recentPlaylists.map((playlist, index) => (
              <motion.div
                key={playlist.name}
                className="w-[100px] md:w-[150px]"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <img
                src={playlist.image}
                alt={playlist.name}
                className="aspect-square rounded-md object-cover"
                />
                <p className="mt-2 font-semibold">{playlist.name}</p>
                <p className="text-sm text-gray-400">{playlist.tracks} tracks</p>
              </motion.div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardContent>
          </Card>
          <Card className="bg-[#220F33]  text-slate-100 backdrop-blur-lg">
          <CardHeader>
            <CardTitle>Listening Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Headphones className="h-5 w-5" />
              <span>Total Listening Time</span>
            </div>
            <span>1,234 hours</span>
            </div>
            <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>Average Daily Listening</span>
            </div>
            <span>3.5 hours</span>
            </div>
            <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>Most Active Day</span>
            </div>
            <span>Saturday</span>
            </div>
            <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              <span>Favorite Genre</span>
            </div>
            <span>Pop</span>
            </div>
          </CardContent>
          </Card>
        </div>
        </TabsContent>
      </Tabs>
      </main>
    </div>
  )
}