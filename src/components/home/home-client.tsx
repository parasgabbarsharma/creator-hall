"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { VideoCard } from "@/components/video/video-card";
import { Video } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { YouTubeIcon, InstagramIcon, BoltIcon, SearchOffIcon, PlayIcon, LoadingIcon } from "@/components/ui/icons";
import { StatsSection, ScrollingMarquee, Testimonials, ConnectCTA, FadeInView, HeroMeshBackground, FAQSection, SubGoal, GearGrid, AboutChannelSection } from "./animated-sections";
import { isYouTubeShortUrl } from "@/lib/video-url";
import { CREATOR_BIO } from "@/lib/config";
import { SpotlightHero, GradientText, Sparkles, MagneticWrapper } from "@/components/ui/premium-ui";

interface HomeClientProps {
  youtubeLong: Video[];
  youtubeShorts: Video[];
  instagramVideos: Video[];
  searchQuery?: string;
  defaultTab?: string;
  channelAvatar: string | null;
  channelName: string;
  totalVideos: number;

  hasMoreYt?: boolean;
  hasMoreIg?: boolean;
  nextYtCursor?: string | null;
  nextIgCursor?: string | null;

  subscriberCount?: string;
  viewCount?: string;
  videoCount?: string;
}

export function HomeClient({
  youtubeLong,
  youtubeShorts,
  instagramVideos,
  searchQuery,
  defaultTab,
  channelAvatar,
  channelName,
  totalVideos,

  hasMoreYt = false,
  hasMoreIg = false,
  nextYtCursor,
  nextIgCursor,
  subscriberCount = "0",
  viewCount = "0",
  videoCount = "0",
}: HomeClientProps) {
  const initialTab = defaultTab === "instagram" ? "instagram" : "youtube";
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  
  const [ytLongs, setYtLongs] = useState<Video[]>(youtubeLong);
  const [ytShorts, setYtShorts] = useState<Video[]>(youtubeShorts);
  const [igVids, setIgVids] = useState<Video[]>(instagramVideos);

  const [moreYt, setMoreYt] = useState(hasMoreYt);
  const [moreIg, setMoreIg] = useState(hasMoreIg);
  const [nextYt, setNextYt] = useState(nextYtCursor);
  const [nextIg, setNextIg] = useState(nextIgCursor);
  const [loadingMore, setLoadingMore] = useState<"YOUTUBE" | "INSTAGRAM" | null>(null);

  const handleLoadMore = async (platform: "YOUTUBE" | "INSTAGRAM") => {
    setLoadingMore(platform);
    try {
      const cursor = platform === "YOUTUBE" ? nextYt : nextIg;
      const url = new URL("/api/videos", window.location.origin);
      url.searchParams.set("limit", "12");
      if (cursor) url.searchParams.set("cursor", cursor);
      if (searchQuery) url.searchParams.set("q", searchQuery);
      url.searchParams.set("platform", platform);

      const res = await fetch(url);
      const data = await res.json();

      if (platform === "YOUTUBE") {
        const newLongs = data.items.filter((v: Video) => !isYouTubeShortUrl(v.url));
        const newShorts = data.items.filter((v: Video) => isYouTubeShortUrl(v.url));
        setYtLongs(prev => [...prev, ...newLongs]);
        setYtShorts(prev => [...prev, ...newShorts]);
        setMoreYt(data.hasMore);
        setNextYt(data.nextCursor);
      } else {
        setIgVids(prev => [...prev, ...data.items]);
        setMoreIg(data.hasMore);
        setNextIg(data.nextCursor);
      }
    } catch (e) {
      console.error("Failed to load more", e);
    } finally {
      setLoadingMore(null);
    }
  };

  const totalContent = ytLongs.length + ytShorts.length + igVids.length;

  if (searchQuery && totalContent === 0) {
    return (
      <div className="py-32 flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mb-6">
          <SearchOffIcon size={32} className="text-muted" />
        </div>
        <h2 className="text-2xl font-heading font-semibold text-foreground tracking-tight">No results for &quot;{searchQuery}&quot;</h2>
        <p className="text-muted mt-3 max-w-md">Try searching for a different title or keyword.</p>
        <Link href="/" className="mt-8">
          <Button variant="secondary" className="rounded-full px-8 font-medium">Clear Search</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <SpotlightHero>
      <HeroMeshBackground />
      
      {!searchQuery && (
        <FadeInView delay={0.1} className="mt-20 mb-16 px-4">
          <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
              className="relative group"
            >
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden shadow-xl ring-4 ring-background z-10 relative bg-surface">
                {channelAvatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={channelAvatar} alt={channelName} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-heading font-bold text-muted">
                    {channelName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <motion.div 
                animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full bg-accent blur-2xl" 
              />
            </motion.div>
            
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="text-4xl md:text-6xl font-heading font-extrabold text-foreground mt-8 tracking-tighter"
            >
              <Sparkles>
                {channelName.split(" ").slice(0, -1).join(" ")}{" "}
                <GradientText text={channelName.split(" ").slice(-1)[0] || ""} />
              </Sparkles>
            </motion.h1>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="text-lg md:text-xl text-muted mt-4 max-w-lg mx-auto leading-relaxed"
            >
              {CREATOR_BIO}
            </motion.p>
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              className="flex items-center justify-center gap-4 mt-10"
            >
              <div className="flex items-center gap-2 px-5 py-2.5 bg-surface rounded-full border border-border/50 shadow-sm">
                <PlayIcon size={18} className="text-muted" />
                <span className="text-[15px] font-semibold text-foreground">{totalVideos} <span className="font-normal text-muted">Videos</span></span>
              </div>
              <MagneticWrapper>
                <motion.a 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="https://www.youtube.com/@parassharmagabbar/shorts" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 px-8 py-3.5 bg-accent text-white rounded-full shadow-lg shadow-accent/30 hover:shadow-accent/50 hover:bg-accent-hover transition-all font-bold text-[16px] tracking-wide"
                >
                  <YouTubeIcon size={20} />
                  Subscribe Now
                </motion.a>
              </MagneticWrapper>
            </motion.div>
          </div>
        </FadeInView>
      )}
      </SpotlightHero>

      {!searchQuery && <SubGoal subscriberCount={subscriberCount} />}
      {!searchQuery && <StatsSection subscriberCount={subscriberCount} viewCount={viewCount} videoCount={videoCount} />}
      {!searchQuery && <ScrollingMarquee />}
      {!searchQuery && <Testimonials />}
      {!searchQuery && <FAQSection />}
      {!searchQuery && <GearGrid />}
      {!searchQuery && <AboutChannelSection />}

      {searchQuery && (
        <h1 className="text-2xl font-bold text-foreground mt-8 mb-8 border-b border-border pb-4">
          Search Results for &quot;{searchQuery}&quot;
        </h1>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="md:hidden flex p-1 mb-8 bg-surface rounded-xl border border-border/50 mx-4" 
        role="tablist"
      >
        <button type="button" role="tab" aria-selected={activeTab === "youtube"} onClick={() => setActiveTab("youtube")} className={cn("flex-1 py-2.5 text-[14px] font-medium rounded-lg transition-all flex items-center justify-center gap-2", activeTab === "youtube" ? "bg-white shadow-sm text-foreground" : "text-muted hover:text-foreground")}>
          <YouTubeIcon size={16} className={activeTab === "youtube" ? "text-accent" : ""} />
          YouTube
        </button>
        <button type="button" role="tab" aria-selected={activeTab === "instagram"} onClick={() => setActiveTab("instagram")} className={cn("flex-1 py-2.5 text-[14px] font-medium rounded-lg transition-all flex items-center justify-center gap-2", activeTab === "instagram" ? "bg-white shadow-sm text-foreground" : "text-muted hover:text-foreground")}>
          <InstagramIcon size={16} className={activeTab === "instagram" ? "text-pink-600" : ""} />
          Instagram
        </button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="hidden md:grid md:grid-cols-2 gap-6 lg:gap-8 xl:gap-12 items-start"
      >
        <YouTubeSection longs={ytLongs} shorts={ytShorts} hasMore={moreYt} onLoadMore={() => handleLoadMore("YOUTUBE")} loading={loadingMore === "YOUTUBE"} />
        <InstagramSection videos={igVids} hasMore={moreIg} onLoadMore={() => handleLoadMore("INSTAGRAM")} loading={loadingMore === "INSTAGRAM"} />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="md:hidden"
      >
        {activeTab === "youtube" && <YouTubeSection longs={ytLongs} shorts={ytShorts} hasMore={moreYt} onLoadMore={() => handleLoadMore("YOUTUBE")} loading={loadingMore === "YOUTUBE"} />}
        {activeTab === "instagram" && <InstagramSection videos={igVids} hasMore={moreIg} onLoadMore={() => handleLoadMore("INSTAGRAM")} loading={loadingMore === "INSTAGRAM"} />}
      </motion.div>

      {/* Mobile Load More handled inside the sections now, so we can remove the global one */}

      {!searchQuery && <ConnectCTA />}
    </div>
  );
}

function YouTubeSection({ longs, shorts, hasMore, onLoadMore, loading }: { longs: Video[]; shorts: Video[], hasMore?: boolean, onLoadMore?: () => void, loading?: boolean }) {

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center gap-3 mb-2 sticky top-16 bg-background/95 backdrop-blur-sm z-10 py-4">
        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
          <YouTubeIcon size={20} className="text-accent" />
        </div>
        <h2 className="text-2xl font-heading font-semibold text-foreground tracking-tight">YouTube</h2>
      </div>

      {longs.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
          {longs.map((video) => <VideoCard key={video.id} video={video} />)}
        </div>
      )}

      {shorts.length > 0 && (
        <>
          <h3 className="font-bold text-foreground flex items-center gap-2 mt-4">
            <BoltIcon size={16} className="text-accent" />
            Shorts
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
            {shorts.map((video) => <VideoCard key={video.id} video={video} />)}
          </div>
        </>
      )}

      {longs.length === 0 && shorts.length === 0 && (
        <div className="py-12 text-center text-muted bg-surface rounded-lg border border-dashed border-border">
          No YouTube videos yet.
        </div>
      )}

      {hasMore && onLoadMore && (
        <div className="flex justify-center mt-6">
          <Button variant="secondary" size="sm" onClick={onLoadMore} disabled={loading}>
            {loading ? <LoadingIcon size={16} className="animate-spin" /> : "Load More YouTube"}
          </Button>
        </div>
      )}
    </section>
  );
}

function InstagramSection({ videos, hasMore, onLoadMore, loading }: { videos: Video[], hasMore?: boolean, onLoadMore?: () => void, loading?: boolean }) {

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center gap-3 mb-2 sticky top-16 bg-background/95 backdrop-blur-sm z-10 py-4">
        <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center">
          <InstagramIcon size={20} className="text-pink-600" />
        </div>
        <h2 className="text-2xl font-heading font-semibold text-foreground tracking-tight">Instagram</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
        {videos.map((video) => <VideoCard key={video.id} video={video} />)}
        {videos.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted bg-surface rounded-lg border border-dashed border-border">
            No Instagram content yet.
          </div>
        )}
      </div>

      {hasMore && onLoadMore && (
        <div className="flex justify-center mt-6">
          <Button variant="secondary" size="sm" onClick={onLoadMore} disabled={loading}>
            {loading ? <LoadingIcon size={16} className="animate-spin" /> : "Load More Instagram"}
          </Button>
        </div>
      )}
    </section>
  );
}
