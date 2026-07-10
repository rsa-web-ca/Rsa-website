import { Link } from "react-router-dom";
import { services } from "../data/services";
import { industries } from "../data/industries";
import { site } from "../data/site";
import Reveal from "../components/Reveal";

const HERO_IMG =
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-band-deep">
        <img
          src={HERO_IMG}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-25"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-band-deep/70 via-band-deep/55 to-band-deep" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-24 sm:px-6 sm:pt-32 lg:px-8">
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
      </section>

      {/* About strip */}
      <Reveal as="section" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
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
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold-600 transition-colors duration-200 hover:text-gold-500"
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
      <section className="bg-surface-raised py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Our Services</h2>
              <Link
                to="/services"
                className="text-sm font-semibold text-gold-600 transition-colors duration-200 hover:text-gold-500"
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
                  <h3 className="font-display text-xl font-semibold text-ink transition-colors duration-200 group-hover:text-gold-600">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.summary}</p>
                  <span className="mt-3 inline-block text-sm font-semibold text-gold-600 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    Read more →
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Industries strip */}
      <Reveal as="section" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
          Industries we serve
        </h2>
        <p className="mt-3 max-w-2xl text-ink-soft">
          Sector experience spanning manufacturing, healthcare, technology and real estate.
        </p>
        <ul className="mt-8 flex flex-wrap gap-3">
          {industries.map((ind) => (
            <li key={ind.name}>
              <Link
                to="/industries"
                className="inline-block rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-ink-soft transition-all duration-200 hover:border-gold-500 hover:text-gold-600"
              >
                {ind.name}
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>

      {/* Contact band */}
      <section className="bg-band">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <h2 className="font-display text-3xl font-semibold text-white">
                Speak with us about your requirements
              </h2>
              <p className="mt-3 max-w-xl text-white/75">
                Call, write, or visit our office in Banashankari, Bengaluru — we respond promptly.
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
