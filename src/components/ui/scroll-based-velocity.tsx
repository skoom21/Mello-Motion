"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import styles from "./Wheel.module.css"; // Import styles for circular layout

const items = ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"]; // Your content

export default function Wheel() {
  const rotateValue = useMotionValue(0);
  const rotateSpring = useSpring(rotateValue, { stiffness: 200, damping: 30 });

  const wheelRef = useRef<HTMLDivElement>(null);

  const rotate = (direction: number) => {
    const newRotation = rotateValue.get() + direction * 30; // Adjust for smoother rotation
    rotateValue.set(newRotation);
  };

  return (
    <div className={styles.wheelContainer}>
      <motion.div
        className={styles.wheel}
        ref={wheelRef}
        style={{ rotate: rotateSpring }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDrag={(event, info) => {
          rotate(info.delta.x / 5); // Adjust sensitivity
        }}
      >
        {items.map((item, index) => (
          <motion.div
            key={index}
            className={styles.wheelItem}
            style={{ rotate: `${index * (360 / items.length)}deg` }}
          >
            {item}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
