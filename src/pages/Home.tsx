import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { services } from "../data/services";
import { industries } from "../data/industries";
import { positions } from "../data/careers";
import { site } from "../data/site";
import { posts, formatDate } from "../data/blog";
import CountUp from "../components/CountUp";
import Letterhead from "../components/Letterhead";
import Reveal from "../components/Reveal";
import ServiceIcon from "../components/ServiceIcon";
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

/**
 * Hero film: the ledger loop rendered with HyperFrames (source in video/hero-ledger).
 * Muted and decorative, but it moves for longer than 5s, so it gets a visible
 * pause control (WCAG 2.2.2) and never autoplays under reduced motion.
 */
function HeroFilm() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    v.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, []);

  function toggle() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      void v.play().then(() => setPlaying(true));
    } else {
      v.pause();
      setPlaying(false);
    }
  }

  return (
    <>
      <video
        ref={videoRef}
        className="absolute inset-0 -z-10 h-full w-full object-cover object-[70%_50%]"
        poster={`${MEDIA}hero-ledger.jpg`}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src={`${MEDIA}hero-ledger.webm`} type="video/webm" />
        <source src={`${MEDIA}hero-ledger.mp4`} type="video/mp4" />
      </video>
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause background film" : "Play background film"}
        className="absolute bottom-[88px] right-4 z-10 hidden h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/25 text-white/80 transition-colors hover:border-white/60 hover:text-white sm:right-6 lg:right-8 lg:flex"
      >
        {playing ? (
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true"><path d="M5.75 3a.75.75 0 0 0-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75V3.75A.75.75 0 0 0 7.25 3h-1.5ZM12.75 3a.75.75 0 0 0-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75V3.75a.75.75 0 0 0-.75-.75h-1.5Z" /></svg>
        ) : (
          <svg viewBox="0 0 20 20" fill="currentColor" className="ml-0.5 h-4 w-4" aria-hidden="true"><path d="M6.3 2.84A1.5 1.5 0 0 0 4 4.11v11.78a1.5 1.5 0 0 0 2.3 1.27l9.344-5.891a1.5 1.5 0 0 0 0-2.538L6.3 2.841Z" /></svg>
        )}
      </button>
    </>
  );
}

export default function Home() {
  usePageMeta();
  const years = new Date().getFullYear() - site.since;

  return (
    <>
      {/* Hero: full-bleed film under a transparent header (pulled up by the header's height) */}
      <section className="relative isolate -mt-18 flex min-h-[640px] flex-col overflow-hidden bg-[#0e1420] text-white md:-mt-[108px] lg:min-h-[min(100svh,960px)]">
        <HeroFilm />
        <div
          className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#0e1420_0%,rgb(14_20_32/0.86)_38%,rgb(14_20_32/0.2)_75%),linear-gradient(0deg,#0e1420_0%,rgb(14_20_32/0)_35%)]"
          aria-hidden="true"
        />

        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 pb-16 pt-36 sm:px-6 lg:px-8 lg:pt-48">
          <p className="hero-rise flex items-center gap-3 text-sm text-white/75">
            <span className="h-px w-10 bg-maroon-400" aria-hidden="true" />
            {site.tagline} · Bengaluru · Since {site.since}
          </p>
          <h1 className="hero-rise mt-6 max-w-4xl font-display text-[44px] font-medium leading-[1.03] tracking-[-0.025em] [animation-delay:80ms] sm:text-7xl lg:text-[88px]">
            Rendering audit, tax and advisory services since{" "}
            <span className="figures-oldstyle text-maroon-300">{site.since}</span>
          </h1>
          <p className="hero-rise mt-8 max-w-xl text-lg leading-relaxed text-white/75 [animation-delay:160ms]">
            M/s R Shivakumar &amp; Associates is a firm of chartered accountants in Bangalore,
            rendering services in audit &amp; assurance, taxation, tax litigation and consultancy.
          </p>
          <div className="hero-rise mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 [animation-delay:240ms]">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded bg-maroon-700 px-7 py-4 text-sm font-semibold text-white transition-colors duration-150 hover:bg-maroon-600"
            >
              Get in Touch
              <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/services"
              className="text-sm font-semibold text-white underline decoration-white/30 decoration-2 underline-offset-[6px] transition-colors hover:decoration-white"
            >
              Explore Our Services
            </Link>
          </div>
        </div>

        {/* How can we help: the four most-asked services, one step from the hero */}
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

      {/* Figures */}
      <section className="border-b border-line bg-surface">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-8 gap-y-12 px-4 py-16 sm:px-6 lg:grid-cols-4 lg:px-8 lg:py-20">
          {[
            { value: site.since, from: 1960, label: "Established in Bengaluru" },
            { value: years, suffix: "+", label: "Years in practice" },
            { value: services.length, label: "Service lines" },
            { value: industries.length, label: "Sectors served" },
          ].map((f, i) => (
            <Reveal key={f.label} delay={i * 60} className="border-l-2 border-maroon-700 pl-5 sm:pl-6">
              <p className="font-display text-5xl font-medium text-ink sm:text-6xl">
                <CountUp value={f.value} suffix={f.suffix} from={f.from} />
              </p>
              <p className="mt-3 text-sm text-ink-soft">{f.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* The firm: introduction beside its letterhead */}
      <section className="overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-4 py-24 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-8 lg:py-32">
          <Reveal className="lg:col-span-5">
            <p className="text-sm font-semibold text-accent">The firm</p>
            <h2 className="mt-4 font-display text-4xl font-medium leading-[1.1] text-ink sm:text-5xl">
              A firm built on {years}+ years of practice
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-ink-soft">
              M/s R Shivakumar &amp; Associates is a firm of chartered accountants in Bangalore.
              Since {site.since}, we have been rendering services, especially in areas such as
              audit &amp; assurance, taxation, tax litigation and consultancy services.
            </p>
            <p className="mt-4 leading-relaxed text-ink-soft">
              Engagements are carried out to the standards issued by the Institute of Chartered
              Accountants of India.
            </p>
            <Link
              to="/about"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-ink underline decoration-line decoration-2 underline-offset-[6px] transition-colors hover:text-accent hover:decoration-accent"
            >
              More about the firm <ArrowRight />
            </Link>
          </Reveal>
          <Reveal delay={80} className="relative lg:col-span-6 lg:col-start-7">
            <div className="absolute -inset-y-10 left-10 -right-[50vw] rounded-l bg-band-deep" aria-hidden="true" />
            <div className="relative py-4 pl-0 sm:pl-6 lg:pl-0">
              <Letterhead className="mx-auto max-w-md -rotate-[1.5deg] lg:mx-0" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Services */}
      <section className="border-t border-line bg-surface-raised">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-28">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-sm font-semibold text-accent">Our Services</p>
              <h2 className="mt-4 max-w-2xl font-display text-4xl font-medium leading-[1.1] text-ink sm:text-5xl">
                How we can help
              </h2>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-soft">
                Nine service lines covering audit, taxation, advisory and compliance.
              </p>
            </div>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-sm font-semibold text-ink underline decoration-line decoration-2 underline-offset-[6px] transition-colors hover:text-accent hover:decoration-accent"
            >
              View all services <ArrowRight />
            </Link>
          </Reveal>

          <ul className="mt-14 grid gap-px overflow-hidden rounded border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <Reveal as="li" key={s.slug} delay={(i % 3) * 60} className="bg-surface">
                <Link to={`/${s.slug}`} className="service-tile group relative flex h-full flex-col p-6 transition-colors duration-200 hover:bg-surface sm:p-9">
                  <div className="flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-line text-ink-soft transition-colors duration-200 group-hover:border-maroon-700 group-hover:bg-maroon-700 group-hover:text-white">
                      <ServiceIcon slug={s.slug} className="h-5 w-5" />
                    </span>
                    <span className="font-display text-base tabular-nums text-ink-soft">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="mt-6 font-display text-2xl font-medium text-ink sm:mt-10">{s.title}</h3>
                  <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-soft">{s.summary}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ink-soft transition-colors duration-200 group-hover:text-accent sm:mt-8">
                    Read more <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Industries */}
      <section className="bg-band-deep text-white">
        <div className="mx-auto grid max-w-7xl gap-14 px-4 py-24 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-8 lg:py-28">
          <Reveal className="lg:col-span-4">
            <p className="text-sm font-semibold text-maroon-300">Industries / Sectors</p>
            <h2 className="mt-4 font-display text-4xl font-medium leading-[1.1] sm:text-5xl">Industries we serve</h2>
            <p className="mt-5 max-w-sm text-lg leading-relaxed text-white/70">
              Sector experience spanning manufacturing, healthcare, technology and real estate.
            </p>
            <Link
              to="/industries"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold underline decoration-white/30 decoration-2 underline-offset-[6px] transition-colors hover:decoration-white"
            >
              See all sectors <ArrowRight />
            </Link>
          </Reveal>
          <ul className="border-t border-white/15 lg:col-span-7 lg:col-start-6">
            {industries.map((ind, i) => (
              <li key={ind.name}>
                <Link to="/industries" className="industry-row group relative flex items-baseline gap-6 border-b border-white/15 py-5">
                  <span className="w-7 shrink-0 text-sm tabular-nums text-white/40">{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex-1">
                    <span className="block font-display text-xl transition-transform duration-300 group-hover:translate-x-1 sm:text-2xl">{ind.name}</span>
                    {ind.detail && <span className="mt-1 block text-sm leading-relaxed text-white/55">{ind.detail}</span>}
                  </span>
                  <ArrowRight className="h-5 w-5 shrink-0 self-center text-white/30 transition-[color,transform] duration-300 group-hover:translate-x-1 group-hover:text-white" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Insights */}
      {latestPost && (
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-28">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-accent">Insights</p>
              <h2 className="mt-4 font-display text-4xl font-medium leading-[1.1] text-ink sm:text-5xl">From the blog</h2>
            </div>
            <Link
              to="/blogs"
              className="inline-flex items-center gap-2 text-sm font-semibold text-ink underline decoration-line decoration-2 underline-offset-[6px] transition-colors hover:text-accent hover:decoration-accent"
            >
              View all posts <ArrowRight />
            </Link>
          </Reveal>
          <Reveal className="mt-12">
            <Link
              to={`/blogs/${latestPost.slug}`}
              className="group grid overflow-hidden rounded border border-line bg-surface transition-shadow duration-300 hover:shadow-float md:grid-cols-2"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#0e1420] md:aspect-auto">
                <img
                  src={`${MEDIA}hero-ledger.jpg`}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover object-right transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-col p-8 sm:p-12">
                <p className="text-sm text-ink-soft">
                  {latestPost.date && <time dateTime={latestPost.date}>{formatDate(latestPost.date)}</time>}
                  <span aria-hidden="true"> · </span>
                  {latestPost.readingTime} min read
                </p>
                <h3 className="mt-4 font-display text-3xl font-medium text-ink transition-colors duration-200 group-hover:text-accent sm:text-4xl">
                  {latestPost.title}
                </h3>
                {latestPost.summary && <p className="mt-4 flex-1 text-lg leading-relaxed text-ink-soft">{latestPost.summary}</p>}
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-ink">
                  Read the post <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </Reveal>
        </section>
      )}

      {/* Careers */}
      <section className="border-t border-line bg-surface">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-24 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-8">
          <Reveal className="lg:col-span-5">
            <p className="text-sm font-semibold text-accent">Careers</p>
            <h2 className="mt-4 font-display text-4xl font-medium leading-[1.1] text-ink sm:text-5xl">Work with Us</h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-soft">
              We have positions open for Article Trainees, Audit Assistants &amp; Audit Managers.
            </p>
          </Reveal>
          <Reveal delay={60} className="lg:col-span-6 lg:col-start-7">
            <ul className="border-t-2 border-ink">
              {positions.map((p) => (
                <li key={p}>
                  <Link to="/careers" className="group flex items-center justify-between gap-4 border-b border-line py-5">
                    <span className="font-display text-xl text-ink transition-colors group-hover:text-accent sm:text-2xl">{p}</span>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink-soft transition-colors group-hover:text-accent">
                      Apply <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Closing call to action */}
      <section className="bg-maroon-800 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-12 lg:items-end lg:gap-10 lg:px-8 lg:py-24">
          <Reveal className="lg:col-span-7">
            <h2 className="font-display text-4xl font-medium leading-[1.1] sm:text-5xl">For any further details, kindly contact us</h2>
            <p className="mt-5 text-lg text-white/80">
              Call, write, or visit our office in Banashankari, Bengaluru.
            </p>
          </Reveal>
          <Reveal delay={60} className="flex flex-col gap-4 lg:col-span-5 lg:items-end">
            <div className="flex flex-wrap gap-4">
              <Link to="/contact" className="rounded bg-white px-7 py-4 text-sm font-semibold text-maroon-800 transition-colors hover:bg-white/90">
                Contact Us
              </Link>
              <a href={site.phoneHref} className="rounded border border-white/35 px-7 py-4 text-sm font-semibold text-white transition-colors hover:border-white">
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
