import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Headphones, ChevronLeft } from "lucide-react";
import { getPlaylists } from "@/utils/getplaylists";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import PlaylistDetails from "./PlaylistDetails";
import AcceptPlaylistModal from "./AcceptPlaylistModal";
import GenerateButton from "../GenerateButton";
import { saveRecommendations } from "@/utils/saveRecommendations";
import { savePlaylists } from "@/utils/saveplayslist";
interface Playlist {
  id: string;
  name: string;
  description: string;
  image: string[];
  tracks: Track[];
}

interface Track {
  id: string;
  name: string;
  playcount: number;
  match: number;
  url: string;
  streamable: { fulltrack: string; "#text": string };
  duration: number;
  artist: {
    name: string;
    mbid: string;
    url: string;
  };
  image: {
    "#text": string;
    size: string;
  }[];
  imageUrl: string;
}

interface PlaylistCarouselProps {
  hoveredCard: string | null;
  setHoveredCard: React.Dispatch<React.SetStateAction<string | null>>;
}

const PlaylistCarousel: React.FC<PlaylistCarouselProps> = ({
  hoveredCard,
  setHoveredCard,
}) => {
  const { data: session } = useSession();
  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    const savedPlaylists = localStorage.getItem("playlists");
    return savedPlaylists ? JSON.parse(savedPlaylists) : [];
  });
  const [loading, setLoading] = useState(playlists.length === 0);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(
    null
  );
  const [savedPlaylist, setSavedPlaylist] = useState<Playlist | null>(null);
  const [rejectedPlaylists, setRejectedPlaylists] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (playlists.length === 0) {
      fetchPlaylists();
    }
  }, [session]);

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      if (session?.accessToken) {
        const response = await getPlaylists(session);
        const mappedPlaylists = response.playlists
          .filter(
            (playlist: any) => playlist?.name && playlist?.tracks?.length > 0
          )
          .map((playlist: any) => ({
            id: playlist.id,
            name: playlist.name,
            description: playlist.description || "No description available",
            image: playlist.image || "default-image-url", // Replace with a default image URL if needed
            tracks: playlist.tracks,
          }));
        setPlaylists(mappedPlaylists);
        localStorage.setItem("playlists", JSON.stringify(mappedPlaylists));
      }
    } catch (error) {
      console.error("Error fetching playlists:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaylistClick = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
  };

  const handleBackClick = () => {
    setSelectedPlaylist(null);
  };

  const handleAcceptClick = () => {
    setIsModalOpen(true);
  };

  const handleRejectClick = () => {
    if (selectedPlaylist) {
      setRejectedPlaylists([...rejectedPlaylists, selectedPlaylist.id]);
      setSelectedPlaylist(null);
    }
  };

  const handleModalClose = (
    playlistName?: string,
    description?: string,
    image?: string
  ) => {
    setIsModalOpen(false);
    if (playlistName && savedPlaylist) {
      // Here you would typically save the new playlist to your backend
      console.log("Saving playlist:", {
        ...savedPlaylist,
        name: playlistName,
        description,
        image,
      });
    }
    setSelectedPlaylist(null);
    setSavedPlaylist(null);

    // Save the recommendations to the database
    if (savedPlaylist) {
      const recommendations = savedPlaylist.tracks.map((track) => ({
        id: track.id,
        songId: track.id,
        songName: track.name,
        artistName: track.artist.name,
      }));

      saveRecommendations(session?.id || "default-user-id", recommendations)
        .then((savedRecs) => {
          console.log("Recommendations saved:", savedRecs);
        })
        .catch((error) => {
          console.error("Error saving recommendations:", error);
        });

        savePlaylists(session?.id || "default-user-id", [savedPlaylist])
    }
  };

  return (
    <Card
      className={`col-span-1 sm:col-span-2 lg:col-span-3 bg-[#220F33] text-white transition-all duration-300 ease-in-out ${
        hoveredCard === "recommendations"
          ? "shadow-lg shadow-purple-500/50"
          : ""
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
        {!selectedPlaylist && (
            <div className="flex justify-center mt-2">
            <GenerateButton onClick={fetchPlaylists} loading={loading} text="Generate Playlists" />
            </div>
        )}
      </CardHeader>
      <CardContent>
        {selectedPlaylist ? (
          <div className="space-y-4">
            <Button
              variant="ghost"
              onClick={handleBackClick}
              className="text-purple-300"
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Back to playlists
            </Button>
            <PlaylistDetails 
              playlist={selectedPlaylist}
              onTracksUpdate={(updatedTracks) => {
              if (selectedPlaylist) {
                const updatedPlaylist = {
                ...selectedPlaylist,
                tracks: updatedTracks
                };
                setSavedPlaylist(updatedPlaylist);
                
                // // Update the playlist in the playlists array
                // const updatedPlaylists = playlists.map(p => 
                // p.id === selectedPlaylist.id ? updatedPlaylist : p
                // );
                // setPlaylists(updatedPlaylists);
                // localStorage.setItem("playlists", JSON.stringify(updatedPlaylists));
              }
              }}
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="destructive"
                className="text-purple-300"
                onClick={handleRejectClick}
              >
                Reject
              </Button>
                <Button
                variant="ghost"
                className="text-purple-300"
                onClick={handleAcceptClick}
                disabled={!savedPlaylist || savedPlaylist.tracks.length === 0}
                >
                Accept
                </Button>
            </div>
          </div>
        ) : (
          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent key={`carousel-content-${selectedPlaylist ? selectedPlaylist : 'default'}`}>
              {loading
                ? Array.from({ length: 4 }).map((_, index) => (
                    <CarouselItem
                      key={`skeleton-${index}`}
                      className="basis-full sm:basis-1/2 lg:basis-1/4"
                    >
                      <div className="p-1">
                        <Card className="bg-[#240f3d] border-purple-700">
                          <CardContent className="flex flex-col items-center p-4">
                            <Skeleton key={`skeleton-full-${index}-1`} className="w-full h-40 mb-2 bg-purple-300" />
                            <Skeleton key={`skeleton-3/4-${index}-2`} className="w-3/4 h-6 mb-1 bg-purple-300" />
                            <Skeleton key={`skeleton-1/2-${index}-3`} className="w-1/2 h-4 bg-purple-300" />
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))
                : playlists.map((playlist) => (
                    <CarouselItem
                      key={playlist.id}
                      className="basis-full sm:basis-1/2 lg:basis-1/4"
                    >
                      <div className="p-1">
                        <Card
                          className={`bg-[#2A1541] border-purple-700 cursor-pointer transition-opacity duration-300 ${
                            rejectedPlaylists.includes(playlist.id)
                              ? "opacity-50 pointer-events-none"
                              : "hover:bg-[#3A1F5A]"
                          }`}
                          onClick={() =>
                            !rejectedPlaylists.includes(playlist.id) &&
                            handlePlaylistClick(playlist)
                          }
                        >
                          <CardContent className="flex flex-col items-center p-4">
                            <div className="grid grid-cols-2 w-full aspect-square mb-2 overflow-hidden rounded-md">
                              {playlist.image
                                .slice(0, 4)
                                .map((imageUrl, index) => (
                                  <div
                                    key={`${playlist.id}-image-${index}`}
                                    className="relative w-full h-full"
                                  >
                                    <img
                                      src={imageUrl}
                                      alt={`${playlist.name} cover ${
                                        index + 1
                                      }`}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ))}
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
                  ))}
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
  );
};

export default PlaylistCarousel;
