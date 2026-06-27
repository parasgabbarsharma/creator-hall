
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
  {
    href: "https://www.facebook.com/share/18d4ZP7mQi/",
    label: "Facebook",
    platform: "facebook" as const,
  },
] as const;

export const CONTACT_INFO = {
  phone: "+91 96912 26433",
  whatsapp: "https://wa.me/919691226433",
  email: "parasgabbars@gmail.com",
};

export const DEFAULT_PAGE_SIZE = 24;
export const ADMIN_PAGE_SIZE = 50;


