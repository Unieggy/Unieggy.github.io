import type { Metadata } from "next";
import { Inter, Spectral } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import FlowField from "@/components/FlowField";
import ThemeProvider from "@/components/ThemeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const spectral = Spectral({
  variable: "--font-spectral",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
});

export const metadata: Metadata = {
  title: "Zeyu (Michael) Lai",
  description:
    "Undergraduate Student interested in imitation learning, reinforcement learning, and generalist policy learning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spectral.variable} h-full`}
      suppressHydrationWarning
    >
  
      <body className="min-h-full bg-surface text-parchment font-sans antialiased">
        <ThemeProvider>
          <FlowField />
          <Navigation />
          <main className="pt-16 min-h-screen">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
