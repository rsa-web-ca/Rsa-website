import { Link } from "react-router-dom";
import { services } from "../data/services";
import { industries } from "../data/industries";
import { site } from "../data/site";
import { posts, formatDate } from "../data/blog";
import Reveal from "../components/Reveal";
import { usePageMeta } from "../hooks/usePageMeta";

const latestPost = posts[0];

function ArrowRight({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
      <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M11 3a.75.75 0 0 0 0 1.5h2.44l-6.22 6.22a.75.75 0 1 0 1.06 1.06L14.5 5.56V8a.75.75 0 0 0 1.5 0V3.75A.75.75 0 0 0 15.25 3H11Z" />
      <path d="M4.75 5A1.75 1.75 0 0 0 3 6.75v8.5C3 16.216 3.784 17 4.75 17h8.5A1.75 1.75 0 0 0 15 15.25V11.5a.75.75 0 0 0-1.5 0v3.75a.25.25 0 0 1-.25.25h-8.5a.25.25 0 0 1-.25-.25v-8.5a.25.25 0 0 1 .25-.25H8.5A.75.75 0 0 0 8.5 5H4.75Z" />
    </svg>
  );
}

/** Section label set in small caps above a rule — the one structural device the page repeats. */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="border-b border-line pb-3 text-sm font-semibold text-ink">
      {children}
    </p>
  );
}

export default function Home() {
  usePageMeta();
  const years = new Date().getFullYear() - site.since;

  return (
    <>
      {/* Opening: the firm's line on the left, its particulars on the right — like a letterhead */}
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-7xl gap-14 px-4 pb-16 pt-12 sm:px-6 sm:pt-24 lg:grid-cols-12 lg:gap-10 lg:px-8 lg:pb-24">
          <div className="lg:col-span-7">
            <p className="text-sm font-medium text-ink-soft">
              {site.name} · {site.tagline}
            </p>
            <h1 className="mt-6 font-display text-[40px] font-medium leading-[1.06] tracking-[-0.02em] text-ink sm:text-6xl lg:text-[68px]">
              Rendering audit, tax and advisory services since{" "}
              <span className="figures-oldstyle text-accent">{site.since}</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-soft">
              M/s R Shivakumar &amp; Associates is a firm of chartered accountants in Bangalore.
              Since {site.since}, we have been rendering services, especially in areas such as
              audit &amp; assurance, taxation, tax litigation and consultancy services.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                to="/contact"
                className="rounded bg-maroon-700 px-7 py-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-maroon-800"
              >
                Get in Touch
              </Link>
              <Link
                to="/services"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-ink underline decoration-line decoration-2 underline-offset-[6px] transition-colors hover:text-accent hover:decoration-accent"
              >
                Explore Our Services
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          <aside className="lg:col-span-4 lg:col-start-9 lg:pt-12" aria-labelledby="particulars">
            <h2 id="particulars" className="border-b-2 border-ink pb-3 text-sm font-semibold text-ink">
              The firm
            </h2>
            <dl className="divide-y divide-line text-[15px]">
              <div className="grid grid-cols-[104px_1fr] gap-4 py-4">
                <dt className="text-ink-soft">Established</dt>
                <dd className="font-display text-xl text-ink figures-oldstyle">{site.since}</dd>
              </div>
              <div className="grid grid-cols-[104px_1fr] gap-4 py-4">
                <dt className="text-ink-soft">Practice</dt>
                <dd className="text-ink">{years}+ years · {services.length} service lines</dd>
              </div>
              <div className="grid grid-cols-[104px_1fr] gap-4 py-4">
                <dt className="text-ink-soft">Office</dt>
                <dd className="leading-relaxed text-ink">
                  <address className="not-italic">{site.address}</address>
                  <a
                    href={site.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-ink underline decoration-line decoration-2 underline-offset-[6px] transition-colors hover:text-accent hover:decoration-accent"
                  >
                    Get directions <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </dd>
              </div>
              <div className="grid grid-cols-[104px_1fr] gap-4 py-4">
                <dt className="text-ink-soft">Telephone</dt>
                <dd>
                  <a href={site.phoneHref} className="text-ink transition-colors hover:text-accent">{site.phone}</a>
                </dd>
              </div>
              <div className="grid grid-cols-[104px_1fr] gap-4 py-4">
                <dt className="text-ink-soft">Email</dt>
                <dd className="min-w-0 break-words">
                  <a href={`mailto:${site.email}`} className="text-ink transition-colors hover:text-accent">{site.email}</a>
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      {/* Services — a numbered index rather than a grid of cards */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <SectionLabel>Our Services</SectionLabel>
              <h2 className="mt-6 font-display text-3xl font-medium leading-tight text-ink sm:text-4xl">
                Audit, taxation, advisory and compliance
              </h2>
              <p className="mt-4 max-w-sm leading-relaxed text-ink-soft">
                Nine service lines covering audit, taxation, advisory and compliance.
              </p>
              <Link
                to="/services"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ink underline decoration-line decoration-2 underline-offset-[6px] transition-colors duration-200 hover:text-accent hover:decoration-accent"
              >
                View all services <ArrowRight />
              </Link>
            </div>
          </Reveal>

          <ol className="border-t-2 border-ink lg:col-span-8">
            {services.map((s, i) => (
              <li key={s.slug} className="border-b border-line">
                <Link
                  to={`/${s.slug}`}
                  className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 py-6 sm:grid-cols-[3.5rem_1fr_auto] sm:gap-x-6"
                >
                  <span className="font-display text-lg text-ink-soft tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="block font-display text-xl font-medium text-ink transition-colors duration-200 group-hover:text-accent sm:text-2xl">
                      {s.title}
                    </span>
                    <span className="mt-1.5 block max-w-xl text-[15px] leading-relaxed text-ink-soft">{s.summary}</span>
                  </span>
                  <ArrowRight className="h-5 w-5 self-center text-ink-soft transition-[color,transform] duration-150 group-hover:translate-x-0.5 group-hover:text-ink" />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Industries */}
      <section className="border-y border-line bg-surface-raised">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-8 lg:py-24">
          <Reveal className="lg:col-span-4">
            <SectionLabel>Industries / Sectors</SectionLabel>
            <h2 className="mt-6 font-display text-3xl font-medium leading-tight text-ink sm:text-4xl">
              Industries we serve
            </h2>
            <p className="mt-4 max-w-sm leading-relaxed text-ink-soft">
              Sector experience spanning manufacturing, healthcare, technology and real estate.
            </p>
            <Link
              to="/industries"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ink underline decoration-line decoration-2 underline-offset-[6px] transition-colors duration-200 hover:text-accent hover:decoration-accent"
            >
              See all sectors <ArrowRight />
            </Link>
          </Reveal>
          <Reveal className="lg:col-span-8">
            <ul className="grid border-t-2 border-ink sm:grid-cols-2 sm:gap-x-10">
              {industries.map((ind) => (
                <li key={ind.name} className="border-b border-line py-4">
                  <span className="font-medium text-ink">{ind.name}</span>
                  {ind.detail && <span className="mt-1 block text-sm leading-relaxed text-ink-soft">{ind.detail}</span>}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Latest from the blog */}
      {latestPost && (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <Reveal>
            <div className="flex items-end justify-between gap-4 border-b border-line pb-3">
              <h2 className="text-sm font-semibold text-ink">From the blog</h2>
              <Link to="/blogs" className="text-sm font-semibold text-ink underline decoration-line decoration-2 underline-offset-[6px] transition-colors hover:text-accent hover:decoration-accent">
                View all posts
              </Link>
            </div>
            <Link
              to={`/blogs/${latestPost.slug}`}
              className="group grid gap-3 py-8 md:grid-cols-12 md:gap-10"
            >
              <div className="text-sm text-ink-soft md:col-span-3">
                {latestPost.date && (
                  <time dateTime={latestPost.date} className="block">{formatDate(latestPost.date)}</time>
                )}
                <span>{latestPost.readingTime} min read</span>
              </div>
              <div className="md:col-span-9">
                <h3 className="font-display text-2xl font-medium text-ink transition-colors duration-200 group-hover:text-accent sm:text-3xl">
                  {latestPost.title}
                </h3>
                {latestPost.summary && (
                  <p className="mt-3 max-w-2xl leading-relaxed text-ink-soft">{latestPost.summary}</p>
                )}
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-ink underline decoration-line decoration-2 underline-offset-[6px] group-hover:text-accent group-hover:decoration-accent">
                  Read the post <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </Reveal>
        </section>
      )}

      {/* How to reach us */}
      <section className="border-t border-line bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="font-display text-3xl font-medium text-ink sm:text-4xl">How to reach us</h2>
            <div className="mt-10 grid gap-10 border-t-2 border-ink pt-8 md:grid-cols-3">
              <div>
                <h3 className="text-sm font-semibold text-ink">Visit</h3>
                <a
                  href={site.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 block max-w-xs leading-relaxed text-ink transition-colors hover:text-accent"
                >
                  {site.address}
                </a>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-ink">Call or write</h3>
                <p className="mt-3 leading-relaxed">
                  <a href={site.phoneHref} className="block text-ink transition-colors hover:text-accent">{site.phone}</a>
                  <a href={`mailto:${site.email}`} className="block text-ink transition-colors hover:text-accent">{site.email}</a>
                </p>
                <Link
                  to="/contact"
                  className="mt-5 inline-block rounded bg-maroon-700 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-maroon-800"
                >
                  Contact Us
                </Link>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-ink">Existing clients</h3>
                <p className="mt-3 max-w-xs leading-relaxed text-ink-soft">
                  Existing clients can track engagements in the {site.crmLabel.toLowerCase()}.
                </p>
                <a
                  href={site.crmUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded border border-ink/25 px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
                >
                  {site.crmLabel} <ExternalIcon />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
