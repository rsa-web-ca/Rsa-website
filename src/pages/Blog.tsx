import { useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import ContactCta from "../components/ContactCta";
import Reveal from "../components/Reveal";
import { posts, allTags, formatDate } from "../data/blog";
import { usePageMeta } from "../hooks/usePageMeta";

const PAGE_SIZE = 6;

export default function Blog() {
  usePageMeta(
    "Blog",
    "Notes on audit, taxation and compliance from R Shivakumar & Associates, Chartered Accountants, Bengaluru.",
  );

  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const activeTag = params.get("tag") ?? "";
  const requestedPage = Math.max(1, Number.parseInt(params.get("page") ?? "1", 10) || 1);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return posts.filter((p) => {
      if (activeTag && !p.tags.includes(activeTag)) return false;
      if (needle) {
        const hay = [p.title, p.summary ?? "", p.tags.join(" "), p.body].join(" ").toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [q, activeTag]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Scroll back to the top of the page whenever the page number changes.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [page]);

  /** Build a /blogs URL with the current params plus the given overrides. */
  function hrefWith(overrides: Record<string, string | number | undefined>): string {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(overrides)) {
      if (value === undefined || value === "") next.delete(key);
      else next.set(key, String(value));
    }
    const s = next.toString();
    return s ? `/blogs?${s}` : "/blogs";
  }

  function onSearch(value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set("q", value);
    else next.delete("q");
    next.delete("page");
    setParams(next, { replace: true });
  }

  const isFiltered = Boolean(q || activeTag);

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
          <>
            {/* Search + tag filters */}
            <div className="flex flex-col gap-6 border-b border-line pb-8">
              <label className="relative block max-w-md">
                <span className="sr-only">Search posts</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-soft"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  type="search"
                  value={q}
                  onChange={(e) => onSearch(e.target.value)}
                  placeholder="Search posts…"
                  className="w-full rounded-lg border border-line bg-surface py-2.5 pl-10 pr-3 text-sm text-ink placeholder:text-ink-soft focus:border-accent focus:outline-none"
                />
              </label>

              {allTags.length > 0 && (
                <nav className="flex flex-wrap gap-2" aria-label="Filter by tag">
                  <Link
                    to={hrefWith({ tag: undefined, page: undefined })}
                    aria-current={!activeTag ? "true" : undefined}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      !activeTag
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-line bg-surface-raised text-ink-soft hover:border-accent hover:text-accent"
                    }`}
                  >
                    All posts
                  </Link>
                  {allTags.map((tag) => {
                    const isActive = tag === activeTag;
                    return (
                      <Link
                        key={tag}
                        to={hrefWith({ tag: isActive ? undefined : tag, page: undefined })}
                        aria-current={isActive ? "true" : undefined}
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                          isActive
                            ? "border-accent bg-accent/10 text-accent"
                            : "border-line bg-surface-raised text-ink-soft hover:border-accent hover:text-accent"
                        }`}
                      >
                        {tag}
                      </Link>
                    );
                  })}
                </nav>
              )}
            </div>

            {/* Result summary */}
            {isFiltered && (
              <p className="mt-6 text-sm text-ink-soft">
                {filtered.length} {filtered.length === 1 ? "post" : "posts"}
                {activeTag && (
                  <>
                    {" "}
                    tagged <span className="font-semibold text-ink">{activeTag}</span>
                  </>
                )}
                {q && (
                  <>
                    {" "}
                    matching <span className="font-semibold text-ink">“{q}”</span>
                  </>
                )}
                {" · "}
                <Link to="/blogs" className="font-semibold text-accent hover:text-accent-strong">
                  Clear
                </Link>
              </p>
            )}

            {filtered.length === 0 ? (
              <p className="mt-10 text-lg leading-relaxed text-ink-soft">
                No posts match your search.{" "}
                <Link to="/blogs" className="font-semibold text-accent hover:text-accent-strong">
                  View all posts
                </Link>
                .
              </p>
            ) : (
              <ul className="mt-2 divide-y divide-line">
                {pageItems.map((p, i) => (
                  <Reveal as="li" key={p.slug} delay={Math.min(i * 50, 250)} className="relative">
                    <div className="group grid gap-2 py-8 sm:grid-cols-[minmax(0,12rem)_1fr_auto] sm:items-start sm:gap-8">
                      <div className="text-sm text-ink-soft">
                        {p.date && (
                          <time dateTime={p.date} className="font-medium uppercase tracking-[0.12em]">
                            {formatDate(p.date)}
                          </time>
                        )}
                        <span className="mt-1 block text-xs">{p.readingTime} min read</span>
                      </div>
                      <div>
                        <h2 className="font-display text-2xl font-semibold text-ink transition-colors duration-200 group-hover:text-accent">
                          <Link to={`/blogs/${p.slug}`} className="after:absolute after:inset-0">
                            {p.title}
                          </Link>
                        </h2>
                        {p.summary && (
                          <p className="mt-2 max-w-prose text-sm leading-relaxed text-ink-soft sm:text-base">
                            {p.summary}
                          </p>
                        )}
                        {p.tags.length > 0 && (
                          <ul className="relative z-10 mt-3 flex flex-wrap gap-2" aria-label="Tags">
                            {p.tags.map((tag) => (
                              <li key={tag}>
                                <Link
                                  to={hrefWith({ tag, q: undefined, page: undefined })}
                                  className="inline-block rounded-full border border-line bg-surface-raised px-2.5 py-0.5 text-xs font-medium text-ink-soft transition-colors hover:border-accent hover:text-accent"
                                >
                                  {tag}
                                </Link>
                              </li>
                            ))}
                          </ul>
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
                    </div>
                  </Reveal>
                ))}
              </ul>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <nav
                className="mt-12 flex items-center justify-center gap-1.5"
                aria-label="Pagination"
              >
                <PageLink to={hrefWith({ page: page - 1 })} disabled={page === 1} rel="prev">
                  <span aria-hidden="true">←</span>
                  <span className="sr-only">Previous page</span>
                </PageLink>
                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((n) => (
                  <PageLink key={n} to={hrefWith({ page: n === 1 ? undefined : n })} current={n === page}>
                    {n}
                  </PageLink>
                ))}
                <PageLink to={hrefWith({ page: page + 1 })} disabled={page === totalPages} rel="next">
                  <span aria-hidden="true">→</span>
                  <span className="sr-only">Next page</span>
                </PageLink>
              </nav>
            )}
          </>
        )}
      </section>
      <ContactCta />
    </>
  );
}

interface PageLinkProps {
  to: string;
  children: React.ReactNode;
  current?: boolean;
  disabled?: boolean;
  rel?: string;
}

function PageLink({ to, children, current, disabled, rel }: PageLinkProps) {
  const base =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors";
  if (disabled) {
    return (
      <span
        aria-disabled="true"
        className={`${base} cursor-not-allowed border-line text-ink-soft/40`}
      >
        {children}
      </span>
    );
  }
  return (
    <Link
      to={to}
      rel={rel}
      aria-current={current ? "page" : undefined}
      className={`${base} ${
        current
          ? "border-accent bg-accent/10 text-accent"
          : "border-line text-ink-soft hover:border-accent hover:text-accent"
      }`}
    >
      {children}
    </Link>
  );
}
