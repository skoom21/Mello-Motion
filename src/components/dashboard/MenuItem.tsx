import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Music, Headphones, Radio, Mic, Heart } from "lucide-react";

const icons = {
  Home,
  Headphones,
  Radio,
  Mic,
  Heart,
};

interface MenuItemProps {
  item: {
    id: string;
    icon: keyof typeof icons;
    title: string;
  };
  isActive: boolean;
  customColor: string;
  theme: "dark" | "light";
  isMenuOpen: boolean;
  onClick: () => void;
}

export const MenuItem = ({
  item,
  isActive,
  customColor,
  theme,
  isMenuOpen,
  onClick,
}: MenuItemProps) => {
  const Icon = icons[item.icon];

  return (
    <motion.button
      key={item.id}
      className="flex items-center w-full p-3 mb-2 rounded-lg transition-colors"
      style={{
        backgroundColor: isActive ? customColor : "transparent",
        color: isActive ? "white" : theme === "dark" ? "white" : "black",
        justifyContent: isMenuOpen ? "flex-start" : "center",
      }}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon className="w-6 h-6" />
      <AnimatePresence>
        {isMenuOpen && (
          <motion.span
            className="ml-4"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.3 }}
          >
            {item.title}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};
