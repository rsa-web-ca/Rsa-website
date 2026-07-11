// Markdown-driven blog. Drop a `.md` file into src/content/blog/ with a
// frontmatter block and it appears on the index (/blogs) and gets its own
// route (/blogs/<filename>) automatically — no code changes per post.

export interface BlogPost {
  slug: string;
  title: string;
  /** ISO date string, e.g. "2026-07-11". */
  date: string;
  /** Optional ISO date the post was last revised. */
  updated?: string;
  author?: string;
  /** Short teaser shown on the blog index; also used as the meta description. */
  summary?: string;
  /** Keywords/tags — drive the on-page pills and the meta keywords tag. */
  tags: string[];
  /** When true, hidden from the production build (still visible in dev). */
  draft: boolean;
  /** Estimated reading time in whole minutes, derived from the body. */
  readingTime: number;
  /** Raw markdown body (frontmatter stripped). */
  body: string;
}

/** A very small YAML-frontmatter parser — enough for our flat string fields. */
function parseFrontmatter(raw: string): { data: Record<string, string>; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!match) return { data: {}, body: raw };

  const data: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
    if (!kv) continue;
    data[kv[1]] = stripQuotes(kv[2].trim());
  }
  return { data, body: match[2] };
}

/** Strip a single pair of matching surrounding quotes, if present. */
function stripQuotes(value: string): string {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

/** Parse `a, b, c` or `[a, b, c]` into a trimmed, de-duplicated list. */
function parseTags(value: string | undefined): string[] {
  if (!value) return [];
  const inner = value.replace(/^\[/, "").replace(/\]$/, "");
  const seen = new Set<string>();
  for (const part of inner.split(",")) {
    const tag = stripQuotes(part.trim());
    if (tag) seen.add(tag);
  }
  return [...seen];
}

/** Rough reading time: ~200 words per minute, minimum one minute. */
function estimateReadingTime(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

// Eagerly import every markdown file as a raw string at build time.
const modules = import.meta.glob<string>("../content/blog/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

export const posts: BlogPost[] = Object.entries(modules)
  .map(([path, raw]) => {
    const slug = path.split("/").pop()!.replace(/\.md$/, "");
    const { data, body } = parseFrontmatter(raw);
    const trimmedBody = body.trim();
    return {
      slug,
      title: data.title ?? slug,
      date: data.date ?? "",
      updated: data.updated || undefined,
      author: data.author,
      summary: data.summary,
      tags: parseTags(data.tags),
      draft: data.draft === "true",
      readingTime: estimateReadingTime(trimmedBody),
      body: trimmedBody,
    };
  })
  // Hide drafts from the production build, but keep them visible in dev.
  .filter((p) => import.meta.env.DEV || !p.draft)
  // Newest first.
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

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
