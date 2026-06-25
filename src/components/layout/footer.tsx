import Link from "next/link";
import { SOCIAL_LINKS, CREATOR_NAME, CREATOR_NICKNAME } from "@/lib/config";
import { PlayIcon, YouTubeIcon, InstagramIcon } from "@/components/ui/icons";

const PLATFORM_ICONS = {
  youtube: YouTubeIcon,
  instagram: InstagramIcon,
  facebook: FacebookIconFooter,
} as const;

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-foreground pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10 mb-12">
          <div className="flex flex-col items-center md:items-start gap-3">
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
                <PlayIcon size={14} className="ml-0.5" />
              </div>
              <span className="text-xl font-heading font-bold tracking-tight text-white">CreatorHall</span>
            </Link>
            <p className="text-[#a3a3a3] text-sm text-center md:text-left max-w-xs">
              {CREATOR_NAME} &ldquo;{CREATOR_NICKNAME}&rdquo; &mdash; Comedy, stories, and entertainment.
            </p>
          </div>

          <div className="flex gap-12">
            <div className="flex flex-col gap-2.5">
              <h4 className="font-semibold text-white text-sm mb-1">Platform</h4>
              <Link href="/" className="text-sm text-[#a3a3a3] hover:text-accent transition-colors">Home</Link>
            </div>
            <div className="flex flex-col gap-2.5">
              <h4 className="font-semibold text-white text-sm mb-1">Follow</h4>
              {SOCIAL_LINKS.map((link) => {
                const Icon = PLATFORM_ICONS[link.platform];
                return (
                  <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="text-sm text-[#a3a3a3] hover:text-accent transition-colors flex items-center gap-1.5">
                    <Icon size={14} /> {link.label}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-t border-[#404040] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#737373]">
            &copy; {new Date().getFullYear()} CreatorHall. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="text-xs text-[#737373] hover:text-accent transition-colors">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FacebookIconFooter({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}
