import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "@/styles/globals.css";
import { ErrorBoundary } from "@/components/error-boundary";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });

export const metadata: Metadata = {
  title: {
    default: "CreatorHall",
    template: "%s | CreatorHall",
  },
  description: "Content aggregation platform for creators. Comedy, stories, and entertainment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className={`${inter.variable} ${jakarta.variable} font-sans min-h-screen bg-background text-foreground antialiased selection:bg-accent/10 selection:text-accent`}>
        <ErrorBoundary>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-foreground focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
          >
            Skip to content
          </a>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
