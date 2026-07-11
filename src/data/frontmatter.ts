// Pure, dependency-free frontmatter parsing shared by the browser blog loader
// (src/data/blog.ts, via import.meta.glob) and the build-time feed/sitemap
// generator (vite.config.ts, via fs). Keep this module free of any Vite- or
// browser-only APIs so it runs in plain Node too.

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
export function parseFrontmatter(raw: string): { data: Record<string, string>; body: string } {
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
export function stripQuotes(value: string): string {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

/** Parse `a, b, c` or `[a, b, c]` into a trimmed, de-duplicated list. */
export function parseTags(value: string | undefined): string[] {
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
export function estimateReadingTime(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Turn a markdown file's slug + raw contents into a structured post. */
export function parsePost(slug: string, raw: string): BlogPost {
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
}

/** Sort comparator: newest date first. */
export function byNewest(a: BlogPost, b: BlogPost): number {
  return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
}
