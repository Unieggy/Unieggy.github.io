export type PostCategory = "Technical" | "Personal" | "Random Ideas";

export type Post = {
  slug: string;
  title: string;
  date: string;
  category: PostCategory;
  content: string;
};

export const posts: Post[] = [
  /*
  {
    slug: "poem1",
    title: "Random Poem Wrote in High School",
    date: "Mar 2026",
    category: "Personal",
    content: `
Write your post content here. You can use multiple paragraphs.

Each blank line creates a new paragraph. Just type naturally.

This is the third paragraph.
    `.trim(),
  },
  */
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
