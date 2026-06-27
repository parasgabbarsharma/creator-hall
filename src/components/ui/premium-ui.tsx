"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

// 1. Scroll Progress Bar
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-accent origin-left z-[100]"
      style={{ scaleX }}
    />
  );
}

// 2. Magnetic Button Wrapper
export function MagneticWrapper({ children, className }: { children: React.ReactElement, className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;
  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={cn("w-fit h-fit cursor-pointer inline-block", className)}
    >
      {children}
    </motion.div>
  );
}

// 3. Hover Tilt Card (3D effect)
export function HoverTiltCard({ children, className }: { children: React.ReactNode, className?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateY, rotateX, transformStyle: "preserve-3d" }}
      className={cn("relative h-full transition-transform duration-200 ease-linear", className)}
    >
      {children}
    </motion.div>
  );
}

// 4. Gradient Text
export function GradientText({ text, className }: { text: string, className?: string }) {
  return (
    <span className={cn("bg-clip-text text-transparent bg-gradient-to-r from-accent via-pink-500 to-blue-500 animate-gradient-x bg-[length:200%_auto]", className)}>
      {text}
    </span>
  );
}

// 6. Text Reveal on Scroll
export function TextReveal({ text, className }: { text: string, className?: string }) {
  const words = text.split(" ");
  return (
    <div className={cn("flex flex-wrap", className)}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.5, delay: i * 0.05, ease: "easeOut" }}
          className="mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}

// 7. Bento Grid System
export function BentoGrid({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-7xl mx-auto", className)}>
      {children}
    </div>
  );
}

export function BentoItem({ children, className, colSpan = 1 }: { children: React.ReactNode, className?: string, colSpan?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "rounded-2xl border border-border/50 bg-surface/80 backdrop-blur-md p-5 md:p-6 shadow-sm overflow-hidden relative group transition-colors hover:border-accent/30",
        colSpan === 2 && "md:col-span-2",
        colSpan === 3 && "md:col-span-3",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
