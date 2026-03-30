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
    slug: "poem1",
    title: "Random Poems",
    date: "Mar 2026",
    category: "Personal",
    content: `
    
You are being trolled!
    `.trim(),
  },
  
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
