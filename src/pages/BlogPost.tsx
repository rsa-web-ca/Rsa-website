import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import PostHtml from "../components/PostHtml";
import remarkGfm from "remark-gfm";
import PageHeader from "../components/PageHeader";
import ContactCta from "../components/ContactCta";
import Reveal from "../components/Reveal";
import ReadingProgress from "../components/ReadingProgress";
import NotFound from "./NotFound";
import { formatDate, type BlogPost } from "../data/blog";
import { usePosts } from "../hooks/usePosts";
import { formatSize } from "../lib/cms";
import { usePageMeta } from "../hooks/usePageMeta";

interface BlogPostProps {
  /** Set for markdown posts (one static route each); CRM posts arrive via /insights/:slug. */
  slug?: string;
}

export default function BlogPost({ slug: fixedSlug }: BlogPostProps) {
  const params = useParams();
  const slug = fixedSlug ?? params.slug ?? "";
  const { posts, ready, failed, retry } = usePosts();
  const index = posts.findIndex((p) => p.slug === slug);
  const post = index === -1 ? undefined : posts[index];

  // Reserve the hook call before any early return to keep hook order stable.
  usePageMeta(post?.title ?? "Post not found", post?.summary, post?.tags.join(", "), "article");

  if (!post) {
    // A CRM post is only known once the CRM answers; until then, wait rather than 404.
    if (!ready) return <div className="mx-auto max-w-3xl px-4 py-24 text-ink-soft" role="status">Loading…</div>;
    // "Not found" only once the CRM has answered without it. If the CRM could
    // not be reached, the post may well exist: say so and offer to try again.
    if (failed) {
      return (
        <div className="mx-auto max-w-3xl px-4 py-24" role="alert">
          <h1 className="font-display text-3xl font-semibold text-ink">This article is temporarily unavailable</h1>
          <p className="mt-3 max-w-prose text-ink-soft">
            We could not load it just now. Please try again in a moment, or browse the other articles.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={retry}
              className="cursor-pointer rounded-lg bg-maroon-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-maroon-800"
            >
              Try again
            </button>
            <Link to="/insights" className="rounded-lg border border-line px-6 py-2.5 text-sm font-semibold text-ink hover:border-accent hover:text-accent">
              All articles
            </Link>
          </div>
        </div>
      );
    }
    return <NotFound />;
  }

  const newer = index > 0 ? posts[index - 1] : undefined;
  const older = index < posts.length - 1 ? posts[index + 1] : undefined;

  const byline = [
    post.author,
    formatDate(post.date),
    `${post.readingTime} min read`,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <ReadingProgress />
      <PageHeader title={post.title} lede={byline || undefined} />
      <Reveal as="section" className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        {post.updated && (
          <p className="mb-8 text-sm text-ink-soft">
            Last updated {formatDate(post.updated)}
          </p>
        )}
        {post.cover && (
          <img src={post.cover.url} alt="" className="mb-10 aspect-[16/9] w-full rounded-lg border border-line object-cover" />
        )}
        <div className="blog-prose">
          {post.html ? (
            <PostHtml html={post.body} files={post.inline ?? []} />
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
          )}
        </div>
        {post.files && post.files.length > 0 && (
          <section className="mt-12 border-t border-line pt-8" aria-labelledby="downloads">
            <h2 id="downloads" className="font-display text-xl font-medium text-ink">Downloads</h2>
            <ul className="mt-4 divide-y divide-line rounded-lg border border-line">
              {post.files.map((f) => (
                <li key={f.id}>
                  <a href={f.url} className="flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-surface-raised">
                    <span className="min-w-0 truncate font-medium text-ink">{f.name}</span>
                    <span className="shrink-0 text-sm text-ink-soft">{formatSize(f.sizeBytes)}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
        {post.tags.length > 0 && (
          <ul className="mt-12 flex flex-wrap gap-2" aria-label="Tags">
            {post.tags.map((tag) => (
              <li key={tag}>
                <Link
                  to={`/insights?tag=${encodeURIComponent(tag)}`}
                  className="inline-block rounded-full border border-line bg-surface-raised px-3 py-1 text-xs font-medium text-ink-soft transition-colors hover:border-accent hover:text-accent"
                >
                  {tag}
                </Link>
              </li>
            ))}
          </ul>
        )}
        {(older || newer) && (
          <nav
            className="mt-14 grid gap-4 border-t border-line pt-8 sm:grid-cols-2"
            aria-label="More posts"
          >
            {older ? <PostLink post={older} direction="previous" /> : <span className="hidden sm:block" />}
            {newer && <PostLink post={newer} direction="next" />}
          </nav>
        )}
        <div className="mt-8 text-center">
          <Link
            to="/insights"
            className="inline-flex items-center gap-2 text-sm font-semibold text-accent transition-colors hover:text-accent-strong"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z"
                clipRule="evenodd"
              />
            </svg>
            Back to all posts
          </Link>
        </div>
      </Reveal>
      <ContactCta />
    </>
  );
}

/** A previous/next post card used in the post footer navigation. */
function PostLink({ post, direction }: { post: BlogPost; direction: "previous" | "next" }) {
  const isNext = direction === "next";
  return (
    <Link
      to={`/insights/${post.slug}`}
      className={`group flex flex-col gap-1 rounded border border-line bg-surface p-5 transition-colors duration-200 hover:border-accent hover:bg-surface-raised ${
        isNext ? "sm:text-right" : ""
      }`}
    >
      <span
        className={`inline-flex items-center gap-1.5 text-sm font-semibold text-ink ${
          isNext ? "sm:justify-end" : ""
        }`}
      >
        {!isNext && (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
            <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
          </svg>
        )}
        {isNext ? "Next post" : "Previous post"}
        {isNext && (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
            <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
          </svg>
        )}
      </span>
      <span className="font-display text-lg font-semibold text-ink transition-colors duration-200 group-hover:text-accent">
        {post.title}
      </span>
    </Link>
  );
}
