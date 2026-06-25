"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { YouTubeIcon, InstagramIcon, BoltIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";

// 1. FadeInView Wrapper
export function FadeInView({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// 2. Stats Counter
function Counter({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-surface/50 backdrop-blur-sm rounded-2xl border border-border shadow-sm hover:border-accent/50 transition-colors">
      <motion.span 
        initial={{ scale: 0.5, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
        className="text-4xl md:text-5xl font-heading font-bold text-accent mb-2"
      >
        {value}
      </motion.span>
      <span className="text-muted font-medium text-sm uppercase tracking-wider">{label}</span>
    </div>
  );
}

export function StatsSection() {
  return (
    <FadeInView className="px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 my-24 relative">
        <div className="absolute inset-0 bg-accent/5 blur-3xl rounded-full -z-10" />
        <Counter value="1M+" label="Subscribers" />
        <Counter value="50M+" label="Total Views" />
        <Counter value="500+" label="Videos" />
        <Counter value="100K+" label="Followers" />
      </div>
    </FadeInView>
  );
}

// 3. Scrolling Marquee
export function ScrollingMarquee() {
  const items = [
    "Comedy", "Entertainment", "Vlogs", "Shorts", "Tech", "Lifestyle",
    "Comedy", "Entertainment", "Vlogs", "Shorts", "Tech", "Lifestyle",
  ];

  return (
    <div className="w-full overflow-hidden bg-accent/5 py-8 my-20 border-y border-border relative flex flex-col items-center">
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
      
      <motion.div
        animate={{ x: [0, -1035] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 20,
        }}
        className="flex whitespace-nowrap gap-16 items-center"
      >
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-6">
            <span className="text-2xl font-heading font-bold text-foreground/80 tracking-widest uppercase">{item}</span>
            <BoltIcon size={24} className="text-accent/50" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// 4. Floating Elements Background
export function FloatingBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      <motion.div
        animate={{ y: [0, -30, 0], rotate: [0, 15, -15, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] left-[10%] opacity-10 text-accent"
      >
        <YouTubeIcon size={80} />
      </motion.div>
      <motion.div
        animate={{ y: [0, 40, 0], rotate: [0, -20, 10, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-[50%] right-[10%] opacity-10 text-pink-600"
      >
        <InstagramIcon size={100} />
      </motion.div>
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.03, 0.08, 0.03] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[10%] right-[20%] w-[500px] h-[500px] bg-accent rounded-full blur-[120px]"
      />
    </div>
  );
}

// 5. Testimonial Section
export function Testimonials() {
  const testimonials = [
    { text: "Literally the funniest shorts on the internet right now. Can't stop watching!", author: "@fan123" },
    { text: "The editing is next level. Keeps me hooked from the first second.", author: "@creatorfan" },
    { text: "Been following since the early days. The growth is insane but deserved.", author: "@dailywatcher" },
  ];

  return (
    <FadeInView className="px-4">
      <section className="my-32 text-center">
        <h2 className="text-4xl font-heading font-bold mb-12 tracking-tight">What The Fans Say</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="p-8 rounded-3xl bg-surface border border-border text-left relative overflow-hidden group shadow-sm hover:shadow-xl hover:shadow-accent/5 transition-all"
            >
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 group-hover:rotate-12 duration-500">
                <YouTubeIcon size={64} />
              </div>
              <p className="text-muted leading-relaxed relative z-10 text-lg">&ldquo;{t.text}&rdquo;</p>
              <p className="font-semibold text-foreground mt-6 relative z-10 font-heading">{t.author}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </FadeInView>
  );
}

// 6. Newsletter / Connect CTA
export function ConnectCTA() {
  return (
    <FadeInView className="px-4">
      <div className="relative rounded-[2.5rem] overflow-hidden bg-foreground text-background py-24 px-6 text-center my-32 max-w-5xl mx-auto shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/30 via-transparent to-pink-600/20 pointer-events-none" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-32 -left-32 w-64 h-64 bg-accent/40 rounded-full blur-[80px] pointer-events-none"
        />
        <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 relative z-10 tracking-tight text-white">Join The Community</h2>
        <p className="text-[#a3a3a3] mb-10 max-w-xl mx-auto relative z-10 text-lg">
          Subscribe to my channel and turn on notifications to never miss a new video or update!
        </p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative z-10 inline-block">
          <a href="https://www.youtube.com/@parassharmagabbar/shorts" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="bg-accent hover:bg-accent-hover text-white rounded-full px-12 py-7 text-xl shadow-xl shadow-accent/20 font-bold transition-all">
              <YouTubeIcon size={24} className="mr-2" />
              Subscribe Now
            </Button>
          </a>
        </motion.div>
      </div>
    </FadeInView>
  );
}
