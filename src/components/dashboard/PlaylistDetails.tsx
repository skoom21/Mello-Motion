import React, { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Track {
  id: string
  name: string
  artists: string
  album: string
  duration: number
}

interface Playlist {
  id: string
  name: string
  description: string
  image: string
  tracks: Track[]
}

interface PlaylistDetailsProps {
  playlist: Playlist
}

const PlaylistDetails: React.FC<PlaylistDetailsProps> = ({ playlist }) => {
  const [selectedTracks, setSelectedTracks] = useState<string[]>(playlist.tracks.map(track => track.id))

  const handleTrackToggle = (trackId: string) => {
    setSelectedTracks(prev => 
      prev.includes(trackId) 
        ? prev.filter(id => id !== trackId)
        : [...prev, trackId]
    )
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <Card className="bg-[#2A1541] border-purple-700">
      <CardContent className="p-4">
        <div className="flex items-center mb-4">
          <img src={playlist.image} alt={playlist.name} className="w-16 h-16 rounded-md mr-4" />
          <div>
            <h2 className="text-xl font-bold text-purple-200">{playlist.name}</h2>
            <p className="text-sm text-purple-300">{playlist.description}</p>
          </div>
        </div>
        <ScrollArea className="h-[400px] pr-4">
          {playlist.tracks.map((track) => (
            <div key={track.id} className="flex items-center py-2 border-b border-purple-700 last:border-b-0">
              <Checkbox 
                id={track.id} 
                checked={selectedTracks.includes(track.id)}
                onCheckedChange={() => handleTrackToggle(track.id)}
                className="mr-2"
              />
              <label htmlFor={track.id} className="flex-grow cursor-pointer">
                <div className="text-purple-200">{track.name}</div>
                <div className="text-sm text-purple-400">{track.artists} • {track.album}</div>
              </label>
              <div className="text-purple-400 text-sm">{formatDuration(track.duration)}</div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export default PlaylistDetails

