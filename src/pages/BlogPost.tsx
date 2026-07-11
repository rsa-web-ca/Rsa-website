import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import PageHeader from "../components/PageHeader";
import ContactCta from "../components/ContactCta";
import Reveal from "../components/Reveal";
import NotFound from "./NotFound";
import { getPost, formatDate } from "../data/blog";
import { usePageMeta } from "../hooks/usePageMeta";

interface BlogPostProps {
  slug: string;
}

export default function BlogPost({ slug }: BlogPostProps) {
  const post = getPost(slug);

  // Reserve the hook call before any early return to keep hook order stable.
  usePageMeta(post?.title ?? "Post not found", post?.summary, post?.tags.join(", "));

  if (!post) return <NotFound />;

  const byline = [
    post.author,
    formatDate(post.date),
    `${post.readingTime} min read`,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <PageHeader title={post.title} lede={byline || undefined} />
      <Reveal as="section" className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        {post.updated && (
          <p className="mb-8 text-sm text-ink-soft">
            Last updated {formatDate(post.updated)}
          </p>
        )}
        <div className="blog-prose">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
        </div>
        {post.tags.length > 0 && (
          <ul className="mt-12 flex flex-wrap gap-2" aria-label="Tags">
            {post.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-line bg-surface-raised px-3 py-1 text-xs font-medium text-ink-soft"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-14 border-t border-line pt-8">
          <Link
            to="/blogs"
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
