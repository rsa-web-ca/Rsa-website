import { useRef } from "react";
import { Link } from "react-router-dom";
import { services } from "../data/services";
import { industries } from "../data/industries";
import { positions } from "../data/careers";
import { site } from "../data/site";
import { posts, formatDate } from "../data/blog";
import ComplianceWidget from "../components/ComplianceWidget";
import CountUp from "../components/CountUp";
import Faq from "../components/Faq";
import HowWeWork from "../components/HowWeWork";
import LoopFilm from "../components/LoopFilm";
import Reveal from "../components/Reveal";
import ServiceIcon from "../components/ServiceIcon";
import SpotlightCard from "../components/SpotlightCard";
import { usePageMeta } from "../hooks/usePageMeta";

const latestPost = posts[0];
const MEDIA = `${import.meta.env.BASE_URL}media/`;

// Four most-asked service lines, surfaced along the foot of the hero.
const QUICK = ["audit-assurance", "income-tax-related-services", "indirect-tax-services", "nri-services"]
  .map((slug) => services.find((s) => s.slug === slug))
  .filter((s) => s !== undefined);

function ArrowRight({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
      <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
    </svg>
  );
}

/** Headline that rises in word by word on load. */
function SplitHeadline({ text, accent }: { text: string; accent: string }) {
  const words = text.split(" ");
  return (
    <h1 className="mt-6 max-w-4xl font-display text-[44px] font-medium leading-[1.02] tracking-[-0.03em] sm:text-7xl lg:text-[92px]">
      <span className="sr-only">
        {text} {accent}
      </span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            <span className="word-rise inline-block" style={{ animationDelay: `${80 + i * 70}ms` }}>
              {w}&nbsp;
            </span>
          </span>
        ))}
        <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <span className="word-rise figures-oldstyle inline-block text-maroon-300" style={{ animationDelay: `${80 + words.length * 70}ms` }}>
            {accent}
          </span>
        </span>
      </span>
    </h1>
  );
}

export default function Home() {
  usePageMeta();
  const years = new Date().getFullYear() - site.since;
  const hero = useRef<HTMLElement>(null);

  // Faint maroon light that trails the pointer across the hero film.
  function onHeroMove(e: React.PointerEvent) {
    if (e.pointerType !== "mouse" || !hero.current) return;
    const r = hero.current.getBoundingClientRect();
    hero.current.style.setProperty("--gx", `${e.clientX - r.left}px`);
    hero.current.style.setProperty("--gy", `${e.clientY - r.top}px`);
  }

  return (
    <>
      {/* Hero: full-bleed film under a transparent header (pulled up by the header's height) */}
      <section
        ref={hero}
        onPointerMove={onHeroMove}
        className="relative isolate -mt-18 flex min-h-[720px] flex-col overflow-hidden bg-[#0e1420] text-white md:-mt-[108px] lg:min-h-[min(100svh,980px)]"
      >
        <LoopFilm name="hero-ledger" className="object-[70%_50%]" controlClassName="bottom-[92px] right-4 hidden sm:right-6 lg:right-8 lg:flex" />
        <div
          className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#0e1420_0%,rgb(14_20_32/0.85)_40%,rgb(14_20_32/0.25)_80%),linear-gradient(0deg,#0e1420_0%,rgb(14_20_32/0)_35%)]"
          aria-hidden="true"
        />
        <div className="cursor-glow pointer-events-none absolute inset-0 -z-10 hidden lg:block" aria-hidden="true" />

        <div className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-12 px-4 pb-16 pt-36 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-8 lg:pt-44">
          <div className="lg:col-span-7">
            <p className="hero-rise flex items-center gap-3 text-sm text-white/75">
              <span className="h-px w-10 bg-maroon-400" aria-hidden="true" />
              {site.tagline} · Bengaluru · Since {site.since}
            </p>
            <SplitHeadline text="Rendering audit, tax and advisory services since" accent={String(site.since)} />
            <p className="hero-rise mt-8 max-w-xl text-lg leading-relaxed text-white/75 [animation-delay:700ms]">
              M/s R Shivakumar &amp; Associates is a firm of chartered accountants in Bangalore,
              rendering services in audit &amp; assurance, taxation, tax litigation and consultancy.
            </p>
            <div className="hero-rise mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 [animation-delay:800ms]">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-maroon-700 py-4 pl-7 pr-5 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgb(128_0_31/0.8)] transition-[background-color,transform] duration-200 hover:bg-maroon-600 active:scale-[0.98]"
              >
                Get in Touch
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 transition-transform duration-200 group-hover:translate-x-0.5">
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
              <Link
                to="/services"
                className="text-sm font-semibold text-white underline decoration-white/30 decoration-2 underline-offset-[6px] transition-colors hover:decoration-white"
              >
                Explore Our Services
              </Link>
            </div>
          </div>
          <div className="hero-rise [animation-delay:900ms] lg:col-span-5 lg:col-start-8">
            <ComplianceWidget />
          </div>
        </div>

        {/* The four most-asked services, one step from the hero */}
        <nav aria-label="Popular services" className="border-t border-white/12 bg-[#0e1420]/60 backdrop-blur-sm">
          <ul className="mx-auto grid max-w-7xl grid-cols-2 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
            {QUICK.map((s, i) => (
              <li key={s.slug} className={`${i > 0 ? "lg:border-l" : ""} ${i % 2 ? "border-l" : ""} border-white/12`}>
                <Link to={`/${s.slug}`} className="group flex h-full items-center justify-between gap-4 px-4 py-5 transition-colors hover:bg-white/5 sm:px-6">
                  <span className="flex items-center gap-3">
                    <ServiceIcon slug={s.slug} className="hidden h-5 w-5 shrink-0 text-white/60 sm:block" />
                    <span className="text-sm font-medium text-white/90">{s.title}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-white/50 transition-[color,transform] duration-150 group-hover:translate-x-0.5 group-hover:text-white" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      {/* Live figures: worked out from the founding year and the site's own data */}
      <section className="border-b border-line bg-surface">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-8 lg:py-24">
          <Reveal className="lg:col-span-4">
            <p className="text-sm font-semibold text-accent">The firm</p>
            <h2 className="mt-4 font-display text-4xl font-medium leading-[1.05] text-ink sm:text-5xl">
              A firm built on {years}+ years of practice
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              Since {site.since}, rendering services in audit &amp; assurance, taxation, tax litigation
              and consultancy, to the standards issued by the Institute of Chartered Accountants of India.
            </p>
            <Link
              to="/about"
              className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-ink underline decoration-line decoration-2 underline-offset-[6px] transition-colors hover:text-accent hover:decoration-accent"
            >
              More about the firm <ArrowRight />
            </Link>
          </Reveal>
          <dl className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3 lg:col-span-7 lg:col-start-6">
            {[
              { value: years, suffix: "+", label: "Years in practice", note: `Since ${site.since}` },
              { value: services.length, label: "Service lines", note: "Audit, tax, advisory, compliance" },
              { value: industries.length, label: "Sectors served", note: "Manufacturing to real estate" },
            ].map((f, i) => (
              <Reveal key={f.label} delay={i * 60} className="flex flex-col bg-surface p-7 sm:p-8">
                <dt className="order-2 mt-4 text-sm font-medium text-ink">{f.label}</dt>
                <dd className="order-1 font-display text-7xl font-medium leading-none tracking-[-0.03em] text-ink lg:text-8xl">
                  <CountUp value={f.value} suffix={f.suffix} />
                </dd>
                <dd className="order-3 mt-1 text-sm text-ink-soft">{f.note}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* Services: dark stage, spotlight cards that tilt toward the pointer */}
      <section className="relative isolate overflow-hidden bg-[#0e1420] text-white">
        <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-maroon-700/20 blur-[140px]" aria-hidden="true" />
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-sm font-semibold text-maroon-300">Our Services</p>
              <h2 className="mt-4 max-w-2xl font-display text-4xl font-medium leading-[1.05] sm:text-6xl">How we can help</h2>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">
                Nine service lines covering audit, taxation, advisory and compliance.
              </p>
            </div>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold transition-colors hover:border-white/60"
            >
              View all services <ArrowRight />
            </Link>
          </Reveal>

          <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <Reveal as="li" key={s.slug} delay={(i % 3) * 60}>
                <SpotlightCard className="h-full rounded-2xl">
                  <Link
                    to={`/${s.slug}`}
                    className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition-colors duration-300 hover:border-white/25 sm:p-8"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] text-white/75 transition-colors duration-300 group-hover:border-maroon-500 group-hover:bg-maroon-700 group-hover:text-white">
                        <ServiceIcon slug={s.slug} className="h-5 w-5" />
                      </span>
                      <span className="font-display text-base tabular-nums text-white/40">{String(i + 1).padStart(2, "0")}</span>
                    </div>
                    <h3 className="mt-10 font-display text-2xl font-medium">{s.title}</h3>
                    <p className="mt-3 flex-1 text-[15px] leading-relaxed text-white/65">{s.summary}</p>
                    <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition-colors duration-300 group-hover:text-white">
                      Read more <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </Link>
                </SpotlightCard>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* How we work: pins and scrolls sideways on large screens */}
      <HowWeWork />

      {/* Industries: two rows of sectors drifting in opposite directions */}
      <section className="overflow-hidden bg-band-deep py-24 text-white lg:py-32">
        <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-sm font-semibold text-maroon-300">Industries / Sectors</p>
            <h2 className="mt-4 font-display text-4xl font-medium leading-[1.05] sm:text-6xl">Industries we serve</h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">
              Sector experience spanning manufacturing, healthcare, technology and real estate.
            </p>
          </Reveal>
          <Link to="/industries" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold transition-colors hover:border-white/60">
            See all sectors <ArrowRight />
          </Link>
        </div>
        <div className="marquee-wrap mt-16 space-y-4">
          {[0, 1].map((row) => {
            const list = row ? [...industries].reverse() : industries;
            return (
              <div key={row} className="overflow-hidden">
                <ul className={`marquee ${row ? "reverse" : ""}`}>
                  {[0, 1].map((dup) =>
                    list.map((ind, i) => (
                      <li key={`${dup}-${ind.name}`} className={dup ? "marquee-dup" : ""} aria-hidden={dup ? true : undefined}>
                        <Link
                          to="/industries"
                          tabIndex={dup ? -1 : undefined}
                          className={`mx-3 block whitespace-nowrap rounded-full border border-white/12 px-8 py-5 font-display text-3xl transition-colors hover:border-maroon-400 hover:bg-maroon-700/30 sm:text-5xl ${
                            (i + row) % 2 ? "text-outline hover:text-white" : "text-white"
                          }`}
                        >
                          {ind.name}
                        </Link>
                      </li>
                    )),
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-4">
            <p className="text-sm font-semibold text-accent">FAQs</p>
            <h2 className="mt-4 font-display text-4xl font-medium leading-[1.05] text-ink sm:text-5xl">Questions clients ask</h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              Something else on your mind?{" "}
              <Link to="/contact" className="font-medium text-ink underline decoration-line underline-offset-4 hover:text-accent">
                Ask us directly
              </Link>
              .
            </p>
          </Reveal>
          <Reveal delay={60} className="lg:col-span-8">
            <Faq />
          </Reveal>
        </div>
      </section>

      {/* Insights and careers, side by side */}
      <section className="border-t border-line bg-surface">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-24 sm:px-6 lg:grid-cols-12 lg:px-8">
          {latestPost && (
            <Reveal className="lg:col-span-7">
              <Link
                to={`/blogs/${latestPost.slug}`}
                className="group relative flex h-full min-h-[420px] flex-col justify-end overflow-hidden rounded-2xl bg-[#0e1420] p-8 text-white sm:p-10"
              >
                <img
                  src={`${MEDIA}hero-ledger.jpg`}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 -z-0 h-full w-full object-cover object-right opacity-70 transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(0deg,#0e1420_15%,rgb(14_20_32/0.2)_100%)]" aria-hidden="true" />
                <div className="relative">
                  <p className="text-sm font-semibold text-maroon-300">Insights</p>
                  <h2 className="mt-3 font-display text-3xl font-medium sm:text-4xl">{latestPost.title}</h2>
                  {latestPost.summary && <p className="mt-3 max-w-lg leading-relaxed text-white/75">{latestPost.summary}</p>}
                  <p className="mt-6 flex items-center gap-3 text-sm text-white/60">
                    {latestPost.date && <time dateTime={latestPost.date}>{formatDate(latestPost.date)}</time>}
                    <span aria-hidden="true">·</span>
                    {latestPost.readingTime} min read
                    <ArrowRight className="ml-auto h-5 w-5 text-white transition-transform duration-300 group-hover:translate-x-1" />
                  </p>
                </div>
              </Link>
            </Reveal>
          )}
          <Reveal delay={60} className="lg:col-span-5">
            <div className="flex h-full flex-col rounded-2xl border border-line bg-bg p-8 sm:p-10">
              <p className="text-sm font-semibold text-accent">Careers</p>
              <h2 className="mt-3 font-display text-3xl font-medium text-ink sm:text-4xl">Work with Us</h2>
              <p className="mt-3 leading-relaxed text-ink-soft">
                We have positions open for Article Trainees, Audit Assistants &amp; Audit Managers.
              </p>
              <ul className="mt-6 flex-1 divide-y divide-line border-y border-line">
                {positions.map((p) => (
                  <li key={p}>
                    <Link to="/careers" className="group flex items-center justify-between py-4">
                      <span className="font-medium text-ink transition-colors group-hover:text-accent">{p}</span>
                      <ArrowRight className="h-4 w-4 text-ink-soft transition-[color,transform] duration-200 group-hover:translate-x-1 group-hover:text-accent" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Closing call to action */}
      <section className="relative isolate overflow-hidden bg-maroon-800 text-white">
        <div className="pointer-events-none absolute -bottom-40 -right-40 -z-10 h-[520px] w-[520px] rounded-full bg-maroon-500/40 blur-[120px]" aria-hidden="true" />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-24 sm:px-6 lg:grid-cols-12 lg:items-end lg:gap-10 lg:px-8">
          <Reveal className="lg:col-span-7">
            <h2 className="font-display text-4xl font-medium leading-[1.05] sm:text-6xl">For any further details, kindly contact us</h2>
            <p className="mt-5 text-lg text-white/80">Call, write, or visit our office in Banashankari, Bengaluru.</p>
          </Reveal>
          <Reveal delay={60} className="flex flex-col gap-4 lg:col-span-5 lg:items-end">
            <div className="flex flex-wrap gap-4">
              <Link to="/contact" className="rounded-full bg-white px-7 py-4 text-sm font-semibold text-maroon-800 transition-[background-color,transform] hover:bg-white/90 active:scale-[0.98]">
                Contact Us
              </Link>
              <a href={site.phoneHref} className="rounded-full border border-white/35 px-7 py-4 text-sm font-semibold text-white transition-colors hover:border-white">
                {site.phone}
              </a>
            </div>
            <a href={`mailto:${site.email}`} className="text-sm text-white/80 underline decoration-white/30 underline-offset-4 transition-colors hover:text-white">
              {site.email}
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
