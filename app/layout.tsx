import { config } from "@/shared/config";
import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetBrains = JetBrains_Mono({
  variable: "--font-jet-brains-mono",
  subsets: ["latin"],
  weight: ["600", "400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(config.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default:
      "FX Checker | Multi-Currency Hub & Interactive Financial Analytics",
    template: "%s | FX Checker",
  },
  description:
    "Your all-in-one foreign exchange command center. Use our core real-time Converter to swap currencies instantly, analyze historical charts, compare multiple currency pairs side-by-side, pin favorite watchlists, and trace your calculations through automated activity logs.",
  keywords: [
    "currency converter",
    "historical forex rates",
    "currency comparison",
    "favorite currency tracker",
    "forex transaction logs",
    "live market exchange rates",
  ],
  authors: [{ name: "Vick Bake" }],
  creator: "Frontend Mentor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jetBrains.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
