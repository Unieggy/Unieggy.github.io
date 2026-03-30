import { getPost, posts } from "@/data/posts";
import { notFound } from "next/navigation";
import Link from "next/link";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) notFound();

  const paragraphs = post.content.split(/\n\n+/).filter(Boolean);

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">

      {/* Back */}
      <Link
        href="/hobbies"
        className="text-ash text-sm hover:text-parchment transition-colors duration-200 mb-12 inline-block"
      >
        ← Back
      </Link>

      {/* Header */}
      <div className="mb-12">
        <p className="text-ash text-sm mb-3">{post.date} · {post.category}</p>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-parchment leading-snug">
          {post.title}
        </h1>
      </div>

      <div className="border-t border-surface-border/40 mb-12" />

      {/* Content */}
      <div className="space-y-6">
        {paragraphs.map((para, i) => (
          <p key={i} className="text-parchment/80 text-base font-light leading-relaxed">
            {para}
          </p>
        ))}
      </div>

    </div>
  );
}
