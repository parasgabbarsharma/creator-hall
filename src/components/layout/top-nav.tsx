"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { SOCIAL_LINKS } from "@/lib/config";
import { PlayIcon, SearchIcon, YouTubeIcon, InstagramIcon } from "@/components/ui/icons";

const PLATFORM_ICONS = {
  youtube: YouTubeIcon,
  instagram: InstagramIcon,
  facebook: FacebookIcon,
} as const;

export function TopNavBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/");
    }
  };

  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 h-16 px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
              <PlayIcon size={14} className="ml-0.5" />
            </div>
            <span className="text-xl font-heading font-bold tracking-tight text-foreground">CreatorHall</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {SOCIAL_LINKS.map((link) => {
              const Icon = PLATFORM_ICONS[link.platform];
              return (
                <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent transition-colors" title={link.label}>
                  <Icon size={20} />
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-3 flex-1 max-w-md justify-end md:justify-center ml-auto md:ml-0">
            <form onSubmit={handleSearch} className="w-full relative group" role="search">
              <label htmlFor="nav-search" className="sr-only">Search videos</label>
              <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted transition-colors group-focus-within:text-accent">
                <SearchIcon size={16} />
              </span>
              <input id="nav-search" className="w-full h-10 pl-10 pr-4 bg-surface border border-border/60 hover:border-border rounded-full focus:bg-white focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none text-foreground placeholder:text-muted/80 text-[15px] transition-all shadow-sm" placeholder="Search..." type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </form>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-surface transition-colors"
              aria-label="Menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {menuOpen ? <><path d="M18 6L6 18" /><path d="M6 6l12 12" /></> : <><path d="M3 12h18" /><path d="M3 6h18" /><path d="M3 18h18" /></>}
              </svg>
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            id="mobile-menu"
          role="dialog"
          aria-modal="true"
          className={cn("fixed inset-0 z-40 bg-white/95 backdrop-blur-md transition-transform duration-300 md:hidden")}
        >
          <div className="flex flex-col items-center justify-center h-full gap-8 p-8">
            {SOCIAL_LINKS.map((link) => {
              const Icon = PLATFORM_ICONS[link.platform];
              return (
                <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-xl font-heading font-semibold text-foreground hover:text-accent transition-colors" onClick={() => setMenuOpen(false)}>
                  <Icon size={28} /> {link.label}
                </a>
              );
            })}
          </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function FacebookIcon({ className, size = 24 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}
