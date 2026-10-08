"use client";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect } from "react";

interface ParallaxProps {
  children: React.ReactNode;
  className?: string;
}

export function Parallax({ children, className = "" }: ParallaxProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const smoothX = useSpring(x, { damping: 50, stiffness: 300 });
  const smoothY = useSpring(y, { damping: 50, stiffness: 300 });

  const moveX = useTransform(smoothX, [-0.5, 0.5], [-25, 25]);
  const moveY = useTransform(smoothY, [-0.5, 0.5], [-25, 25]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      x.set(e.clientX / innerWidth - 0.5);
      y.set(e.clientY / innerHeight - 0.5);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [x, y]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`overflow-hidden ${className}`}
    >
      <motion.div
        style={{ x: moveX, y: moveY }}
        className="absolute -inset-4 h-[calc(100%+2rem)] w-[calc(100%+2rem)]"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
