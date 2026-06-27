export const SITE_NAME = "Paras Gabbar Sharma";
export const SITE_DESCRIPTION =
  "Desi comedy, relatable storytelling, and daily vlogs by Paras Gabbar Sharma.";

export const CREATOR_NAME = "Paras Sharma";
export const CREATOR_NICKNAME = "Gabbar";
export const CREATOR_BIO =
  "Desi comedy and storytelling that will definitely make you laugh. Naye shorts har din!";

export const SOCIAL_LINKS = [
  {
    href: "https://www.youtube.com/@parassharmagabbar/shorts",
    label: "YouTube",
    platform: "youtube" as const,
  },
  {
    href: "https://www.instagram.com/paras_sharma_gabbar?igsh=MXh3NWkyaGN4enhy",
    label: "Instagram",
    platform: "instagram" as const,
  },
] as const;

export const DEFAULT_PAGE_SIZE = 24;
export const ADMIN_PAGE_SIZE = 50;
export const API_PAGE_SIZE_MAX = 50;

export type PageResult<T> = {
  items: T[];
  total: number;
  hasMore: boolean;
  nextCursor?: string;
};
