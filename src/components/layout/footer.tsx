import Link from "next/link";
import { SOCIAL_LINKS, CREATOR_NAME, CREATOR_NICKNAME, CONTACT_INFO } from "@/lib/config";
import { PlayIcon, YouTubeIcon, InstagramIcon, FacebookIcon, WhatsAppIcon, PhoneIcon } from "@/components/ui/icons";

const PLATFORM_ICONS = {
  youtube: YouTubeIcon,
  instagram: InstagramIcon,
  facebook: FacebookIcon,
} as const;

const PLATFORM_HOVER_COLORS: Record<string, string> = {
  youtube: "hover:text-[#FF0000] hover:border-[#FF0000] hover:bg-[#FF0000]/10",
  instagram: "hover:text-[#E1306C] hover:border-[#E1306C] hover:bg-[#E1306C]/10",
  facebook: "hover:text-[#1877F2] hover:border-[#1877F2] hover:bg-[#1877F2]/10",
};

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-border overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-accent/5 pointer-events-none" />
      
      <div className="w-full px-4 md:px-6 pt-24 pb-12 relative z-10">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16">
          <Link href="/" className="flex items-center gap-3 shrink-0 group mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white shadow-lg transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
              <PlayIcon size={18} className="ml-0.5" />
            </div>
            <span className="text-2xl font-heading font-bold tracking-tight text-foreground">Paras Sharma</span>
          </Link>
          
          <p className="text-muted text-lg leading-relaxed">
            {CREATOR_NAME} &ldquo;{CREATOR_NICKNAME}&rdquo; <br/> 
            Entertaining millions through comedy, stories, and daily shorts.
          </p>

          <div className="flex items-center gap-6 mt-10">
            {SOCIAL_LINKS.map((link) => {
              const Icon = PLATFORM_ICONS[link.platform];
              const hoverClass = PLATFORM_HOVER_COLORS[link.platform];
              return (
                <a 
                  key={link.href} 
                  href={link.href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center text-muted transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md ${hoverClass}`}
                  aria-label={link.label}
                >
                  <Icon size={20} />
                </a>
              );
            })}
            <a 
              href={CONTACT_INFO.whatsapp} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center text-muted transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md hover:text-[#25D366] hover:border-[#25D366] hover:bg-[#25D366]/10"
              aria-label="WhatsApp"
            >
              <WhatsAppIcon size={22} />
            </a>
            <a 
              href={`tel:${CONTACT_INFO.phone.replace(/\s+/g, '')}`} 
              className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center text-muted transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md hover:text-foreground hover:border-foreground hover:bg-foreground/5"
              aria-label="Call"
            >
              <PhoneIcon size={20} />
            </a>
          </div>
        </div>

        <div className="border-t border-border/60 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted/80 font-medium tracking-wide">
            &copy; {new Date().getFullYear()} {CREATOR_NAME}. All rights reserved.
          </p>
          <div className="flex items-center gap-8 text-sm text-muted/80 font-medium">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
            <Link href="/?tab=youtube" className="hover:text-foreground transition-colors">YouTube</Link>
            <Link href="/?tab=instagram" className="hover:text-foreground transition-colors">Instagram</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

