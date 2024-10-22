"use client";

import { useEffect, useState } from "react";
import { Music, BarChart2, Brain, Headphones, Play, Pause } from "lucide-react";

import { Button } from "@/components/ui/button";

import RecentlyPlayedCard from "./dashboard/RecentlyPlayedCard";
import MentalWellnessCard from "./dashboard/Mental";
import MoodCard from "./dashboard/Mood";
import Playlist from "./dashboard/playlists";

const moodData = [
  { time: "Morning", mood: 6 },
  { time: "Afternoon", mood: 8 },
  { time: "Evening", mood: 7 },
  { time: "Night", mood: 9 },
];

const mentalHealthData = [
  { day: "Mon", score: 65 },
  { day: "Tue", score: 70 },
  { day: "Wed", score: 68 },
  { day: "Thu", score: 72 },
  { day: "Fri", score: 75 },
  { day: "Sat", score: 80 },
  { day: "Sun", score: 78 },
];

export function Widget() {
  const [hoveredCard, setHoveredCard] = useState<
    null | "recentlyPlayed" | "mood" | "mentalWellness" | "recommendations"
  >(null);

  return (
    <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
      <RecentlyPlayedCard></RecentlyPlayedCard>
      <MoodCard
        hoveredCard={hoveredCard}
        setHoveredCard={setHoveredCard}
        moodData={moodData}
      ></MoodCard>
      <MentalWellnessCard
        mentalHealthData={mentalHealthData}
        hoveredCard={hoveredCard}
        setHoveredCard={setHoveredCard}
      ></MentalWellnessCard>
      <Playlist
        hoveredCard={hoveredCard}
        setHoveredCard={setHoveredCard}
      ></Playlist>
    </div>
  );
}
