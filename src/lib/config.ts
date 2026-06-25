export const SITE_NAME = "CreatorHall";
export const SITE_DESCRIPTION =
  "Content aggregation platform for creators";

export const CREATOR_NAME = "Paras Sharma";
export const CREATOR_NICKNAME = "Gabbar";
export const CREATOR_BIO =
  "Content creator. Storyteller. Making people laugh one short at a time.";

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
  {
    href: "https://www.facebook.com/share/18d4ZP7mQi/",
    label: "Facebook",
    platform: "facebook" as const,
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
