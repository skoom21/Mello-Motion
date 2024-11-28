import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface Playlist {
  id: string
  name: string
  description: string
  image: string
}

interface AcceptPlaylistModalProps {
  playlist: Playlist
  onClose: (playlistName?: string, description?: string, image?: string) => void
}

const AcceptPlaylistModal: React.FC<AcceptPlaylistModalProps> = ({ playlist, onClose }) => {
  const [playlistName, setPlaylistName] = useState(playlist.name)
  const [description, setDescription] = useState(playlist.description)
  const [image, setImage] = useState(playlist.image)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onClose(playlistName, description, image)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-[#2A1541] text-purple-200">
        <DialogHeader>
          <DialogTitle>Save Playlist</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="playlistName" className="text-right">
                Name
              </Label>
              <Input
                id="playlistName"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                className="col-span-3 bg-[#3A1F5A] border-purple-700 text-purple-200"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3 bg-[#3A1F5A] border-purple-700 text-purple-200"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Image
              </Label>
              <div className="col-span-3">
                <img src={image} alt="Playlist cover" className="w-24 h-24 object-cover rounded-md mb-2" />
                <Input
                  id="image"
                  type="file"
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="bg-[#3A1F5A] border-purple-700 text-purple-200"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">Save Playlist</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AcceptPlaylistModal

