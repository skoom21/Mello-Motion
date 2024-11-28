"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Button1 from "@/components/ui/button1";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import Ripple from "@/components/ui/ripple";
import Particles from "@/components/ui/particles";
import VelocityScroll  from "@/components/ui/scroll-based-velocity";

export default function LandingPage() {
  const { data: session, status } = useSession(); // Access session data and authentication status
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // If the user is authenticated, redirect to the dashboard
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const handleSpotifyLogin = () => {
    signIn("spotify", { callbackUrl: "/dashboard" }); // Redirect to the dashboard after login
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0f]"></div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0f]">
      {/* Star background */}
      <div className="absolute inset-0">
        {mounted && (
          //use particles
          <div>
            <Particles />
          </div>
        )}
      </div>

      {/* Purple nebula effect */}
      <div className="absolute inset-0 bg-gradient-radial from-purple-900/20 to-transparent opacity-30" />

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12 flex flex-col items-center"
        >
        
          <motion.div
            className="relative mb-6"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {/* Ripple Effect behind the Image */}
            <Ripple className="absolute inset-0 " mainCircleSize={50} />

            {/* Centered Image */}
            <Image
              src="/mello-motion-logo.png"
              alt="Mello Motion Logo"
              width={300}
              height={300}
              className="bg-transparent relative z-10"
            />
          </motion.div>
          <motion.h1
            className="text-8xl font-bold text-white mb-6"
            animate={{
              textShadow: [
                "0 0 4px #fff",
                "0 0 11px #fff",
                "0 0 19px #fff",
                "0 0 40px #bc13fe",
                "0 0 80px #bc13fe",
                "0 0 90px #bc13fe",
                "0 0 100px #bc13fe",
                "0 0 150px #bc13fe",
              ],
            }}
          >
            Mello-Motion
          </motion.h1>
          <motion.p
            className="text-2xl text-purple-200/80"
            whileHover={{ scale: 1.1, color: "#ffffff" }}
          >
            Your mood, your music
          </motion.p>
        </motion.div>

        <AnimatePresence>
          {mounted && status !== "authenticated" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button1 onClick={handleSpotifyLogin}></Button1>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
