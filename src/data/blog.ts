// Markdown-driven blog. Drop a `.md` file into src/content/blog/ with a
// frontmatter block and it appears on the index (/blogs) and gets its own
// route (/blogs/<filename>) automatically — no code changes per post.

export interface BlogPost {
  slug: string;
  title: string;
  /** ISO date string, e.g. "2026-07-11". */
  date: string;
  author?: string;
  /** Short teaser shown on the blog index. */
  summary?: string;
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
    let value = kv[2].trim();
    // Strip matching surrounding quotes if present.
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    data[kv[1]] = value;
  }
  return { data, body: match[2] };
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
    return {
      slug,
      title: data.title ?? slug,
      date: data.date ?? "",
      author: data.author,
      summary: data.summary,
      body: body.trim(),
    };
  })
  // Newest first.
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

/** Human-friendly date, e.g. "11 July 2026". Falls back to the raw string. */
export function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}
