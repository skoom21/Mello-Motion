import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
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

interface Playlist {
  id: string;
  name: string;
  description: string;
  image: string[];
  tracks: Track[];
}

interface PlaylistDetailsProps {
  playlist: Playlist;
}

const PlaylistDetails: React.FC<PlaylistDetailsProps> = ({ playlist }) => {
  const [selectedTracks, setSelectedTracks] = useState<string[]>(
    playlist.tracks.map((track) => track.id)
  );
  console.log(playlist.tracks);
  const handleTrackToggle = (trackId: string) => {
    setSelectedTracks((prev) =>
      prev.includes(trackId)
        ? prev.filter((id) => id !== trackId)
        : [...prev, trackId]
    );
  };

  const [hoveredTrack, setHoveredTrack] = useState<Track | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event: React.MouseEvent) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <Card
      className="bg-[#2A1541] border-purple-700 "
      onMouseMove={handleMouseMove}
    >
      <CardContent className="p-4">
        <div className="flex items-center mb-4">
          <div className="grid grid-cols-2 w-20 aspect-square mb-2 mr-3 overflow-hidden rounded-md">
            {playlist.image.slice(0, 4).map((imageUrl, index) => (
              <div key={index} className="relative w-full h-full">
                <img
                  src={imageUrl}
                  alt={`${playlist.name} cover ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          <div>
            <h2 className="text-xl font-bold text-purple-200">
              {playlist.name}
            </h2>
            <p className="text-sm text-purple-300">{playlist.description}</p>
          </div>
        </div>
        <ScrollArea className="h-[400px] pr-4">
          {playlist.tracks.map((track) => (
            <div
              key={track.id}
              onMouseEnter={() => setHoveredTrack(track)}
              onMouseLeave={() => setHoveredTrack(null)}
              className="flex items-center py-2 border-b border-purple-700 last:border-b-0 "
            >
              <Checkbox
                id={track.id}
                checked={selectedTracks.includes(track.id)}
                onCheckedChange={() => handleTrackToggle(track.id)}
                className="mr-2"
              />
              <label htmlFor={track.id} className="flex-grow cursor-pointer">
                <div className="text-purple-200">{track.name}</div>
                <div className="text-sm text-purple-400">
                  {track.artist.name}
                </div>
              </label>
              <div className="text-purple-400 text-sm">
                {formatDuration(track.duration)}
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <FloatingImage track={hoveredTrack} mousePosition={mousePosition} />
    </Card>
  );
};

interface FloatingImageProps {
  track: Track | null;
  mousePosition: { x: number; y: number };
}

function FloatingImage({ track, mousePosition }: FloatingImageProps) {
  if (!track) return null;

  return (
    <div
      className={cn(
      "fixed pointer-events-none transition-opacity duration-300 ease-in-out transform",
      track ? "opacity-100 scale-100" : "opacity-0 scale-95"
      )}
      style={{
      left: `${mousePosition.x + 200}px`,
      top: `${mousePosition.y + 80}px`,
      transform: "translate(-100%, -100%)",
      }}
    >
      <img
      src={track.imageUrl}
      alt={`${track.name} cover`}
      loading="lazy"
      className="w-32 h-32 rounded-md shadow-lg transition-transform duration-300 ease-in-out"
      />
    </div>
  );
}

export default PlaylistDetails;
