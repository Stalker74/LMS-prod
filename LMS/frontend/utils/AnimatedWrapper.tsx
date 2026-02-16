"use client";
import { motion } from "motion/react";
import { ReactNode } from "react";

interface AnimatedWrapperProps {
  children: ReactNode; // Type for children
  from?: "left" | "right" | "top" | "bottom"; // Restrict direction values
  initialX?: number; // Optional x-offset
  initialY?: number; // Optional y-offset
  delay?: number; // Delay time for animation
  duration?: number; // Duration of animation
  className?: string;
  ease?: any;
  amount?: number;
  opacity?: number;
  scale?: number;
}

const AnimatedWrapper: React.FC<AnimatedWrapperProps> = ({
  children,
  from = "left", // Direction of animation: 'left', 'right', 'top', 'bottom'
  initialX = 0, // Custom initial x-offset
  initialY = 0, // Custom initial y-offset
  delay = 0, // Delay time for the animation
  duration = 1, // Duration of the animation
  className,
  ease = "backOut",
  amount = 0,
  opacity = 0,
  scale = 1,
}) => {
  // Set the initial position based on the 'from' prop
  const getInitialPosition = () => {
    switch (from) {
      case "left":
        return { x: initialX || -90, y: 0 };
      case "right":
        return { x: initialX || 90, y: 0 };
      case "top":
        return { x: 0, y: initialY || -90 };
      case "bottom":
        return { x: 0, y: initialY || 90 };
      default:
        return { x: 0, y: 0 };
    }
  };

  return (
    <motion.div
      className={`${className}`}
      initial={{
        opacity,
        ...getInitialPosition(), // Set initial position based on direction
      }}
      whileInView={{
        opacity: 1,
        x: 0, // Move to original position
        y: 0, // Move to original position
        // transition: {
        //   duration, // Set animation duration
        //   delay, // Set animation delay
        //   ease,
        //   //   type: "spring",
        // },
      }}
      viewport={{ once: true, amount }} // Trigger animation once in view
      whileHover={{
        scale,
      }}
      transition={{
        delay,
        duration,
        ease,
      }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedWrapper;
