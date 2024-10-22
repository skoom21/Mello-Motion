import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Headphones, Play } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { getPlaylists } from '@/utils/getplaylists'
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Skeleton } from "@/components/ui/skeleton";

interface PlaylistCarouselProps {
  hoveredCard: string | null
  setHoveredCard: React.Dispatch<
    React.SetStateAction<
      null | "recentlyPlayed" | "mood" | "mentalWellness" | "recommendations"
    >
  >;
}

const PlaylistCarousel: React.FC<PlaylistCarouselProps> = ({
  hoveredCard,
  setHoveredCard,
}) => {
  const { data: session, status } = useSession();
  interface Playlist {
    id: string
    name: string;
    description: string;
    progress: number;
    image: string;
    
  }

  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        if (session?.accessToken) {
          const response = await getPlaylists(session.accessToken);
          const mappedPlaylists = response.items.map((playlist: any) => ({
            name: playlist.name,
            description: playlist.description || "No description available",
            progress: Math.floor(Math.random() * 100), // Assuming you want a random progress value
            image: playlist.images[0]?.url || "/placeholder.svg?text=No+Image",
            id : playlist.id 
          }));
          setPlaylists(mappedPlaylists);
        } else {
          console.error("Access token is undefined");
        }
      } catch (error) {
        console.error("Error fetching playlists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [session?.accessToken]);

  return (
    <Card
      className={`col-span-1 xl:col-span-3 bg-[#220F33] text-white transition-all duration-300 ease-in-out ${
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
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
              <CarouselItem key={index} className="max-h-full md:basis-1/2 lg:basis-1/4">
                <div className="p-1 h-full">
                <Card className="bg-[#240f3d] border-purple-700 h-full">
                  <CardContent className="flex flex-col items-center p-4 h-full">
                  <Skeleton className="w-full h-80 mb-2 bg-purple-300" />
                  <Skeleton className="w-3/4 h-6 mb-1 bg-purple-300" />
                  <Skeleton className="w-1/2 h-4 mb-2 bg-purple-300" />
                  <Skeleton className="w-full h-2 bg-purple-300" />
                  <Skeleton className="w-1/4 h-4 mt-1 bg-purple-300" />
                  </CardContent>
                </Card>
                </div>
              </CarouselItem>
              ))
            ) : (
              playlists.map((playlist, index) => (
                <CarouselItem key={index} className="max-h-full md:basis-1/2 lg:basis-1/4">
                  <div className="p-1 h-full">
                    <Card className="bg-[#2A1541] border-purple-700 h-full">
                      <CardContent className="flex flex-col items-center p-4 h-full">
                        <div className="relative w-full aspect-square mb-2">
                            <div className="w-full h-80 flex items-center justify-center bg-gray-200 rounded-md overflow-hidden group">
                            <img
                              src={playlist.image}
                              alt={playlist.name}
                              className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                            />
                            </div>
                            <Button
                            size="icon"
                            variant="secondary"
                            className="absolute bottom-2 right-2 bg-purple-600 hover:bg-purple-700 text-white"
                            onClick={() => window.open(`https://open.spotify.com/playlist/${playlist.id}`, '_blank')}
                            >
                            <Play className="h-4 w-4" />
                            </Button>
                        </div>
                        <h3 className="font-medium text-lg mb-1 text-purple-200 text-center">{playlist.name}</h3>
                        <p className="text-sm text-purple-300 mb-2 text-center">
                          {playlist.description === "No description available" ? "" : playlist.description}
                        </p>
                        <Progress
                          value={playlist.progress} 
                          className="h-2 w-full bg-purple-900"
                        >
                          <div
                            className="h-full bg-purple-500 transition-all duration-500 ease-in-out"
                            style={{ width: `${playlist.progress}%` }}
                          />
                        </Progress>
                        <span className="text-xs text-purple-400 mt-1">{playlist.progress}% match</span>
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
      </CardContent>
    </Card>
  )
}

export default PlaylistCarousel
