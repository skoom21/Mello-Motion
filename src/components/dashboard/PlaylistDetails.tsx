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
  onTracksUpdate: (updatedTracks: Track[]) => void;
}

const PlaylistDetails: React.FC<PlaylistDetailsProps> = ({ playlist, onTracksUpdate }) => {
  const [selectedTracks, setSelectedTracks] = useState<Set<string>>(new Set());
  const [hoveredTrack, setHoveredTrack] = useState<Track | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleTrackToggle = (trackId: string) => {
    setSelectedTracks((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(trackId)) {
        newSelected.delete(trackId);
      } else {
        newSelected.add(trackId);
      }
      const updatedTracks = playlist.tracks.filter(track => newSelected.has(track.id));
      console.log(updatedTracks);
      onTracksUpdate(updatedTracks);
      return newSelected;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    let newSelected: Set<string>;
    if (checked) {
      newSelected = new Set(playlist.tracks.map(track => track.id));
    } else {
      newSelected = new Set();
    }
    setSelectedTracks(newSelected);
    const updatedTracks = playlist.tracks.filter(track => newSelected.has(track.id));
    onTracksUpdate(updatedTracks);
  };

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
      className="bg-[#2A1541] border-purple-700"
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
        <div className="flex items-center mb-2">
          <Checkbox
            id="select-all"
            checked={selectedTracks.size === playlist.tracks.length}
            onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
            className="mr-2"
          />
          <label htmlFor="select-all" className="text-purple-200 cursor-pointer">
            Select All
          </label>
        </div>
        <ScrollArea className="h-[400px] pr-4">
          {playlist.tracks.map((track) => (
            <div
              key={track.id}
              onMouseEnter={() => setHoveredTrack(track)}
              onMouseLeave={() => setHoveredTrack(null)}
              className="flex items-center py-2 border-b border-purple-700 last:border-b-0"
            >
              <Checkbox
                id={track.id}
                checked={selectedTracks.has(track.id)}
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
        className="w-36 h-36 shadow-lg transition-transform duration-300 ease-in-out"
      />
    </div>
  );
}

export default PlaylistDetails;

