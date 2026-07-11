import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import ContactCta from "../components/ContactCta";
import Reveal from "../components/Reveal";
import { posts, formatDate } from "../data/blog";
import { usePageMeta } from "../hooks/usePageMeta";

export default function Blog() {
  usePageMeta(
    "Blog",
    "Notes on audit, taxation and compliance from R Shivakumar & Associates, Chartered Accountants, Bengaluru.",
  );
  return (
    <>
      <PageHeader
        title="Blog"
        lede="Plain-spoken notes on audit, taxation and compliance — from our desk to yours."
      />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {posts.length === 0 ? (
          <p className="text-lg leading-relaxed text-ink-soft">No posts yet. Check back soon.</p>
        ) : (
          <ul className="divide-y divide-line">
            {posts.map((p, i) => (
              <Reveal as="li" key={p.slug} delay={Math.min(i * 50, 250)}>
                <Link
                  to={`/blogs/${p.slug}`}
                  className="group grid gap-2 py-8 transition-colors duration-200 sm:grid-cols-[minmax(0,12rem)_1fr_auto] sm:items-baseline sm:gap-8"
                >
                  {p.date && (
                    <time
                      dateTime={p.date}
                      className="text-sm font-medium uppercase tracking-[0.12em] text-ink-soft"
                    >
                      {formatDate(p.date)}
                    </time>
                  )}
                  <div>
                    <h2 className="font-display text-2xl font-semibold text-ink transition-colors duration-200 group-hover:text-accent">
                      {p.title}
                    </h2>
                    {p.summary && (
                      <p className="mt-2 max-w-prose text-sm leading-relaxed text-ink-soft sm:text-base">
                        {p.summary}
                      </p>
                    )}
                  </div>
                  <span className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-accent sm:mt-0">
                    Read more
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        )}
      </section>
      <ContactCta />
    </>
  );
}
