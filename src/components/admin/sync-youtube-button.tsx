"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { syncYouTubeAction } from "@/app/(admin)/dashboard/sync-action";
import { YouTubeIcon, LoadingIcon } from "@/components/ui/icons";

export function SyncYouTubeButton() {
  const [isSyncing, setIsSyncing] = useState(false);
  const toast = useToast();

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await syncYouTubeAction();
      if (res.success) {
        toast.success(res.message || "Synced successfully!");
      } else {
        toast.error(res.error || "Failed to sync YouTube videos");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Button 
      variant="secondary" 
      onClick={handleSync} 
      disabled={isSyncing}
      className="flex items-center gap-2"
    >
      {isSyncing ? <LoadingIcon size={16} className="animate-spin" /> : <YouTubeIcon size={16} />}
      {isSyncing ? "Syncing..." : "Auto-Sync YouTube"}
    </Button>
  );
}
