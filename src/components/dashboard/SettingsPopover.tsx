import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Sun, Moon, Settings } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export const SettingsPopover = ({
  isMenuOpen,
  theme,
  customColor,
  toggleTheme,
  handleColorChange,
}: any) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-center lg:justify-start mb-2"
        >
          <Settings className="w-6 h-6" />
          <AnimatePresence>
            {isMenuOpen && (
              <motion.span
                className="ml-4"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3 }}
              >
                Settings
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 z-50">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Appearance</h4>
            <p className="text-sm text-muted-foreground">
              Customize your dashboard look
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <label htmlFor="theme">Theme</label>
              <Switch
                id="theme"
                checked={theme === "dark"}
                onCheckedChange={toggleTheme}
              />
              <span>{theme === "dark" ? <Moon /> : <Sun />}</span>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <label htmlFor="color">Color</label>
              <input
                id="color"
                type="color"
                value={customColor}
                onChange={handleColorChange}
                className="w-full h-8"
              />
              <span
                style={{ backgroundColor: customColor }}
                className="w-8 h-8 rounded-full"
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
