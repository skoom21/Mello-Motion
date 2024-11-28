"use client";

import { useState, useEffect, SetStateAction } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Sun, Moon, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MenuItem } from "@/components/dashboard/MenuItem";
import { SettingsPopover } from "@/components/dashboard/SettingsPopover";
import { getSession, useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Widget  from "@/components/widget";
import ProfileSection from "@/components/profile-section";
import { createUserInDb } from "@/utils/create"; // The function from above
import MoodLoggerModal from "@/components/Mood-Modal";
import BlurIn from "@/components/ui/blur-in";
import SparklesText from "@/components/ui/sparkles-text";

const menuItems = [
  { id: "Home", title: "Home", icon: "Home" as const },
  { id: "moodMixer", title: "Mood Mixer", icon: "Heart" as const },
  { id: "playlists", title: "My Playlists", icon: "Headphones" as const },
  { id: "discover", title: "Discover", icon: "Radio" as const },
  { id: "create", title: "Create", icon: "Mic" as const },
];

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [activeItem, setActiveItem] = useState(menuItems[0].id);
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [customColor, setCustomColor] = useState("#9C27B0");

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (!session) {
        router.push("/"); // Change to your sign-in page route
      }
    };

    checkSession();
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      if (status === "authenticated") {
        // When the user has successfully logged in with Spotify
        const spotifyUser = session; // This will be the user object returned by NextAuth
        if (spotifyUser) {
          console.log(spotifyUser);
          const user = await createUserInDb(spotifyUser);
          if ((user) == "newuser") {
            // Display the modal component
            // Assuming you have a modal component to show
            setShowModal(true);
          }
        }
      }
    };

    fetchData();
  }, [status]);

  if (showModal) {
    return (
      <MoodLoggerModal isOpen={showModal} onClose={() => setShowModal(false)} Session={session} />
    );
  }

  const renderContent = () => {
    switch (activeItem) {
      case "Home":
        return <Widget />;
      case "moodMixer":
        return <div>Mood Mixer Content</div>;
      case "playlists":
        return <div>My Playlists Content</div>;
      case "discover":
        return <div>Discover Content</div>;
      case "create":
        return <div>Create Content</div>;
      case "profile":
        return <ProfileSection />;
      default:
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const handleColorChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setCustomColor(e.target.value);
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <div
      className={`relative min-h-screen overflow-hidden transition-colors duration-300  ${
        theme === "dark"
          ? "bg-purple-900 to-black text-white"
          : "bg-purple-950 text-gray-900"
      }`}
    >
      <MoodLoggerModal isOpen={showModal} onClose={() => setShowModal(false) } Session={session} />
      <div className="relative z-10 flex h-screen ">
        {/* Sidebar */}
        <motion.aside
          className={`${
            theme === "dark" ? "bg-black bg-opacity-75" : "bg-white/70"
          } backdrop-blur-md flex flex-col`}
          initial={false}
          animate={{
            width: isMenuOpen ? 286 : 80,
            transition: { duration: 0.3, ease: "easeInOut" },
          }}
        >
          <div className="flex items-center mb-4">
            <Image
              src="/mello-motion-logo.png"
              alt="Mello Motion Logo"
              width={100}
              height={100}
              className="mr-2" // Reduced margin-right to make the distance smaller
            />
            {isMenuOpen && (
              <motion.h1
                className="text-2xl font-bold"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                 <SparklesText text="Mello Motion" />
              </motion.h1>
            )}
          </div>

          <nav className="flex-1 px-4">
            {menuItems.map((item) => (
              <MenuItem
                key={item.id}
                item={item}
                isActive={activeItem === item.id}
                customColor={customColor}
                theme={theme}
                isMenuOpen={isMenuOpen}
                onClick={() => setActiveItem(item.id)}
              />
            ))}
          </nav>

          <div className="mt-auto px-4 pb-6">
            <motion.div
              className="flex items-center mb-8"
              initial={false}
              animate={{
                opacity: isMenuOpen ? 1 : 1,
                x: isMenuOpen ? 0 : 0,
                transition: { duration: 0.3, ease: "easeInOut" },
              }}
            >
              {session?.user?.image && (
                <Image
                  src={session.user.image}
                  alt="Profile Picture"
                  width={40}
                  height={40}
                  className="rounded-full mr-4"
                  onClick={() => setActiveItem("profile")} // Change to profile section
                />
              )}
              {isMenuOpen && (
                <motion.h3
                  className="text-xl font-semibold cursor-pointer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
                  onClick={() => setActiveItem("profile")} // Change to profile section
                >
                  {session?.user?.name || "User"}
                </motion.h3>
              )}
            </motion.div>

            <SettingsPopover
              isMenuOpen={isMenuOpen}
              theme={theme}
              customColor={customColor}
              toggleTheme={toggleTheme}
              handleColorChange={handleColorChange}
            />

            <Button
              variant="ghost"
              className="w-full justify-center lg:justify-start"
              onClick={handleLogout}
            >
              <LogOut className="w-6 h-6" />
              <AnimatePresence>
              {isMenuOpen && (
                <motion.span
                className="ml-4"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3 }}
                >
                Logout
                </motion.span>
              )}
              </AnimatePresence>
            </Button>
          </div>
        </motion.aside>

        {/* Main content */}
        <main
          className={`flex-1 p-8 overflow-y-auto bg-gradient-to-r ${
            theme === "dark"
              ? "bg-gradient-to-br from-purple-900 to-black text-white"
              : "bg-gradient-to-r from-slate-50 to text-gray-900"
          }`}
        >

            <header className="flex justify-between items-center mb-8">
            {activeItem !== "profile" && (
              <BlurIn
              word={menuItems.find((item) => item.id === activeItem)?.title || "Default Title"}
              className="text-3xl "
              />
            )}

                <Button
                variant="ghost"
                size="icon"
                onClick={toggleMenu}
                className="z-20"
                >
                {isMenuOpen ? (
                  <ChevronLeft className="w-6 h-6" />
                ) : (
                  <ChevronRight className="w-6 h-6" />
                )}
                </Button>
            </header>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
