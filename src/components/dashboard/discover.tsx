'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { Search, Music, Mic, Disc, Users, Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { Skeleton } from "@/components/ui/skeleton"

// Mock function to fetch discover data
const fetchDiscoverData = async (type: string) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  return Array(8).fill(null).map((_, i) => ({
    id: `${type}-${i}`,
    name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${i + 1}`,
    description: `This is a ${type} description`,
    image: `/placeholder.svg?height=100&width=100&text=${type}`,
  }))
}

interface DiscoverItem {
  id: string
  name: string
  description: string
  image: string
}

const DiscoverCarousel: React.FC<{ items: DiscoverItem[], type: string }> = ({ items, type }) => (
  <Carousel opts={{ align: "start", loop: true }} className="w-full">
    <CarouselContent>
      {items.map((item) => (
        <CarouselItem key={item.id} className="basis-full sm:basis-1/2 lg:basis-1/4">
          <div className="p-1">
            <Card className="bg-[#2A1541] border-purple-700 cursor-pointer hover:bg-[#3A1F5A]">
              <CardContent className="flex flex-col items-center p-4">
                <div className="w-full aspect-square mb-2 overflow-hidden rounded-md">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-medium text-lg mb-1 text-purple-200 text-center">
                  {item.name}
                </h3>
                <p className="text-sm text-purple-300 text-center line-clamp-2">
                  {item.description}
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
)

const Discover: React.FC = () => {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState('songs')
  const [discoverData, setDiscoverData] = useState<Record<string, DiscoverItem[]>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        if (session?.accessToken) {
          const data = await fetchDiscoverData(activeTab)
          setDiscoverData(prev => ({ ...prev, [activeTab]: data }))
        }
      } catch (error) {
        console.error(`Error fetching ${activeTab}:`, error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [session?.accessToken, activeTab])

  return (
    <Card className="col-span-1 sm:col-span-2 lg:col-span-3 bg-[#220F33] text-white">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center text-[#ffffff]">
          <Search className="mr-2" /> Discover New Music
        </CardTitle>
        <CardDescription className="text-purple-300">
          Explore new songs, artists, albums, and playlists
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-[#2A1541]">
            <TabsTrigger value="songs" className="text-purple-300 data-[state=active]:bg-[#3A1F5A]">
              <Music className="mr-2 h-4 w-4" /> Songs
            </TabsTrigger>
            <TabsTrigger value="artists" className="text-purple-300 data-[state=active]:bg-[#3A1F5A]">
              <Mic className="mr-2 h-4 w-4" /> Artists
            </TabsTrigger>
            <TabsTrigger value="albums" className="text-purple-300 data-[state=active]:bg-[#3A1F5A]">
              <Disc className="mr-2 h-4 w-4" /> Albums
            </TabsTrigger>
            <TabsTrigger value="playlists" className="text-purple-300 data-[state=active]:bg-[#3A1F5A]">
              <Users className="mr-2 h-4 w-4" /> Playlists
            </TabsTrigger>
          </TabsList>
          {['songs', 'artists', 'albums', 'playlists'].map((tab) => (
            <TabsContent key={tab} value={tab}>
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                </div>
              ) : discoverData[tab] ? (
                <DiscoverCarousel items={discoverData[tab]} type={tab} />
              ) : (
                <p className="text-center text-purple-300">No {tab} found</p>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default Discover

