"use server";

import { isAuthenticated } from "@/lib/auth";
import { syncYouTubeChannelData } from "@/lib/youtube-data";
import { revalidatePath } from "next/cache";

export async function syncYouTubeAction() {
  const isValid = await isAuthenticated();
  if (!isValid) {
    return { success: false, error: "Unauthorized" };
  }

  const result = await syncYouTubeChannelData();
  if (result.success) {
    revalidatePath("/dashboard");
    return { success: true, message: `Synced ${result.count} videos!` };
  } else {
    return { success: false, error: result.error || "Failed to sync" };
  }
}
