import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { BarChart2 } from "lucide-react";
import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface MoodCardProps {
  hoveredCard: string | null;
  setHoveredCard: React.Dispatch<
    React.SetStateAction<
      null | "recentlyPlayed" | "mood" | "mentalWellness" | "recommendations"
    >
  >;
  moodData: Array<{ time: string; mood: number }>;
}

const MoodCard: React.FC<MoodCardProps> = ({
  hoveredCard,
  setHoveredCard,
  moodData,
}) => {
  return (
    <Card
      className={`col-span-1 bg-[#220F33] text-white transition-all duration-300 ease-in-out ${
        hoveredCard === "mood" ? "shadow-lg shadow-purple-500/50" : ""
      }`}
      onMouseEnter={() => setHoveredCard("mood")}
      onMouseLeave={() => setHoveredCard(null)}
    >
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center text-[#ffffff]">
          <BarChart2 className="mr-2" /> Today's Mood
        </CardTitle>
        <CardDescription className="text-purple-300">
          How you've been feeling throughout the day
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer
          config={{
            mood: {
              label: "Mood",
              color: "#ffffff",
            },
          }}
          className="h-[200px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={moodData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <XAxis dataKey="time" tick={{ fill: "#FFFFFFF", fontSize: 12 }} />
              <YAxis
                domain={[0, 10]}
                tick={{ fill: "#FFFFFF", fontSize: 12 }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="mood" fill="#d8b4fe" radius={[4, 4, 0, 0]}>
                {moodData.map((entry, index) => (
                  <g key={`cell-${index}`}>
                    <rect
                      x={`${index * 25}%`}
                      y={0}
                      width="100%"
                      height={0}
                      fill="#220F33"
                      className="animate-grow-bar"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    />
                  </g>
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default MoodCard;
