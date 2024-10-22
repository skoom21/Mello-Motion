"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

const emotions = [
  "Angry", "Anxious", "Ashamed", "Disappointed", "Discouraged", "Disgusted",
  "Embarrassed", "Frustrated", "Guilty", "Helpless", "Hopeless", "Irritated",
  "Jealous", "Lonely", "Sad", "Scared", "Stressed", "Surprised", "Worried"
]

const impactCategories = [
  "Community", "Current Events", "Dating", "Education", "Family", "Fitness",
  "Friends", "Health", "Hobbies", "Identity", "Money", "Partner", "Self-care",
  "Sexuality", "Tasks", "Travel", "Work"
]

export default function MoodLoggerModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1)
  const [mood, setMood] = useState(50)
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const handleMoodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMood(Number(event.target.value))
  }

  const handleEmotionToggle = (emotion: string) => {
    setSelectedEmotions(prev => 
      prev.includes(emotion) ? prev.filter(e => e !== emotion) : [...prev, emotion]
    )
  }

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    )
  }

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleDone = () => {
    console.log("Mood logged:", { mood, selectedEmotions, selectedCategories })
    onClose()
  }

  const getMoodText = (value: number) => {
    if (value < 25) return "Very Unpleasant"
    if (value < 50) return "Slightly Unpleasant"
    if (value < 75) return "Slightly Pleasant"
    return "Very Pleasant"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-[#2A1541] text-white">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold text-purple-300">
            {step === 1 && "Welcome to Mello-Motion"}
            {step === 2 && "Choose how you're feeling right now"}
            {step === 3 && "What best describes this feeling?"}
            {step === 4 && "What's having the biggest impact on you?"}
          </DialogTitle>
        </DialogHeader>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="mt-4"
          >
            {step === 1 && (
              <div className="space-y-6 text-center">
                <div className="relative w-40 h-40 mx-auto">
                  <img src="/mello-motion-logo.png" alt="Mello-Motion Logo" className="w-full h-full object-contain" />
                </div>
                <h2 className="text-2xl font-bold text-purple-300">Welcome to Mello-Motion</h2>
                <p className="text-lg text-purple-200">
                  Your one-stop for mental well-being and the melody to your emotions.
                </p>
                <p className="text-lg text-purple-200">
                  Explore music in a new way, catered towards you.
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4"
                >
                </motion.div>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-6">
                <div className="relative w-80 h-80 mx-auto">
                  <AnimatedMoodFlower mood={mood} />
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={mood}
                  onChange={handleMoodChange}
                  className="w-full appearance-none bg-purple-300 h-3 rounded-full"
                  style={{
                    background: `linear-gradient(to right, #9333EA 0%, #9333EA ${mood}%, #D8B4FE ${mood}%, #D8B4FE 100%)`,
                  }}
                />
                <div className="flex justify-between text-sm text-purple-300">
                  <span>VERY UNPLEASANT</span>
                  <span>VERY PLEASANT</span>
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="grid grid-cols-3 gap-2">
                {emotions.map((emotion) => (
                  <motion.div
                    key={emotion}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full bg-[#2A1541] text-purple-300 border-purple-600 hover:bg-purple-600 hover:text-white transition-colors duration-200",
                        selectedEmotions.includes(emotion) && "bg-purple-600 text-white"
                      )}
                      onClick={() => handleEmotionToggle(emotion)}
                    >
                      {emotion}
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
            {step === 4 && (
              <div className="grid grid-cols-3 gap-2">
                {impactCategories.map((category) => (
                  <motion.div
                    key={category}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full bg-[#2A1541] text-purple-300 border-purple-600 hover:bg-purple-600 hover:text-white transition-colors duration-200",
                        selectedCategories.includes(category) && "bg-purple-600 text-white"
                      )}
                      onClick={() => handleCategoryToggle(category)}
                    >
                      {category}
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-between mt-4">
          {step > 1 && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={handleBack}
                className="bg-[#2A1541] text-purple-300 border-purple-600 hover:bg-purple-600 hover:text-white transition-colors duration-200"
              >
                Back
              </Button>
            </motion.div>
          )}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="ml-auto">
            {step < 3 ? (
              <Button
                onClick={handleNext}
                className="bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-200"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleDone}
                className="bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-200"
              >
                Done
              </Button>
            )}
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface AnimatedMoodFlowerProps {
    mood: number
}

const AnimatedMoodFlower: React.FC<AnimatedMoodFlowerProps> = ({ mood }) => {
    const [rotation, setRotation] = useState(0)

    // Determine stage based on mood
    const getStage = (mood: number) => {
        if (mood < 25) return 1
        if (mood < 50) return 2
        if (mood < 75) return 3
        return 4
    }

    const [stage, setStage] = useState(getStage(mood))

    // Update rotation every 50ms
    useEffect(() => {
        const interval = setInterval(() => {
            setRotation((prev) => (prev + 1) % 360)
        }, 50)
        return () => clearInterval(interval)
    }, [])

    // Update stage when mood changes
    useEffect(() => {
        const newStage = getStage(mood)
        if (newStage !== stage) {
            setStage(newStage)
        }
    }, [mood, stage])

    // Get color based on mood intensity
    const getColor = (intensity: number) => {
        const hue = 270 + mood * 0.6 // 270 (purple) to 330 (pink)
        return `hsla(${hue}, 100%, ${intensity}%, 0.7)`
    }

    // Render flower stages based on the current stage
    const renderStage = (stage: number) => {
        const petalPath = (scale: number) => `M 100 100 C 100 ${60 * scale}, ${130 * scale} ${40 * scale}, 100 ${20 * scale} C ${70 * scale} ${40 * scale}, 100 ${60 * scale}, 100 100 Z`

        switch (stage) {
            case 1:
                return (
                    <circle cx="100" cy="100" r="40" fill="url(#moodGradient)">
                        <animateTransform
                            attributeName="transform"
                            type="scale"
                            values="1;1.1;1"
                            dur="3s"
                            repeatCount="indefinite"
                            keyTimes="0;0.5;1"
                            calcMode="spline"
                            keySplines="0.25 0.1 0.25 1; 0.25 0.1 0.25 1"
                        />
                    </circle>
                )
            case 2:
                return (
                    <g>
                        {[...Array(4)].map((_, i) => (
                            <g key={i} transform={`rotate(${rotation + i * 90}, 100, 100)`}>
                                <path
                                    d={petalPath(1)}
                                    fill="url(#moodGradient)"
                                >
                                    <animateTransform
                                        attributeName="transform"
                                        type="scale"
                                        values="1;1.15;1"
                                        dur="3s"
                                        repeatCount="indefinite"
                                        keyTimes="0;0.5;1"
                                        calcMode="spline"
                                        keySplines="0.25 0.1 0.25 1; 0.25 0.1 0.25 1"
                                    />
                                </path>
                            </g>
                        ))}
                    </g>
                )
            case 3:
                return (
                    <g>
                        {[...Array(6)].map((_, i) => (
                            <g key={i} transform={`rotate(${rotation + i * 60}, 100, 100)`}>
                                <path
                                    d={petalPath(1.3)}
                                    fill="url(#moodGradient)"
                                >
                                    <animateTransform
                                        attributeName="transform"
                                        type="scale"
                                        values="1;1.25;1"
                                        dur="3s"
                                        repeatCount="indefinite"
                                        keyTimes="0;0.5;1"
                                        calcMode="spline"
                                        keySplines="0.25 0.1 0.25 1; 0.25 0.1 0.25 1"
                                    />
                                </path>
                            </g>
                        ))}
                    </g>
                )
            case 4:
                return (
                    <g>
                        {[...Array(8)].map((_, i) => (
                            <g key={i} transform={`rotate(${rotation + i * 45}, 100, 100)`}>
                                <path
                                    d={petalPath(1.5)}
                                    fill="url(#moodGradient)"
                                >
                                    <animateTransform
                                        attributeName="transform"
                                        type="scale"
                                        values="1;1.2;1"
                                        dur="2s"
                                        repeatCount="indefinite"
                                    />
                                </path>
                            </g>
                        ))}
                    </g>
                )
            default:
                return null
        }
    }

    return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
            <defs>
                <radialGradient id="moodGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" stopColor={getColor(50)} />
                    <stop offset="100%" stopColor={getColor(90)} />
                </radialGradient>
            </defs>

            <AnimatePresence mode='wait'>
                <motion.g
                    key={stage}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5 }}
                >
                    {renderStage(stage)}
                </motion.g>
            </AnimatePresence>
        </svg>
    )
}