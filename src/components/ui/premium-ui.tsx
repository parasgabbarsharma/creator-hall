"use client";

import React from "react";
import { motion, useScroll, useSpring, useMotionValue, useTransform } from "framer-motion";
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
// 7. Shiny Button
export function ShinyButton({ text, className, onClick }: { text: React.ReactNode, className?: string, onClick?: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "relative overflow-hidden rounded-full bg-accent px-8 py-3.5 font-bold text-white shadow-xl shadow-accent/20 transition-all hover:shadow-accent/40",
        className
      )}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">{text}</span>
      <motion.div
        className="absolute inset-0 z-0 h-full w-[200%] translate-x-[-100%] bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{ translateX: ["-100%", "100%"] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
      />
    </motion.button>
  );
}

// 8. Meteors Background
export function Meteors({ number = 20 }: { number?: number }) {
  const meteors = new Array(number).fill(true);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {meteors.map((_, idx) => (
        <span
          key={"meteor" + idx}
          className={cn(
            "animate-meteor-effect absolute top-1/2 left-1/2 h-0.5 w-0.5 rounded-[9999px] bg-slate-200 shadow-[0_0_0_1px_#ffffff10] rotate-[215deg]",
            "before:content-[''] before:absolute before:top-1/2 before:transform before:-translate-y-[50%] before:w-[50px] before:h-[1px] before:bg-gradient-to-r before:from-[#64748b] before:to-transparent"
          )}
          style={{
            top: 0,
            left: Math.floor(Math.random() * (400 - -400) + -400) + "px",
            animationDelay: Math.random() * (0.8 - 0.2) + 0.2 + "s",
            animationDuration: Math.floor(Math.random() * (10 - 2) + 2) + "s",
          }}
        ></span>
      ))}
    </div>
  );
}
