import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Playlist {
  id: string;
  name: string;
  description: string;
  image: string[];
}

interface AcceptPlaylistModalProps {
  playlist: Playlist;
  onClose: (
    playlistName?: string,
    description?: string,
    image?: string
  ) => void;
}

const AcceptPlaylistModal: React.FC<AcceptPlaylistModalProps> = ({
  playlist,
  onClose,
}) => {
  const [playlistName, setPlaylistName] = useState(playlist.name);
  const [description, setDescription] = useState(playlist.description);
  const [image, setImage] = useState(playlist.image);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose(playlistName, description, image[0]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage([reader.result as string]);
      };
      reader.readAsDataURL(file);
    }
  };

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
              <div className="grid grid-cols-2 w-20 aspect-square mb-2 overflow-hidden rounded-md">
                {image.length > 0 ? (
                <div className="relative w-full h-full col-span-2">
                  <img
                  src={image[0]}
                  alt="Playlist cover"
                  className="w-full h-full object-cover"
                  />
                </div>
                ) : (
                playlist.image.slice(0, 4).map((imageUrl, index) => (
                  <div key={index} className="relative w-full h-full">
                  <img
                    src={imageUrl}
                    alt={`${playlist.name} cover ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  </div>
                ))
                )}
              </div>
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
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Save Playlist
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AcceptPlaylistModal;
