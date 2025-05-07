import React from "react";
import { useState } from "react";
import { createOrUpdateEmotionalProfile } from "@/utils/emotional_profile";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Image from "next/image";
import Ripple from "./ui/ripple";
const moodOptions = [
  { label: "Happy", emoji: "😊" },
  { label: "Calm", emoji: "😌" },
  { label: "Neutral", emoji: "😐" },
  { label: "Sad", emoji: "😢" },
  { label: "Anxious", emoji: "😬" },
];

const energyLevels = [
  { label: "High", emoji: "⚡" },
  { label: "Medium", emoji: "🔋" },
  { label: "Low", emoji: "💤" },
];

const musicGoals = [
  "Lift my mood",
  "Help me relax",
  "Increase focus",
  "Match my feelings",
  "Energize me",
];

const moodAlignment = ["Aligns with my mood", "Changes my mood"];

const genres = [
  "Pop",
  "Rock",
  "Hip-hop/Rap",
  "Jazz",
  "Lo-fi/Chill",
  "Classical",
  "Indie/Alternative",
];

const locations = [
  { label: "Home", emoji: "🏠" },
  { label: "Work/School", emoji: "💼" },
  { label: "Outdoors", emoji: "🌲" },
  { label: "Commuting", emoji: "🚗" },
];

const musicEnergy = ["Upbeat (high energy)", "Calm (low energy)"];

export default function MoodLoggerModal({
  isOpen,
  onClose,
  Session,
}: {
  isOpen: boolean;
  onClose: () => void;
  Session: any;
}) {
  const [step, setStep] = useState(1);
  const [currentMood, setCurrentMood] = useState("");
  const [energyLevel, setEnergyLevel] = useState("");
  const [selectedGoal, setSelectedGoal] = useState("");
  const [moodChoice, setMoodChoice] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [musicType, setMusicType] = useState("");
  const [location, setLocation] = useState("");

  const username = Session?.user?.name;

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres((prev) => {
      if (prev.includes(genre)) {
        return prev.filter((g) => g !== genre);
      }
      if (prev.length < 3) {
        return [...prev, genre];
      }
      return prev;
    });
  };

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  function calculateMoodScore(data: any) {
    const { mood, energy, goal, alignment, location, musicEnergy } = data;

    // Define scoring weights
    const moodWeights: { [key: string]: number } = {
      Happy: 8,
      Calm: 6,
      Neutral: 5,
      Sad: 2,
      Anxious: 3,
    };

    const energyWeights: { [key: string]: number } = {
      High: 2,
      Medium: 1,
      Low: -1,
    };

    const goalWeights: { [key: string]: number } = {
      "Lift my mood": 2,
      "Help me relax": 1,
      "Increase focus": 1,
      "Match my feelings": 0,
      "Energize me": 2,
    };

    const alignmentWeights: { [key: string]: number } = {
      "Aligns with my mood": 0,
      "Changes my mood": 1,
    };

    const locationWeights: { [key: string]: number } = {
      Home: 0,
      "Work/School": -1,
      Outdoors: 1,
      Commuting: -1,
    };

    const musicEnergyWeights: { [key: string]: number } = {
      Upbeat: 2,
      Calm: -1,
    };

    // Calculate the mood score based on weights
    let moodScore = moodWeights[mood] || 5; // Base mood score
    moodScore += energyWeights[energy] || 0;
    moodScore += goalWeights[goal] || 0;
    moodScore += alignmentWeights[alignment] || 0;
    moodScore += locationWeights[location] || 0;
    moodScore += musicEnergyWeights[musicEnergy] || 0;

    // Clamp score to a range of 1-10
    return Math.max(1, Math.min(10, moodScore));
  }

  function getEmotionalColor(data: any) {
    const { mood, energy, musicEnergy } = data;

    // Base colors for each parameter
    const moodColors: { [key: string]: string } = {
      Happy: "#FFD700", // Gold
      Calm: "#ADD8E6", // Light Blue
      Neutral: "#808080", // Gray
      Sad: "#0000FF", // Blue
      Anxious: "#551A8B", // Dark Purple
    };

    const energyColors: { [key: string]: string } = {
      High: "#FF4500", // Red
      Medium: "#FFA500", // Orange
      Low: "#FFFFE0", // Light Yellow
    };

    const musicEnergyColors: { [key: string]: string } = {
      Upbeat: "#32CD32", // Green
      Calm: "#800080", // Purple
    };

    // Function to blend colors based on the hex color codes
    function blendColors(
      color1: string,
      color2: string,
      ratio: number
    ): string {
      const hex = (color: string) => parseInt(color.slice(1), 16);
      const r = (color: number) => (color >> 16) & 0xff;
      const g = (color: number) => (color >> 8) & 0xff;
      const b = (color: number) => color & 0xff;

      const c1 = hex(color1);
      const c2 = hex(color2);

      const rBlend = Math.round(r(c1) * (1 - ratio) + r(c2) * ratio);
      const gBlend = Math.round(g(c1) * (1 - ratio) + g(c2) * ratio);
      const bBlend = Math.round(b(c1) * (1 - ratio) + b(c2) * ratio);

      return `#${((1 << 24) + (rBlend << 16) + (gBlend << 8) + bBlend)
        .toString(16)
        .slice(1)
        .toUpperCase()}`;
    }

    // Priority blend: mood > energy > musicEnergy
    const moodColor = moodColors[mood] || "#808080"; // Default to gray
    const energyColor = energyColors[energy] || "#FFFFFF";
    const musicEnergyColor = musicEnergyColors[musicEnergy] || "#FFFFFF";

    // Blend mood with energy, then blend with music energy for final color
    const blendedMoodEnergy = blendColors(moodColor, energyColor, 0.6);
    const finalColor = blendColors(blendedMoodEnergy, musicEnergyColor, 0.3);

    return finalColor;
  }

  const handleDone = async () => {
    try {
      const preferences = {
        mood: currentMood,
        energy: energyLevel,
        goal: selectedGoal,
        moodAlignment: moodChoice,
        genres: selectedGenres,
        musicEnergy: musicType,
        location,
      };

      const emotionalData = {
        preferences,
        mentalWellness: {
          dailyEntries: [
            {
              date: new Date().toISOString().split("T")[0],
              moodScore: calculateMoodScore(preferences),
              mood: currentMood,
              energy: energyLevel,
              color: getEmotionalColor(preferences),
            },
          ],
        },
      };

      const result = await createOrUpdateEmotionalProfile(
        Session.id,
        emotionalData
      );
      console.log("Emotional profile result:", result);
      onClose();
    } catch (error) {
      console.error("Error creating or updating emotional profile:", error);
    }
  };

  const [showAlert, setShowAlert] = useState(false);

  function handleShowAlert() {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000); // Hide after 3 seconds
  }

  // Add this right before the return statement
  const alertComponent = showAlert && (
    <Alert className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-500 text-white w-[90%] sm:w-[400px] md:w-[500px]">
      <AlertTitle className="text-sm sm:text-base">Heads up!</AlertTitle>
      <AlertDescription className="text-xs sm:text-sm">
        Please complete the current step before proceeding.
      </AlertDescription>
    </Alert>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[600px] bg-black text-white"
        aria-describedby="dialog-description"
      >
        <p id="dialog-description">This dialog helps you log your mood and preferences.</p>
      </DialogContent>
      <DialogContent
        className="sm:max-w-[600px] bg-[#2A1541] text-white"
        aria-describedby="dialog-description"
      >
        <DialogHeader>
          {alertComponent}
          <DialogTitle className="text-center text-xl font-semibold text-purple-300">
            {step === 2 && "Mood and Energy"}
            {step === 3 && "Music Goals"}
            {step === 4 && "Music Style Preferences"}
            {step === 5 && "Listening Context"}
          </DialogTitle>
        </DialogHeader>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="mt-4 space-y-6 flex flex-col items-center"
          >
            {step === 1 && (
              <div className="space-y-6 text-center">
                <motion.div
                  className="relative mb-6 flex justify-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {/* Ripple Effect behind the Image */}
                  <Ripple
                    className="absolute inset-0"
                    mainCircleSize={10}
                    numCircles={6}
                  />

                  {/* Centered Image */}
                  <Image
                    src="/mello-motion-logo.png"
                    alt="Mello Motion Logo"
                    width={300}
                    height={300}
                    className="bg-transparent relative z-10"
                  />
                </motion.div>
                <h3 className="text-3xl font-extrabold text-purple-300 mb-4">
                  Welcome!
                </h3>
                <p className="text-gray-400 mb-6">
                  Hi {username},
                  {
                    "We're excited to have you here! Let's begin by understanding your current mood."
                  }
                </p>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg text-purple-300">
                    How are you feeling right now?
                  </h3>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {moodOptions.map(({ label, emoji }) => (
                      <Button
                        key={label}
                        variant="outline"
                        className={cn(
                          "bg-[#2A1541] text-purple-300 border-purple-600 hover:bg-purple-600 hover:text-white",
                          currentMood === label && "bg-purple-600 text-white"
                        )}
                        onClick={() => setCurrentMood(label)}
                      >
                        {emoji} {label}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg text-purple-300">
                    How is your energy level?
                  </h3>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {energyLevels.map(({ label, emoji }) => (
                      <Button
                        key={label}
                        variant="outline"
                        className={cn(
                          "bg-[#2A1541] text-purple-300 border-purple-600 hover:bg-purple-600 hover:text-white",
                          energyLevel === label && "bg-purple-600 text-white"
                        )}
                        onClick={() => setEnergyLevel(label)}
                      >
                        {emoji} {label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg text-purple-300">
                    What do you want the music to do for you?
                  </h3>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {musicGoals.map((goal) => (
                      <Button
                        key={goal}
                        variant="outline"
                        className={cn(
                          "bg-[#2A1541] text-purple-300 border-purple-600 hover:bg-purple-600 hover:text-white",
                          selectedGoal === goal && "bg-purple-600 text-white"
                        )}
                        onClick={() => setSelectedGoal(goal)}
                      >
                        {goal}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg text-purple-300">
                    Are you looking for music that...
                  </h3>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {moodAlignment.map((choice) => (
                      <Button
                        key={choice}
                        variant="outline"
                        className={cn(
                          "bg-[#2A1541] text-purple-300 border-purple-600 hover:bg-purple-600 hover:text-white",
                          moodChoice === choice && "bg-purple-600 text-white"
                        )}
                        onClick={() => setMoodChoice(choice)}
                      >
                        {choice}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg text-purple-300">
                    Pick a few genres you're in the mood for (up to 3)
                  </h3>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {genres.map((genre) => (
                      <Button
                        key={genre}
                        variant="outline"
                        className={cn(
                          "bg-[#2A1541] text-purple-300 border-purple-600 hover:bg-purple-600 hover:text-white",
                          selectedGenres.includes(genre) &&
                            "bg-purple-600 text-white"
                        )}
                        onClick={() => handleGenreToggle(genre)}
                      >
                        {genre}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg text-purple-300">
                    Do you want upbeat or calm music?
                  </h3>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {musicEnergy.map((type) => (
                      <Button
                        key={type}
                        variant="outline"
                        className={cn(
                          "bg-[#2A1541] text-purple-300 border-purple-600 hover:bg-purple-600 hover:text-white",
                          musicType === type && "bg-purple-600 text-white"
                        )}
                        onClick={() => setMusicType(type)}
                      >
                        {type}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-2">
                <h3 className="text-lg text-purple-300">
                  Where are you right now?
                </h3>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {locations.map(({ label, emoji }) => (
                    <Button
                      key={label}
                      variant="outline"
                      className={cn(
                        "bg-[#2A1541] text-purple-300 border-purple-600 hover:bg-purple-600 hover:text-white",
                        location === label && "bg-purple-600 text-white"
                      )}
                      onClick={() => setLocation(label)}
                    >
                      {emoji} {label}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-6">
          {step > 1 && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={handleBack}
                className="bg-[#2A1541] text-purple-300 border-purple-600 hover:bg-purple-600 hover:text-white"
              >
                Back
              </Button>
            </motion.div>
          )}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="ml-auto"
          >
            <Button
              onClick={() => {
                if ((step === 2 && currentMood && energyLevel) || step === 1)
                  handleNext();
                else if (step === 3 && selectedGoal && moodChoice) handleNext();
                else if (
                  step === 4 &&
                  selectedGenres.length > 0 &&
                  musicType
                )
                  handleNext();
                else if (step === 5 && location) handleDone();
                else handleShowAlert();
              }}
              className="bg-purple-600 text-white hover:bg-purple-700"
            >
              {step < 4 ? "Next" : "Done"}
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
