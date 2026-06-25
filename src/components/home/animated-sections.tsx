"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { YouTubeIcon, BoltIcon } from "@/components/ui/icons";
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

// Formatter
function formatCompactNumber(number: number | string) {
  const n = typeof number === "string" ? parseInt(number, 10) : number;
  if (isNaN(n) || n === 0) return "0";
  const formatter = Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });
  return formatter.format(n);
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

export function StatsSection({ subscriberCount, viewCount, videoCount }: { subscriberCount: string, viewCount: string, videoCount: string }) {
  return (
    <FadeInView className="px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 my-24 relative">
        <div className="absolute inset-0 bg-accent/5 blur-3xl rounded-full -z-10" />
        <Counter value={formatCompactNumber(subscriberCount)} label="Subscribers" />
        <Counter value={formatCompactNumber(viewCount)} label="Total Views" />
        <Counter value={formatCompactNumber(videoCount)} label="Videos" />
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

// 4. Hero Mesh Background
export function HeroMeshBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent/10 rounded-full blur-[100px]" />
      <div className="absolute top-40 -left-20 w-72 h-72 bg-pink-600/5 rounded-full blur-[80px]" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px]" />
    </div>
  );
}

// 7. FAQ Accordion
export function FAQSection() {
  const faqs = [
    { q: "How often do you upload?", a: "I post new YouTube Shorts every single day, and long-form videos every Sunday!" },
    { q: "What editing software do you use?", a: "I edit primarily on Adobe Premiere Pro and After Effects for the heavy visuals." },
    { q: "Do you do brand collaborations?", a: "Yes! For business inquiries, please reach out via the email on my YouTube About page." }
  ];

  const [open, setOpen] = useState<number | null>(0);

  return (
    <FadeInView className="px-4 max-w-3xl mx-auto my-32">
      <h2 className="text-3xl font-heading font-bold text-center mb-12">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="border border-border bg-surface rounded-2xl overflow-hidden transition-all hover:border-accent/30">
            <button 
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full text-left p-6 flex justify-between items-center font-semibold text-foreground focus:outline-none"
            >
              {faq.q}
              <motion.span animate={{ rotate: open === i ? 45 : 0 }} className="text-muted">
                +
              </motion.span>
            </button>
            <motion.div 
              initial={false} 
              animate={{ height: open === i ? "auto" : 0, opacity: open === i ? 1 : 0 }} 
              className="overflow-hidden"
            >
              <p className="p-6 pt-0 text-muted leading-relaxed border-t border-border/50">{faq.a}</p>
            </motion.div>
          </div>
        ))}
      </div>
    </FadeInView>
  );
}

// 8. Live Sub Goal
export function SubGoal({ subscriberCount }: { subscriberCount: string }) {
  const subs = parseInt(subscriberCount, 10) || 0;
  
  // Calculate next dynamic goal
  let goal = 1000;
  if (subs >= 1000000) goal = Math.ceil((subs + 1) / 1000000) * 1000000;
  else if (subs >= 100000) goal = Math.ceil((subs + 1) / 100000) * 100000;
  else if (subs >= 10000) goal = Math.ceil((subs + 1) / 10000) * 10000;
  else goal = Math.ceil((subs + 1) / 1000) * 1000;

  const percentage = Math.min(100, Math.max(0, (subs / goal) * 100));

  return (
    <FadeInView className="px-4 max-w-4xl mx-auto my-16">
      <div className="p-8 rounded-3xl bg-foreground text-background flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
        <div>
          <h3 className="text-2xl font-bold font-heading mb-2 flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            Road to {formatCompactNumber(goal)}
          </h3>
          <p className="text-[#a3a3a3]">Join the journey and be part of the history.</p>
        </div>
        <div className="flex-1 w-full max-w-md">
          <div className="flex justify-between text-sm font-semibold mb-2 text-[#e5e5e5]">
            <span>{formatCompactNumber(subs)}</span>
            <span>{formatCompactNumber(goal)}</span>
          </div>
          <div className="h-3 bg-[#404040] rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }} 
              whileInView={{ width: `${percentage}%` }} 
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-accent rounded-full" 
            />
          </div>
        </div>
      </div>
    </FadeInView>
  );
}

// 9. Gear Grid
export function GearGrid() {
  const gear = [
    { name: "Sony A7S III", type: "Main Camera" },
    { name: "Shure SM7B", type: "Microphone" },
    { name: "Aputure 120D", type: "Lighting" },
    { name: "MacBook Pro M3", type: "Editing" }
  ];

  return (
    <FadeInView className="px-4 max-w-6xl mx-auto my-32">
      <h2 className="text-3xl font-heading font-bold text-center mb-12">The Studio Setup</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {gear.map((item, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5 }}
            className="p-6 bg-surface border border-border rounded-2xl text-center group"
          >
            <div className="w-12 h-12 mx-auto bg-background rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-muted">
              <BoltIcon size={20} />
            </div>
            <h4 className="font-bold text-foreground">{item.name}</h4>
            <p className="text-sm text-muted mt-1">{item.type}</p>
          </motion.div>
        ))}
      </div>
    </FadeInView>
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
