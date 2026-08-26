import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CrisisPulse | Global Conflict, Climate Disasters & AI Solutions",
  description: "Real-time planetary intelligence platform tracking AI warfare, climate disasters, and worldwide humanitarian recovery efforts.",
  keywords: ["global crisis", "ai warfare", "climate disaster", "un relief", "autonomous drones", "humanitarian ai", "crisispulse"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="min-h-screen antialiased selection:bg-cyan-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
