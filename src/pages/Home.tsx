import { Link } from "react-router-dom";
import { services } from "../data/services";
import { industries } from "../data/industries";
import { site } from "../data/site";
import { posts, formatDate } from "../data/blog";
import Reveal from "../components/Reveal";
import { usePageMeta } from "../hooks/usePageMeta";

const latestPost = posts[0];

const HERO_IMG = `${import.meta.env.BASE_URL}images/hero.jpg`;

export default function Home() {
  usePageMeta();
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-band-deep">
        <img
          src={HERO_IMG}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-35"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-band-deep/70 via-band-deep/55 to-band-deep" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-20 sm:px-6 sm:pt-24 lg:grid-cols-[1fr_minmax(20rem,24rem)] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold-400">
              Since {site.since} · Bengaluru
            </p>
            <h1 className="mt-5 max-w-3xl font-display text-5xl font-semibold leading-[1.08] text-white sm:text-6xl">
              {site.name}
            </h1>
            <p className="mt-3 font-display text-2xl font-medium text-gold-400 sm:text-3xl">
              {site.tagline}
            </p>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
              Rendering services in audit &amp; assurance, taxation, tax litigation and consultancy —
              with senior-partner attention on every engagement.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="rounded-md bg-gold-500 px-7 py-3.5 text-sm font-semibold text-navy-950 shadow-float transition-all duration-200 hover:bg-gold-400"
              >
                Get in Touch
              </Link>
              <Link
                to="/services"
                className="rounded-md border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:border-gold-400 hover:text-gold-400"
              >
                Explore Our Services
              </Link>
            </div>
          </div>

          {/* Office panel — fills the wide right column on desktop */}
          <aside className="hidden rounded-2xl border border-white/15 bg-navy-900/70 p-8 lg:block">
            <h2 className="font-display text-lg font-semibold text-white">Our Office</h2>
            <address className="mt-5 space-y-5 text-sm not-italic leading-relaxed text-white/75">
              <div className="flex gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 h-5 w-5 shrink-0 text-gold-400" aria-hidden="true">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <a href={site.mapsUrl} target="_blank" rel="noreferrer" className="transition-colors hover:text-gold-400">
                  {site.address}
                </a>
              </div>
              <div className="flex gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 h-5 w-5 shrink-0 text-gold-400" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <a href={site.phoneHref} className="font-medium text-white transition-colors hover:text-gold-400">
                  {site.phone}
                </a>
              </div>
              <div className="flex gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 h-5 w-5 shrink-0 text-gold-400" aria-hidden="true">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <a href={`mailto:${site.email}`} className="font-medium text-white transition-colors hover:text-gold-400">
                  {site.email}
                </a>
              </div>
            </address>
            <a
              href={site.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-gold-400 transition-colors hover:text-gold-500"
            >
              Get directions
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
              </svg>
            </a>
          </aside>
        </div>
      </section>

      {/* About strip */}
      <Reveal as="section" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
          <div>
            <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
              A firm built on {new Date().getFullYear() - site.since}+ years of practice
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
              M/s R Shivakumar &amp; Associates is a firm of chartered accountants in Bangalore.
              Since {site.since}, we have been rendering services, especially in areas such as
              audit &amp; assurance, taxation, tax litigation and consultancy services.
            </p>
            <Link
              to="/about"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent transition-colors duration-200 hover:text-accent-strong"
            >
              More about the firm
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          <dl className="flex gap-10 border-t border-line pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <div>
              <dt className="text-sm text-ink-soft">Practising since</dt>
              <dd className="mt-1 font-display text-4xl font-semibold text-navy-800 dark:text-gold-400">
                {site.since}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-ink-soft">Service lines</dt>
              <dd className="mt-1 font-display text-4xl font-semibold text-navy-800 dark:text-gold-400">
                {services.length}
              </dd>
            </div>
          </dl>
        </div>
      </Reveal>

      {/* Services */}
      <section className="bg-surface-raised py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Our Services</h2>
              <Link
                to="/services"
                className="text-sm font-semibold text-accent transition-colors duration-200 hover:text-accent-strong"
              >
                View all services →
              </Link>
            </div>
          </Reveal>
          <ul className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <Reveal as="li" key={s.slug} delay={Math.min(i * 60, 300)}>
                <Link
                  to={`/${s.slug}`}
                  className="group block border-t-2 border-line pt-5 transition-colors duration-200 hover:border-gold-500"
                >
                  <h3 className="font-display text-xl font-semibold text-ink transition-colors duration-200 group-hover:text-accent">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.summary}</p>
                  <span className="mt-3 inline-block text-sm font-semibold text-accent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    Read more →
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Industries strip */}
      <Reveal as="section" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,22rem)_1fr]">
          <div>
            <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
              Industries we serve
            </h2>
            <p className="mt-3 text-ink-soft">
              Sector experience spanning manufacturing, healthcare, technology and real estate.
            </p>
            <Link
              to="/industries"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent transition-colors duration-200 hover:text-accent-strong"
            >
              See all sectors
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          <ul className="flex flex-wrap gap-3 lg:justify-end">
            {industries.map((ind) => (
              <li key={ind.name}>
                <Link
                  to="/industries"
                  className="inline-block rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-ink-soft transition-all duration-200 hover:border-gold-500 hover:text-accent"
                >
                  {ind.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      {/* Latest from the blog */}
      {latestPost && (
        <section className="bg-surface-raised py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
                  From the blog
                </h2>
                <Link
                  to="/blogs"
                  className="text-sm font-semibold text-accent transition-colors duration-200 hover:text-accent-strong"
                >
                  View all posts →
                </Link>
              </div>
            </Reveal>
            <Reveal className="mt-10">
              <Link
                to={`/blogs/${latestPost.slug}`}
                className="group block rounded-2xl border border-line bg-surface p-8 shadow-lift transition-colors duration-200 hover:border-accent sm:p-10"
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-soft">
                  {latestPost.date && (
                    <time dateTime={latestPost.date} className="font-medium uppercase tracking-[0.12em]">
                      {formatDate(latestPost.date)}
                    </time>
                  )}
                  <span aria-hidden="true">·</span>
                  <span>{latestPost.readingTime} min read</span>
                </div>
                <h3 className="mt-3 font-display text-2xl font-semibold text-ink transition-colors duration-200 group-hover:text-accent sm:text-3xl">
                  {latestPost.title}
                </h3>
                {latestPost.summary && (
                  <p className="mt-3 max-w-2xl leading-relaxed text-ink-soft">{latestPost.summary}</p>
                )}
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                  Read the post
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
          </div>
        </section>
      )}

      {/* Contact band */}
      <section className="bg-band">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <h2 className="font-display text-3xl font-semibold text-white">
                Speak with us about your requirements
              </h2>
              <p className="mt-3 max-w-xl text-white/75">
                Call, write, or visit our office in Banashankari, Bengaluru.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="rounded-md bg-gold-500 px-7 py-3.5 text-sm font-semibold text-navy-950 shadow-lift transition-all duration-200 hover:bg-gold-400"
              >
                Contact Us
              </Link>
              <a
                href={site.phoneHref}
                className="rounded-md border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:border-gold-400 hover:text-gold-400"
              >
                {site.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
