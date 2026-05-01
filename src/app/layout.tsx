import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// next/font — eliminates render-blocking Google Fonts request, improves LCP
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VoteSmart — India Election Assistant",
  description:
    "Your trusted guide to voting in India. Find your polling booth, check required documents, track election deadlines, and get answers to all your voting questions.",
  keywords: ["election", "voting", "India", "voter ID", "polling booth", "ECI", "first-time voter"],
  openGraph: {
    title: "VoteSmart — India Election Assistant",
    description: "Everything a first-time voter needs, in one clean app.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,          // allow user to zoom for accessibility
  viewportFit: "cover",     // safe-area support for notched devices
  themeColor: "#2563EB",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
