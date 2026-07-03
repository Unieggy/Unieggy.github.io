"use client";

import { useState } from "react";
import Link from "next/link";
import { posts as allPosts } from "@/data/posts";
import { useLang } from "@/i18n/LanguageContext";

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
  const { t } = useLang();

  const filtered =
    active === "All" ? allPosts : allPosts.filter((p) => p.category === active);

  return (
    <section className="py-16 max-w-2xl">

      {/* ── About ───────────────────────────────────────────── */}
      <p className="text-xs font-medium tracking-widest text-ash uppercase mb-7">
        {t.hobbies.about}
      </p>

      {/* Bio */}
      <div className="text-parchment/80 text-base font-light leading-relaxed max-w-2xl space-y-6">
        {t.hobbies.bio.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      {/* ── Divider ─────────────────────────────────────────── */}
      <div className="border-t border-surface-border/60 my-15" />


      {/* Things I Love */}
      <p className="text-xs font-medium tracking-widest text-ash uppercase mb-7">
        {t.hobbies.thingsILove}
      </p>

      {/* Photo strip */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {photos.map((p, i) => {
          const caption = t.hobbies.photos[p.label as keyof typeof t.hobbies.photos];
          return (
            <div key={i} className="shrink-0">
              <div className="w-24 h-24 overflow-hidden rounded-sm">
                <img
                  src={p.src}
                  alt={caption}
                  className="w-full h-full object-cover opacity-60 hover:opacity-80 transition-opacity duration-300"
                />
              </div>
              <p className="text-ash text-xs mt-1.5">{caption}</p>
            </div>
          );
        })}
      </div>

      {/* ── Divider ─────────────────────────────────────────── */}
      <div className="border-t border-surface-border/60 my-15" />

      {/* ── Writing ─────────────────────────────────────────── */}
      <p className="text-xs font-medium tracking-widest text-ash uppercase mb-7">
        {t.hobbies.writing}
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
            {t.hobbies.categories[cat]}
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
              {t.hobbies.categories[post.category]}
            </span>
          </Link>
        ))}

        {filtered.length === 0 && (
          <p className="text-ash text-sm py-8">{t.hobbies.empty}</p>
        )}
      </div>

    </section>
  );
}
