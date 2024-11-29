'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Search, Plus, MoreVertical, Edit, Trash, Music, ChevronDown } from 'lucide-react'
import { useSession } from 'next-auth/react'

// Mock API functions
const fetchPlaylists = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  return Array(10).fill(null).map((_, i) => ({
    id: `playlist-${i}`,
    name: `My Playlist ${i + 1}`,
    description: `A collection of great tracks ${i + 1}`,
    trackCount: Math.floor(Math.random() * 50) + 1,
    image: `/placeholder.svg?height=100&width=100&text=Playlist${i + 1}`,
  }))
}

const createPlaylist = async (name: string, description: string) => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    id: `playlist-${Date.now()}`,
    name,
    description,
    trackCount: 0,
    image: `/placeholder.svg?height=100&width=100&text=${name}`,
  }
}

const deletePlaylist = async (id: string) => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  return true
}

interface Playlist {
  id: string
  name: string
  description: string
  trackCount: number
  image: string
}

const PlaylistCard: React.FC<{ playlist: Playlist; onDelete: (id: string) => void }> = ({ playlist, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false)
  const { toast } = useToast()

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="bg-[#2A1541] border-purple-700 overflow-hidden">
        <CardContent className="p-0">
          <div className="relative">
            <img
              src={playlist.image}
              alt={playlist.name}
              className="w-full h-40 object-cover"
            />
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                >
                  <Button variant="secondary" className="text-purple-300">
                    <Music className="mr-2 h-4 w-4" /> Play
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="p-4">
            <h3 className="font-medium text-lg mb-1 text-purple-200">{playlist.name}</h3>
            <p className="text-sm text-purple-300 mb-2">{playlist.trackCount} tracks</p>
            <p className="text-sm text-purple-400 line-clamp-2">{playlist.description}</p>
          </div>
        </CardContent>
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4 text-purple-300" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#2A1541] border-purple-700">
              <DropdownMenuItem className="text-purple-300 focus:text-purple-100 focus:bg-[#3A1F5A]">
                <Edit className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-400 focus:text-red-200 focus:bg-[#3A1F5A]"
                onClick={() => {
                  onDelete(playlist.id)
                  toast({
                    title: "Playlist deleted",
                    description: `"${playlist.name}" has been removed.`,
                  })
                }}
              >
                <Trash className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>
    </motion.div>
  )
}

const CreatePlaylistDialog: React.FC<{ onCreatePlaylist: (name: string, description: string) => void }> = ({ onCreatePlaylist }) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const handleCreate = () => {
    onCreatePlaylist(name, description)
    setName('')
    setDescription('')
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-purple-600 text-white hover:bg-purple-700">
          <Plus className="mr-2 h-4 w-4" /> Create Playlist
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#2A1541] border-purple-700 text-purple-100">
        <DialogHeader>
          <DialogTitle>Create New Playlist</DialogTitle>
          <DialogDescription className="text-purple-300">
            Give your playlist a name and description.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder="Playlist Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-[#3A1F5A] border-purple-600 text-purple-100 placeholder-purple-400"
          />
          <Input
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-[#3A1F5A] border-purple-600 text-purple-100 placeholder-purple-400"
          />
        </div>
        <DialogFooter>
          <Button onClick={handleCreate} disabled={!name} className="bg-purple-600 text-white hover:bg-purple-700">
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const Playlists: React.FC = () => {
  const { data: session } = useSession()
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  useEffect(() => {
    const loadPlaylists = async () => {
      setLoading(true)
      try {
        if (session?.accessToken) {
          const data = await fetchPlaylists()
          setPlaylists(data)
        }
      } catch (error) {
        console.error("Error fetching playlists:", error)
      } finally {
        setLoading(false)
      }
    }

    loadPlaylists()
  }, [session?.accessToken])

  const handleCreatePlaylist = async (name: string, description: string) => {
    try {
      const newPlaylist = await createPlaylist(name, description)
      setPlaylists([newPlaylist, ...playlists])
    } catch (error) {
      console.error("Error creating playlist:", error)
    }
  }

  const handleDeletePlaylist = async (id: string) => {
    try {
      await deletePlaylist(id)
      setPlaylists(playlists.filter(playlist => playlist.id !== id))
    } catch (error) {
      console.error("Error deleting playlist:", error)
    }
  }

  const filteredPlaylists = playlists
    .filter(playlist => playlist.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.name.localeCompare(b.name)
      } else {
        return b.name.localeCompare(a.name)
      }
    })

  return (
    <Card className="col-span-1 sm:col-span-2 lg:col-span-3 bg-[#220F33] text-white">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center justify-between text-[#ffffff]">
          <span className="flex items-center">
            <Music className="mr-2" /> Your Playlists
          </span>
          <CreatePlaylistDialog onCreatePlaylist={handleCreatePlaylist} />
        </CardTitle>
        <CardDescription className="text-purple-300">
          Browse and manage your music collections
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-4">
          <Search className="text-purple-400" />
          <Input
            placeholder="Search playlists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow bg-[#3A1F5A] border-purple-600 text-purple-100 placeholder-purple-400"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-[#3A1F5A] border-purple-600 text-purple-300">
                Sort <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#2A1541] border-purple-700">
              <DropdownMenuItem onClick={() => setSortOrder('asc')} className="text-purple-300 focus:text-purple-100 focus:bg-[#3A1F5A]">
                A-Z
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder('desc')} className="text-purple-300 focus:text-purple-100 focus:bg-[#3A1F5A]">
                Z-A
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-300px)]">
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {filteredPlaylists.map((playlist) => (
                  <PlaylistCard key={playlist.id} playlist={playlist} onDelete={handleDeletePlaylist} />
                ))}
              </AnimatePresence>
            </motion.div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}

export default Playlists

