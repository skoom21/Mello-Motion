"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart } from "@tremor/react"
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

const topArtists = [
  { name: "Artist 1", image: "/placeholder.svg?height=96&width=96" },
  { name: "Artist 2", image: "/placeholder.svg?height=96&width=96" },
  { name: "Artist 3", image: "/placeholder.svg?height=96&width=96" },
  { name: "Artist 4", image: "/placeholder.svg?height=96&width=96" },
  { name: "Artist 5", image: "/placeholder.svg?height=96&width=96" },
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

  return (
    <div className="min-h-screen bg-transparent text-white">
      <header className="p-8">
        <div className="flex items-center gap-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <Avatar className="h-32 w-32 border-4 border-white/50">
              <AvatarImage src="/placeholder.svg?height=128&width=128" alt="Talha Yousif" />
              <AvatarFallback>TY</AvatarFallback>
            </Avatar>
          </motion.div>
          <div>
            <motion.h1
              className="text-4xl font-bold"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Talha Yousif
            </motion.h1>
            <motion.p
              className="text-xl text-gray-300"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Music enthusiast | Emotional explorer
            </motion.p>
            <motion.div
              className="mt-2 flex items-center gap-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <span className="text-sm">21 Public Playlists</span>
              <span className="text-sm">32 Followers</span>
              <span className="text-sm">822 Following</span>
            </motion.div>
          </div>
        </div>
      </header>
      <main className="p-8">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="bg-white/10">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="moods">Moods & Emotions</TabsTrigger>
            <TabsTrigger value="music">Music Stats</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <div className="grid gap-8 md:grid-cols-2">
              <Card className="bg-white/10 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle>Current Mood</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center">
                    <motion.div
                      className="relative h-48 w-48"
                      animate={{
                        backgroundColor: emotionColors[currentMood as keyof typeof emotionColors],
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <Smile className="absolute inset-0 h-full w-full p-8" />
                    </motion.div>
                  </div>
                  <p className="mt-4 text-center text-2xl font-semibold capitalize">{currentMood}</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle>Mood History</CardTitle>
                </CardHeader>
                <CardContent>
                  <LineChart
                    className="h-64"
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
              <Card className="bg-white/10 backdrop-blur-lg">
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
                          className="h-16 w-16 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        <span className="mt-2 text-sm capitalize">{emotion}</span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle>Top Emotional Genres</CardTitle>
                </CardHeader>
                <CardContent>
                  <BarChart
                    className="h-64"
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
              <Card className="bg-white/10 backdrop-blur-lg">
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
                          <Avatar className="h-24 w-24">
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
              <Card className="bg-white/10 backdrop-blur-lg">
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
              <Card className="bg-white/10 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle>Recent Playlists</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="w-full">
                    <div className="flex w-max space-x-4 p-1">
                      {recentPlaylists.map((playlist, index) => (
                        <motion.div
                          key={playlist.name}
                          className="w-[150px]"
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
              <Card className="bg-white/10 backdrop-blur-lg">
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
      <footer className="fixed bottom-0 left-0 right-0 bg-black/50 backdrop-blur-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/placeholder.svg?height=48&width=48" alt="Now Playing" />
              <AvatarFallback>NP</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">Now Playing</p>
              <p className="text-sm text-gray-400">Artist - Track</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Play className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon">
              <Heart className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}