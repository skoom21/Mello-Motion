import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; // Adjust the import according to your UI library
import { Music } from "lucide-react"; // Adjust the import according to your icon library
import { useSession } from "next-auth/react";
import { getRecentlyPlayedTracks } from "@/utils/getrecent";
import { Skeleton } from "@/components/ui/skeleton"; // Import the Skeleton component
import { Dialog, DialogContent } from "@/components/ui/dialog";

const RecentlyPlayedCard = () => {
  const { data: session, status } = useSession();
  const [recentlyPlayedTracks, setRecentlyPlayedTracks] = useState<
    {
      track: {
        album: any;
        id: string;
        name: string;
        artists: { name: string }[];
      };
    }[]
  >([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [hoveredCard, setHoveredCard] = useState<
    null | "recentlyPlayed" | "mood" | "mentalWellness" | "recommendations"
  >(null);
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<any>(null);

  useEffect(() => {
    const fetchRecentlyPlayed = async () => {
      try {
        const tracks = await getRecentlyPlayedTracks(session?.accessToken);
        setRecentlyPlayedTracks(tracks.items); // Adjust based on the structure of the response
      } catch (error) {
        console.error("Error fetching recently played tracks:", error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchRecentlyPlayed();
  }, [session?.accessToken]);

  const handleTrackClick = (track: any) => {
    setSelectedTrack(track);
  };

  // const renderModal = () => {
  //   if (!selectedTrack) return null;

  //   return (
  //     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300 ease-in-out">
  //       <div
  //         className="bg-[#220F33] p-6 rounded-lg max-w-md w-full transform transition-transform duration-300 ease-in-out"
  //         style={{
  //           transformOrigin: "center",
  //           transform: selectedTrack ? "scale(1)" : "scale(0.95)",
  //           opacity: selectedTrack ? 1 : 0,
  //         }}
  //       >
  //         <div className="flex items-center space-x-4 mb-4">
  //           <div className="relative">
  //             <img
  //               src={selectedTrack.track.album.images[0].url}
  //               alt={selectedTrack.track.name}
  //               className="h-16 w-16 rounded-lg transition-transform duration-300 ease-in-out transform hover:scale-105"
  //               style={{
  //                 boxShadow: `0 0 15px ${selectedTrack.track.album.images[0].url}`,
  //               }}
  //             />
  //             <div
  //               className="absolute inset-0 rounded-lg transition-opacity duration-300 ease-in-out opacity-0 hover:opacity-100"
  //               style={{
  //                 background: `linear-gradient(45deg, rgba(0,0,0,0.5), ${selectedTrack.track.album.images[0].url})`,
  //               }}
  //             ></div>
  //           </div>
  //           <div>
  //             <h2 className="text-xl text-white font-bold animate-pulse">
  //               {selectedTrack.track.name}
  //             </h2>
  //             <p className="text-sm text-purple-300">
  //               <strong>Album:</strong> {selectedTrack.track.album.name}
  //             </p>
  //             <p className="text-sm text-purple-300">
  //               <strong>Artists:</strong>{" "}
  //               {selectedTrack.track.artists
  //                 .map((artist: any, index: any) => (
  //                   <a
  //                     key={`${artist.name}-${index}`}
  //                     href={`https://www.google.com/search?q=${artist.name}`}
  //                     target="_blank"
  //                     rel="noopener noreferrer"
  //                     className="hover:underline"
  //                   >
  //                     {artist.name}
  //                   </a>
  //                 ))
  //                 .reduce((prev: any, curr: any) => [prev, ", ", curr])}
  //             </p>
  //             <p className="text-sm text-purple-300">
  //               <strong>Track ID:</strong> {selectedTrack.track.id}
  //             </p>
  //           </div>
  //         </div>
  //         <button
  //           className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded hover:from-purple-600 hover:to-pink-600 transition-colors duration-200"
  //           onClick={() => setSelectedTrack(null)}
  //         >
  //           Close
  //         </button>
  //       </div>
  //     </div>
  //   );
  // };

  return (
    <>
      <Card
        className={`col-span-1 row-span-2 bg-[#220F33] text-white transition-all duration-300 ease-in-out ${
          hoveredCard === "recentlyPlayed"
            ? "shadow-lg shadow-purple-500/50"
            : ""
        }`}
        onMouseEnter={() => setHoveredCard("recentlyPlayed")}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-bold">Recently Played</CardTitle>
          <Music className="h-5 w-5" />
        </CardHeader>
        <CardContent>
          <div
            className={`space-y-4 ${
              recentlyPlayedTracks.length > 4 ? "max-h-64 overflow-y-auto" : ""
            } custom-scrollbar`}
          >
            {loading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Skeleton className="h-12 w-12 rounded-full bg-gray-300" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4 bg-gray-300" />
                      <Skeleton className="h-4 w-1/2 bg-gray-300" />
                    </div>
                  </div>
                ))
              : recentlyPlayedTracks.map((track, index) => (
                  <div
                    key={`${track.track.id}-${index}`}
                    className="flex items-center space-x-3 group hover:bg-purple-500/20 transition-colors duration-200 rounded-lg cursor-pointer"
                    onClick={() => handleTrackClick(track)}
                  >
                    <img
                      src={track.track.album.images[0].url}
                      alt={track.track.name}
                      className="h-12 w-12 rounded-full flex-shrink-0"
                    />
                    <div className="overflow-hidden">
                      <div className="font-medium truncate group-hover:text-purple-300 transition-colors duration-200">
                        {track.track.name}
                      </div>
                      <div className="text-sm text-purple-300 truncate">
                        {track.track.artists
                          .map((artist) => artist.name)
                          .join(", ")}
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </CardContent>
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #9c27b0;
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: #7b1fa2;
          }
        `}</style>
      </Card>
      {selectedTrack && (
        <Dialog open={!!selectedTrack} onOpenChange={() => setSelectedTrack(null)}>
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300 ease-in-out">
            <div
              className="bg-[#220F33] p-6 rounded-lg max-w-md w-full transform transition-transform duration-300 ease-in-out"
              style={{
                transformOrigin: "center",
                transform: selectedTrack ? "scale(1)" : "scale(0.95)",
                opacity: selectedTrack ? 1 : 0,
              }}
            >
              <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-purple-900 to-black text-white">
                <div className="space-y-4">
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden transition-transform duration-300 ease-in-out transform hover:scale-105">
                    <img
                      src={selectedTrack.track.album.images[0].url}
                      alt={selectedTrack.track.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="text-2xl font-bold">
                    {selectedTrack.track.name}
                  </h2>
                  <strong>Artists:</strong>{" "}
                  {selectedTrack.track.artists
                    .map((artist: any, index: any) => (
                      <a
                        key={`${artist.name}-${index}`}
                        href={`https://www.google.com/search?q=${artist.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {artist.name}
                      </a>
                    ))
                    .reduce((prev: any, curr: any) => [prev, ", ", curr])}{" "}
                  <p className="text-sm ">
                  <strong>Track ID:</strong>{" "}
                  {selectedTrack.track.id}
                  </p>
                </div>
              </DialogContent>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
};

export default RecentlyPlayedCard;
