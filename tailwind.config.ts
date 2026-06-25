import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        surface: "#f8fafc",
        foreground: "#0f172a",
        muted: "#64748b",
        border: "#e2e8f0",
        accent: {
          DEFAULT: "#ef4444", // Standard YouTube/Portfolio red
          hover: "#dc2626",
          light: "#fee2e2",
        },
        destructive: "#ef4444",
        success: "#22c55e",
      },
      borderRadius: {
        "xl": "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
      container: {
        center: true,
        padding: "1.5rem",
        screens: {
          sm: "640px",
          md: "768px",
          lg: "1024px",
          xl: "1280px",
        },
      },
      boxShadow: {
        sm: "0 2px 8px rgba(0,0,0,0.04)",
        md: "0 8px 24px rgba(149, 157, 165, 0.2)",
        lg: "0 12px 32px rgba(149, 157, 165, 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
