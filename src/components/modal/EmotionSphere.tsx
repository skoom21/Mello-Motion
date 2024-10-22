
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
interface AnimatedMoodFlowerProps {
  mood: number
}

const EmotionalSphere: React.FC<AnimatedMoodFlowerProps> = ({ mood }) => {
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
                          values="1;1.2;1"
                          dur="2s"
                          repeatCount="indefinite"
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
                                      values="1;1.2;1"
                                      dur="2s"
                                      repeatCount="indefinite"
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
                                      values="1;1.2;1"
                                      dur="2s"
                                      repeatCount="indefinite"
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

          <AnimatePresence mode = 'wait'>
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


export default EmotionalSphere;