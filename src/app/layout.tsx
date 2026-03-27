import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import FlowField from "@/components/FlowField";
import ThemeProvider from "@/components/ThemeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Zeyu(Michael) Lai",
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
      className={`${inter.variable} ${playfair.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-surface text-parchment font-sans antialiased">
        <ThemeProvider>
          <FlowField />
          <Navigation />
          <main className="pt-16 min-h-screen">
            {/* Solid background only on the centred content column.
                The canvas is visible in the full viewport behind this wrapper;
                the wrapper itself only spans the max-content width so the
                flow shows in the gutters and behind the nav. */}
            <div className="relative z-10 mx-auto max-w-5xl bg-surface/90 backdrop-blur-sm">
              {children}
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
