import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import EmotionalSphere from './EmotionSphere'; // Import your WebGL sphere component
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface WelcomeMoodModalProps {
  userName: string;
  step: number;
  open: boolean;
  onClose: () => void;
  onNext: () => void;
}

export default function WelcomeMoodModal({
  userName,
  step,
  open,
  onClose,
  onNext,
}: WelcomeMoodModalProps) {
  // States for the mood questionnaire
  const [mood, setMood] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [stress, setStress] = useState(3);
  const [social, setSocial] = useState(3);
  const [focus, setFocus] = useState(3);

  const handleMoodChange = (val: number[]) => {
    setMood(val[0]); // Update mood with slider value
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-[#2A1541] text-white">
        {step === 1 ? (
          <div className="welcome-section text-center">
            <DialogHeader>
              <DialogTitle className="text-3xl font-extrabold mb-4">Welcome, {userName}!</DialogTitle>
              <DialogDescription className="text-gray-400 mb-6">
                We're excited to have you here! Let's begin by understanding your current mood.
              </DialogDescription>
            </DialogHeader>
            <button
              onClick={onNext}
              className="px-6 py-3 bg-gradient-to-r from-indigo-700 to-purple-700 text-white rounded-full hover:bg-purple-800"
            >
              Next
            </button>
          </div>
        ) : (
          <div className="mood-questionnaire">
            <DialogHeader>
              <DialogTitle className="text-3xl font-extrabold mb-4">Mood Assessment</DialogTitle>
              <DialogDescription className="text-gray-400 mb-4">
                Adjust the sliders to reflect your current state.
              </DialogDescription>
            </DialogHeader>

            {/* EmotionalSphere Component */}
            <div className="flex justify-center mb-6">
              {/* Passing the mood state to the EmotionalSphere component */}
              <EmotionalSphere mood={mood} /> {/* WebGL 3D Sphere that reflects the mood */}
            </div>

            {/* Current Mood */}
            <div className="question mt-4">
              <h3 className="text-lg font-semibold">1. Current Mood</h3>
              <Slider
                value={[mood]}
                onValueChange={(val) => handleMoodChange(val)} // Update mood state when slider moves
                max={5}
                min={1}
                step={1}
                className="w-full"
              />
              <p className="text-sm mt-2">Your mood: {mood}</p>
            </div>

            {/* Energy Level */}
            <div className="question mt-4">
              <h3 className="text-lg font-semibold">2. Energy Level</h3>
              <Slider
                value={[energy]}
                onValueChange={(val) => setEnergy(val[0])}
                max={5}
                min={1}
                step={1}
                className="w-full"
              />
              <p className="text-sm mt-2">Your energy level: {energy}</p>
            </div>

            {/* Stress Level */}
            <div className="question mt-4">
              <h3 className="text-lg font-semibold">3. Stress Level</h3>
              <Slider
                value={[stress]}
                onValueChange={(val) => setStress(val[0])}
                max={5}
                min={1}
                step={1}
                className="w-full"
              />
              <p className="text-sm mt-2">Your stress level: {stress}</p>
            </div>

            {/* Social Mood */}
            <div className="question mt-4">
              <h3 className="text-lg font-semibold">4. Social Mood</h3>
              <Slider
                value={[social]}
                onValueChange={(val) => setSocial(val[0])}
                max={5}
                min={1}
                step={1}
                className="w-full"
              />
              <p className="text-sm mt-2">Your social mood: {social}</p>
            </div>

            {/* Focus Level */}
            <div className="question mt-4">
              <h3 className="text-lg font-semibold">5. Focus Level</h3>
              <Slider
                value={[focus]}
                onValueChange={(val) => setFocus(val[0])}
                max={5}
                min={1}
                step={1}
                className="w-full"
              />
              <p className="text-sm mt-2">Your focus level: {focus}</p>
            </div>

            <button
              onClick={onNext}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-indigo-700 to-purple-700 text-white rounded-full hover:bg-purple-800"
            >
              Finish
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
