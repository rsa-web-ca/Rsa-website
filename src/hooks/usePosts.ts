import { useMemo } from "react";
import { byNewest, type BlogPost } from "../data/frontmatter";
import { posts as markdownPosts } from "../data/blog";
import { useCms, type CmsFile, type CmsPost } from "../lib/cms";

/** A post from either source; CRM posts may carry downloads and a cover image. */
export interface SitePost extends BlogPost {
  files?: CmsFile[];
  cover?: CmsFile | null;
  /** The body is HTML from the CRM editor (cleaned again before it is shown), not Markdown. */
  html?: boolean;
  inline?: CmsFile[];
}

function fromCms(p: CmsPost): SitePost {
  const html = p.format === "html";
  const text = html ? p.body.replace(/<[^>]*>/g, " ") : p.body;
  const words = text.trim().split(/\s+/).length;
  return {
    slug: p.slug,
    title: p.title,
    date: p.date,
    author: p.author,
    summary: p.summary,
    tags: p.tags ?? [],
    draft: false,
    readingTime: Math.max(1, Math.round(words / 200)),
    body: p.body,
    files: p.attachments,
    cover: p.cover,
    html,
    inline: p.inline,
  };
}

/**
 * Markdown posts bundled with the site plus posts published from the CRM,
 * newest first. A markdown post wins a slug clash: its route is static and
 * already built, so the CRM post could never be reached at that address.
 */
export function usePosts(): { posts: SitePost[]; ready: boolean } {
  const { content, ready } = useCms();
  const posts = useMemo(() => {
    const taken = new Set(markdownPosts.map((p) => p.slug));
    const cms = (content?.posts ?? []).filter((p) => !taken.has(p.slug)).map(fromCms);
    return [...markdownPosts, ...cms].sort(byNewest);
  }, [content]);
  return { posts, ready };
}
