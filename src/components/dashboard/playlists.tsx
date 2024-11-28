import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { Headphones, ChevronLeft } from "lucide-react"
import { getPlaylists } from '@/utils/getplaylists'
import {getRecentlyPlayedTracks} from '@/utils/getrecent'
import { useSession } from 'next-auth/react'
import { Skeleton } from "@/components/ui/skeleton"
import PlaylistDetails from './PlaylistDetails'
import AcceptPlaylistModal from './AcceptPlaylistModal'

interface Playlist {
  id: string
  name: string
  description: string
  image: string
  tracks: Track[]
}

interface Track {
  id: string
  name: string
  artists: string
  album: string
  duration: number
}

interface PlaylistCarouselProps {
  hoveredCard: string | null
  setHoveredCard: React.Dispatch<React.SetStateAction<string | null>>
}

const PlaylistCarousel: React.FC<PlaylistCarouselProps> = ({
  hoveredCard,
  setHoveredCard,
}) => {
  const { data: session } = useSession()
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null)
  const [rejectedPlaylists, setRejectedPlaylists] = useState<string[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        if (session?.accessToken) {
          const response = await getPlaylists(session)
          const mappedPlaylists = response.playlists
            .filter((playlist: any) => playlist?.name && playlist?.tracks?.length > 0)
            .map((playlist: any) => ({
              id: playlist.id,
              name: playlist.name,
              description: playlist.description || "No description available",
              image: playlist.image || "default-image-url", // Replace with a default image URL if needed
              tracks: playlist.tracks
            }))
          setPlaylists(mappedPlaylists)
        }
      } catch (error) {
        console.error("Error fetching playlists:", error)
      } finally {
        setLoading(false)
      }
    }

    const intervalId = setInterval(fetchPlaylists, 5000)

    return () => clearInterval(intervalId)
  }, [session?.accessToken])

  const handlePlaylistClick = (playlist: Playlist) => {
    setSelectedPlaylist(playlist)
    // Here you would typically fetch the tracks for the selected playlist
    // For now, we'll just simulate it with some dummy data
    const dummyTracks: Track[] = Array.from({ length: 10 }, (_, i) => ({
      id: `track-${i}`,
      name: `Track ${i + 1}`,
      artists: `Artist ${i + 1}`,
      album: `Album ${i + 1}`,
      duration: Math.floor(Math.random() * 300) + 120 // Random duration between 2-5 minutes
    }))
    setSelectedPlaylist({ ...playlist, tracks: dummyTracks })
  }

  const handleBackClick = () => {
    setSelectedPlaylist(null)
  }

  const handleAcceptClick = () => {
    setIsModalOpen(true)
  }

  const handleRejectClick = () => {
    if (selectedPlaylist) {
      setRejectedPlaylists([...rejectedPlaylists, selectedPlaylist.id])
      setSelectedPlaylist(null)
    }
  }

  const handleModalClose = (playlistName?: string, description?: string, image?: string) => {
    setIsModalOpen(false)
    if (playlistName && selectedPlaylist) {
      // Here you would typically save the new playlist to your backend
      console.log("Saving playlist:", { ...selectedPlaylist, name: playlistName, description, image })
    }
    setSelectedPlaylist(null)
  }

  return (
    <Card
      className={`col-span-1 sm:col-span-2 lg:col-span-3 bg-[#220F33] text-white transition-all duration-300 ease-in-out ${
        hoveredCard === "recommendations" ? "shadow-lg shadow-purple-500/50" : ""
      }`}
      onMouseEnter={() => setHoveredCard("recommendations")}
      onMouseLeave={() => setHoveredCard(null)}
    >
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center text-[#ffffff]">
          <Headphones className="mr-2" /> Playlist Recommendations
        </CardTitle>
        <CardDescription className="text-purple-300">
          Personalized playlists based on your mood
        </CardDescription>
      </CardHeader>
      <CardContent>
        {selectedPlaylist ? (
          <div className="space-y-4">
            <Button variant="ghost" onClick={handleBackClick} className="text-purple-300">
              <ChevronLeft className="mr-2 h-4 w-4" /> Back to playlists
            </Button>
            <PlaylistDetails playlist={selectedPlaylist} />
            <div className="flex justify-end space-x-2">
              <Button variant="destructive" className="text-purple-300" onClick={handleRejectClick}>Reject</Button>
              <Button variant="ghost" className="text-purple-300" onClick={handleAcceptClick}>Accept</Button>
            </div>
          </div>
        ) : (
          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent>
              {loading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <CarouselItem key={index} className="basis-full sm:basis-1/2 lg:basis-1/4">
                    <div className="p-1">
                      <Card className="bg-[#240f3d] border-purple-700">
                        <CardContent className="flex flex-col items-center p-4">
                          <Skeleton className="w-full h-40 mb-2 bg-purple-300" />
                          <Skeleton className="w-3/4 h-6 mb-1 bg-purple-300" />
                          <Skeleton className="w-1/2 h-4 bg-purple-300" />
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))
              ) : (
                playlists.map((playlist) => (
                  <CarouselItem key={playlist.id} className="basis-full sm:basis-1/2 lg:basis-1/4">
                    <div className="p-1">
                      <Card 
                        className={`bg-[#2A1541] border-purple-700 cursor-pointer transition-opacity duration-300 ${
                          rejectedPlaylists.includes(playlist.id) ? 'opacity-50 pointer-events-none' : 'hover:bg-[#3A1F5A]'
                        }`}
                        onClick={() => !rejectedPlaylists.includes(playlist.id) && handlePlaylistClick(playlist)}
                      >
                        <CardContent className="flex flex-col items-center p-4">
                          <div className="w-full aspect-square mb-2 overflow-hidden rounded-md">
                            <img
                              src={playlist.image}
                              alt={playlist.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <h3 className="font-medium text-lg mb-1 text-purple-200 text-center">
                            {playlist.name}
                          </h3>
                          <p className="text-sm text-purple-300 text-center line-clamp-2">
                            {playlist.description}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))
              )}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        )}
      </CardContent>
      {isModalOpen && selectedPlaylist && (
        <AcceptPlaylistModal 
          playlist={selectedPlaylist} 
          onClose={handleModalClose} 
        />
      )}
    </Card>
  )
}

export default PlaylistCarousel

