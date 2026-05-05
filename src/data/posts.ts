export type PostCategory = "Technical" | "Personal" | "Random Ideas";

export type Post = {
  slug: string;
  title: string;
  date: string;
  category: PostCategory;
  content: string;
};

export const posts: Post[] = [
  {
    slug: "seeing-math",
    title: 'How "Seeing" Math Hacks Your Brain\'s Hardware',
    date: "May 2026",
    category: "Random Ideas",
    content: "Full post available.",
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
