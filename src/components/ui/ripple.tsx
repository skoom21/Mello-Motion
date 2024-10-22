import React, { CSSProperties } from "react";

import { cn } from "@/lib/utils";

interface RippleProps {
  mainCircleSize?: number;
  mainCircleOpacity?: number;
  numCircles?: number;
  className?: string;
}

const Ripple = React.memo(function Ripple({
  mainCircleSize = 210,
  mainCircleOpacity = 0.24,
  numCircles = 8,
  className,
}: RippleProps) {
  return (
    <div
      className={cn(
      "absolute inset-0 bg-transparent",
      className,
      )}
    >
      {Array.from({ length: numCircles }, (_, i) => {
      const size = mainCircleSize + i * 70;
      const opacity = mainCircleOpacity - i * 0.02; // Increase opacity for better visibility
      const animationDelay = `${i * 0.06}s`;
      const borderStyle = i === numCircles - 1 ? "dashed" : "solid";
      const borderOpacity = 10 + i * 10; // Increase border opacity for better visibility

      return (
      <div
      key={i}
      className={`absolute animate-ripple rounded-full bg-purple-500/10 shadow-xl border [--i:${i}]`} // Increase background opacity
      style={
        {
        width: `${size}px`,
        height: `${size}px`,
        opacity,
        animationDelay,
        borderStyle,
        borderWidth: "",
        borderColor: `hsl(270, 100%, ${borderOpacity}%)`, // Purple color
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%) scale(1)",
        } as CSSProperties
      }
      />
      );
      })}
    </div>
  );
});

Ripple.displayName = "Ripple";

export default Ripple;
