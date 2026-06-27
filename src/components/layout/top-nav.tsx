"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

import { motion, AnimatePresence } from "framer-motion";
import { SOCIAL_LINKS, CONTACT_INFO } from "@/lib/config";
import { PlayIcon, SearchIcon, YouTubeIcon, InstagramIcon, FacebookIcon, WhatsAppIcon } from "@/components/ui/icons";

const PLATFORM_ICONS = {
  youtube: YouTubeIcon,
  instagram: InstagramIcon,
  facebook: FacebookIcon,
} as const;

const PLATFORM_HOVER_COLORS = {
  youtube: "hover:text-[#ff0000]",
  instagram: "hover:text-[#E1306C]",
  facebook: "hover:text-[#1877F2]",
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
        className="sticky top-0 z-50 bg-background border-b border-border"
      >
        <div className="w-full flex items-center justify-between gap-3 h-[72px] md:h-20 px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group sm:min-w-[150px]">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
              <PlayIcon size={14} className="ml-0.5" />
            </div>
            <div className="font-heading font-bold tracking-tight text-foreground flex flex-col sm:flex-row sm:items-center sm:gap-1.5 uppercase sm:normal-case">
              <span className="text-[13px] sm:text-xl leading-[1.1] sm:leading-normal">Paras</span>
              <span className="text-[13px] sm:text-xl leading-[1.1] sm:leading-normal">Sharma</span>
              <span className="text-[13px] sm:text-xl leading-[1.1] sm:leading-normal">Gabbar</span>
            </div>
          </Link>

          <div className="flex-1 max-w-[160px] sm:max-w-2xl mx-auto px-1 md:px-8">
            <form onSubmit={handleSearch} className="w-full relative group" role="search">
              <label htmlFor="nav-search" className="sr-only">Search videos</label>
              <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted transition-colors group-focus-within:text-accent">
                <SearchIcon size={16} />
              </span>
              <input id="nav-search" className="w-full h-10 pl-10 pr-4 bg-surface border border-border/60 hover:border-border rounded-full focus:bg-white focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none text-foreground placeholder:text-muted/80 text-[15px] transition-all shadow-sm" placeholder="Search..." type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </form>
          </div>

          <div className="flex items-center justify-end gap-3 min-w-[40px] md:min-w-[150px]">
            <div className="hidden md:flex items-center gap-6">
              {SOCIAL_LINKS.map((link) => {
                const Icon = PLATFORM_ICONS[link.platform];
                const hoverClass = PLATFORM_HOVER_COLORS[link.platform];
                return (
                  <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className={cn("text-muted transition-colors", hoverClass)} title={link.label}>
                    <Icon size={20} />
                  </a>
                );
              })}
              <div className="w-[1px] h-6 bg-border/60 mx-2" />
              <a href={CONTACT_INFO.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded-full w-9 h-9 shadow-sm shadow-green-500/20 transition-all hover:scale-105" title="Chat on WhatsApp">
                <WhatsAppIcon size={18} />
              </a>
              <Link href="/contact" className="text-[14px] font-semibold text-foreground hover:text-accent transition-colors">
                Contact
              </Link>
            </div>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-surface transition-colors"
              aria-label="Menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <motion.path
                  animate={menuOpen ? { d: "M6 18L18 6" } : { d: "M3 6h18" }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
                <motion.path
                  animate={menuOpen ? { opacity: 0, scale: 0 } : { opacity: 1, scale: 1 }}
                  d="M3 12h18"
                  transition={{ duration: 0.2 }}
                />
                <motion.path
                  animate={menuOpen ? { d: "M6 6l12 12" } : { d: "M3 18h18" }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              </svg>
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ y: "-100%", borderBottomLeftRadius: "50%", borderBottomRightRadius: "50%" }}
            animate={{ y: 0, borderBottomLeftRadius: "24px", borderBottomRightRadius: "24px", opacity: 1 }}
            exit={{ y: "-100%", borderBottomLeftRadius: "50%", borderBottomRightRadius: "50%", opacity: 0, transition: { duration: 0.3 } }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            className="fixed top-[72px] left-0 right-0 z-40 bg-foreground text-background shadow-2xl md:hidden overflow-hidden"
          >
            <div className="flex flex-col items-center justify-center gap-6 p-8 pb-10">
              {SOCIAL_LINKS.map((link, i) => {
                const Icon = PLATFORM_ICONS[link.platform];
                const hoverClass = PLATFORM_HOVER_COLORS[link.platform];
                return (
                  <motion.a 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.2 + (i * 0.1), duration: 0.4 } }}
                    exit={{ opacity: 0, y: 10, transition: { duration: 0.2 } }}
                    key={link.href} 
                    href={link.href} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={cn("flex items-center gap-4 text-2xl font-heading font-semibold transition-colors", hoverClass)} 
                    onClick={() => setMenuOpen(false)}
                  >
                    <Icon size={32} /> {link.label}
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
