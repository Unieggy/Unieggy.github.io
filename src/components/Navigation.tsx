"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/hobbies", label: "About Me" },
];

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Render a stable placeholder before mount to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-lg border border-surface-border opacity-0" />
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className="w-9 h-9 flex items-center justify-center rounded-lg border border-surface-border text-ash hover:text-sage hover:border-sage/40 hover:bg-surface-raised transition-all duration-200"
    >
      {theme === "dark" ? (
        <Sun size={15} strokeWidth={1.5} />
      ) : (
        <Moon size={15} strokeWidth={1.5} />
      )}
    </button>
  );
}

export default function Navigation() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-surface-border/60 bg-surface/80 backdrop-blur-md transition-colors duration-250">
      <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-serif text-xl font-normal text-parchment tracking-tight hover:text-sage transition-colors duration-200"
        >
          Zeyu Lai
        </Link>

        {/* Right side: nav links + theme toggle */}
        <div className="flex items-center gap-3">
          <ul className="flex items-center gap-1">
            {links.map(({ href, label }) => {
              const isActive =
                href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`relative px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      isActive ? "text-parchment" : "text-ash hover:text-parchment"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-md bg-surface-raised border border-surface-border"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Divider */}
          <div className="w-px h-5 bg-surface-border" />

          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
