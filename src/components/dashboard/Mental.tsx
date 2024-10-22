import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Line, LineChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Brain } from "lucide-react";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartTooltip,
} from "@/components/ui/chart";

interface MentalWellnessCardProps {
  mentalHealthData: Array<{ day: string; score: number }>;
  hoveredCard: string | null;
  setHoveredCard: React.Dispatch<
    React.SetStateAction<
      null | "recentlyPlayed" | "mood" | "mentalWellness" | "recommendations"
    >
  >;
}

const MentalWellnessCard: React.FC<MentalWellnessCardProps> = ({
  mentalHealthData,
  hoveredCard,
  setHoveredCard,
}) => {
  return (
    <Card
      className={`col-span-1 bg-[#220F33] text-white transition-all duration-300 ease-in-out ${
        hoveredCard === "mentalWellness" ? "shadow-lg shadow-purple-500/50" : ""
      }`}
      onMouseEnter={() => setHoveredCard("mentalWellness")}
      onMouseLeave={() => setHoveredCard(null)}
    >
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center text-[#ffffff]">
          <Brain className="mr-2" />
          Mental Wellness
        </CardTitle>

        <CardDescription className="text-purple-300">
          Your weekly mental health score
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer
          config={{
            score: {
              label: "Wellness Score",
              color: "#9C27B0",
            },
          }}
          className="h-[200px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={mentalHealthData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <XAxis dataKey="day" tick={{ fill: "#9C27B0", fontSize: 12 }} />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: "#9C27B0", fontSize: 12 }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#9C27B0"
                strokeWidth={2}
                dot={{ r: 4, fill: "#9C27B0" }}
                className="animate-draw-line"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default MentalWellnessCard;
