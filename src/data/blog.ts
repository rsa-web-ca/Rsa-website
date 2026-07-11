// Markdown-driven blog. Drop a `.md` file into src/content/blog/ with a
// frontmatter block and it appears on the index (/blogs) and gets its own
// route (/blogs/<filename>) automatically — no code changes per post.
//
// Frontmatter parsing lives in ./frontmatter (dependency-free) so the same
// logic can run at build time to generate the RSS feed and sitemap.

import { parsePost, byNewest, type BlogPost } from "./frontmatter";

export type { BlogPost };

// Eagerly import every markdown file as a raw string at build time.
const modules = import.meta.glob<string>("../content/blog/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

export const posts: BlogPost[] = Object.entries(modules)
  .map(([path, raw]) => parsePost(path.split("/").pop()!.replace(/\.md$/, ""), raw))
  // Hide drafts from the production build, but keep them visible in dev.
  .filter((p) => import.meta.env.DEV || !p.draft)
  .sort(byNewest);

/** Every tag used across published posts, sorted alphabetically. */
export const allTags: string[] = [...new Set(posts.flatMap((p) => p.tags))].sort((a, b) =>
  a.localeCompare(b),
);

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

/**
 * Neighbouring posts for prev/next navigation. `posts` is newest-first, so the
 * entry before is newer and the entry after is older.
 */
export function getAdjacentPosts(slug: string): {
  newer?: BlogPost;
  older?: BlogPost;
} {
  const i = posts.findIndex((p) => p.slug === slug);
  if (i === -1) return {};
  return {
    newer: i > 0 ? posts[i - 1] : undefined,
    older: i < posts.length - 1 ? posts[i + 1] : undefined,
  };
}

/** Human-friendly date, e.g. "11 July 2026". Falls back to the raw string. */
export function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}
