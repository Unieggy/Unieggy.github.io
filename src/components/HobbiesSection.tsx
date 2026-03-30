"use client";

import { useState } from "react";
import Link from "next/link";
import { posts as allPosts } from "@/data/posts";

type Category = "All" | "Technical" | "Personal" | "Random Ideas";

const categories: Category[] = ["All", "Technical", "Personal", "Random Ideas"];

const categoryMeta: Record<
  Exclude<Category, "All">,
  { color: string; shape: "square" | "circle" | "diamond" }
> = {
  Technical:      { color: "#6b8f7a", shape: "square"  },
  Personal:       { color: "#c4956a", shape: "circle"  },
  "Random Ideas": { color: "#9b8fc4", shape: "diamond" },
};

function Shape({ type, color }: { type: "square" | "circle" | "diamond"; color: string }) {
  const base: React.CSSProperties = {
    display: "inline-block",
    width: 7,
    height: 7,
    backgroundColor: color,
    flexShrink: 0,
  };
  if (type === "circle")  return <span style={{ ...base, borderRadius: "50%" }} />;
  if (type === "diamond") return <span style={{ ...base, transform: "rotate(45deg)" }} />;
  return <span style={{ ...base, borderRadius: 1 }} />;
}

const photos = [
  { label: "Sudoku",       src: "/sudoku.png" },
  { label: "Engineering",  src: "/eng.jpg" },
  { label: "Matcha",       src: "/matcha.jpg" },
  { label: "Plushies",     src: "/nailongxm.jpg" },
  { label: "Multitasking", src: "/multitask.jpg" },
  { label: "BFRB",         src: "/stress.png" },
];


export default function HobbiesSection() {
  const [active, setActive] = useState<Category>("All");

  const filtered =
    active === "All" ? allPosts : allPosts.filter((p) => p.category === active);

  return (
    <section className="py-16 max-w-2xl">

      {/* ── About ───────────────────────────────────────────── */}
      <p className="text-xs font-medium tracking-widest text-ash uppercase mb-10">
        About
      </p>

      {/* Bio */}
      <div className="text-parchment/80 text-base font-light leading-relaxed mb-10 max-w-2xl space-y-6">
        <p>
          Hi, I'm Zeyu Lai—I go by Michael—a first-year undergraduate at UC San Diego, working on a stubborn stammer, leaving my hair alone, and surviving on matcha with help from two very reliable plushies.
        </p>
        <p>
          I have a habit of dragging chatbots into infinite, good-natured arguments until I truly understand the concept behind it. I'm also constantly trying to wrap my head around the latest shifts in generative models and robotic architectures. Rather than just reading the theory, my main goal is to get my hands as dirty as possible with actual hardware and code, building alongside and learning from the greatest minds I can find.
        </p>

        <p>
          I also have what you might call "spiky attention"—or, if we're being generous, breadth-first thinking. My brain simply refuses to focus on just one thing at a time; for me to even feel like I'm actually working, I need to be juggling several tasks at once. I used to hate this about myself and fought it constantly, but I've slowly come to accept that I can't defy my own wiring: a little chaotic, but it turns out this is exactly how I operate best.
        </p>
      </div>

      {/* ── Divider ─────────────────────────────────────────── */}
      <div className="border-t border-surface-border/40 my-20" />


      {/* Things I Love */}
      <p className="text-xs font-medium tracking-widest text-ash uppercase mb-10">
        Things I Love
      </p>

      {/* Photo strip */}
      <div className="flex gap-3 mb-10 overflow-x-auto pb-1">
        {photos.map((p, i) => (
          <div key={i} className="shrink-0">
            <div className="w-24 h-24 overflow-hidden rounded-sm">
              <img
                src={p.src}
                alt={p.label}
                className="w-full h-full object-cover opacity-60 hover:opacity-80 transition-opacity duration-300"
              />
            </div>
            <p className="text-ash text-xs mt-1.5">{p.label}</p>
          </div>
        ))}
      </div>

      {/* ── Divider ─────────────────────────────────────────── */}
      <div className="border-t border-surface-border/40 my-20" />

      {/* ── Writing ─────────────────────────────────────────── */}
      <p className="text-xs font-medium tracking-widest text-ash uppercase mb-10">
        Writing
      </p>

      {/* Category filter */}
      <div className="flex gap-7 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`flex items-center gap-2 text-sm pb-px transition-colors duration-200 ${
              active === cat
                ? "text-parchment border-b border-parchment/50"
                : "text-ash hover:text-parchment"
            }`}
          >
            {cat !== "All" && (
              <Shape
                type={categoryMeta[cat].shape}
                color={categoryMeta[cat].color}
              />
            )}
            {cat}
          </button>
        ))}
      </div>

      {/* Post list */}
      <div className="border-t border-surface-border/40">
        {filtered.map((post, i) => (
          <Link
            key={i}
            href={`/blog/${post.slug}`}
            className="flex items-center gap-6 py-4 border-b border-surface-border/40 group"
          >
            <span className="w-20 shrink-0 text-ash text-sm">{post.date}</span>
            <span className="flex-1 text-parchment text-sm group-hover:text-sage transition-colors duration-200">
              {post.title}
            </span>
            <span className="flex items-center gap-1.5 text-ash text-xs shrink-0">
              <Shape
                type={categoryMeta[post.category].shape}
                color={categoryMeta[post.category].color}
              />
              {post.category}
            </span>
          </Link>
        ))}

        {filtered.length === 0 && (
          <p className="text-ash text-sm py-8">Nothing here yet.</p>
        )}
      </div>

    </section>
  );
}
