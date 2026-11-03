import { Link } from "react-router-dom";
import { services } from "../data/services";
import { industries } from "../data/industries";
import { site } from "../data/site";
import { posts, formatDate } from "../data/blog";
import Letterhead from "../components/Letterhead";
import ServiceIcon from "../components/ServiceIcon";
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

export default function Home() {
  usePageMeta();
  const years = new Date().getFullYear() - site.since;
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(site.address)}&output=embed`;

  return (
    <>
      {/* Opening: the firm's line on a slate band, its letterhead laid over the band's lower edge */}
      <section className="relative bg-band-deep text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-12 sm:px-6 sm:pt-20 lg:grid-cols-12 lg:gap-10 lg:px-8 lg:pb-0 lg:pt-24">
          <div className="lg:col-span-6 lg:pb-40">
            <p className="text-sm text-white/70">{site.tagline} · Banashankari, Bengaluru</p>
            <h1 className="mt-6 font-display text-[40px] font-medium leading-[1.06] tracking-[-0.02em] sm:text-6xl lg:text-[64px]">
              Rendering audit, tax and advisory services since{" "}
              <span className="figures-oldstyle text-maroon-300">{site.since}</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/75">
              M/s R Shivakumar &amp; Associates is a firm of chartered accountants in Bangalore.
              Since {site.since}, we have been rendering services, especially in areas such as
              audit &amp; assurance, taxation, tax litigation and consultancy services.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                to="/contact"
                className="rounded bg-[#fbf8f1] px-7 py-3.5 text-sm font-semibold text-[#1f2633] transition-colors duration-150 hover:bg-white"
              >
                Get in Touch
              </Link>
              <Link
                to="/services"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-white underline decoration-white/30 decoration-2 underline-offset-[6px] transition-colors hover:decoration-white"
              >
                Explore Our Services
                <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          <div className="relative z-10 lg:col-span-5 lg:col-start-8 lg:-mb-24 lg:self-end">
            <Letterhead className="letterhead-enter mx-auto max-w-md lg:max-w-none lg:rotate-[1.5deg]" />
          </div>
        </div>
      </section>

      {/* Particulars: the facts a client checks first */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <dl className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 lg:w-7/12 lg:grid-cols-2 xl:grid-cols-4">
            {[
              [String(site.since), "Established"],
              [`${years}+`, "Years in practice"],
              [String(services.length), "Service lines"],
              [String(industries.length), "Sectors served"],
            ].map(([figure, label]) => (
              <div key={label} className="border-t-2 border-ink pt-4">
                <dt className="text-sm text-ink-soft">{label}</dt>
                <dd className="figures-oldstyle mt-2 font-display text-4xl font-medium text-ink sm:text-5xl">{figure}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-10 max-w-xl text-sm leading-relaxed text-ink-soft">
            Engagements are carried out to the standards issued by the Institute of Chartered
            Accountants of India.
          </p>
        </div>
      </section>

      {/* Services: a ruled 3 × 3 schedule, one cell per service line */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-sm font-semibold text-accent">Our Services</p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl font-medium leading-tight text-ink sm:text-4xl">
              Nine service lines covering audit, taxation, advisory and compliance
            </h2>
          </div>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink underline decoration-line decoration-2 underline-offset-[6px] transition-colors hover:text-accent hover:decoration-accent"
          >
            View all services <ArrowRight />
          </Link>
        </div>

        <ul className="mt-12 grid gap-px overflow-hidden rounded border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <li key={s.slug} className="bg-surface">
              <Link
                to={`/${s.slug}`}
                className="group flex h-full flex-col p-6 transition-colors duration-150 hover:bg-surface-raised sm:p-8"
              >
                <div className="flex items-center justify-between text-ink-soft">
                  <ServiceIcon slug={s.slug} className="h-7 w-7 transition-colors duration-150 group-hover:text-accent" />
                  <span className="font-display text-base tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="mt-8 font-display text-xl font-medium text-ink sm:text-2xl">{s.title}</h3>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-soft">{s.summary}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ink-soft transition-colors duration-150 group-hover:text-accent">
                  Read more <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Industries on the slate band */}
      <section className="bg-band text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-8 lg:py-24">
          <div className="lg:col-span-4">
            <p className="text-sm font-semibold text-maroon-300">Industries / Sectors</p>
            <h2 className="mt-3 font-display text-3xl font-medium leading-tight sm:text-4xl">Industries we serve</h2>
            <p className="mt-4 max-w-sm leading-relaxed text-white/70">
              Sector experience spanning manufacturing, healthcare, technology and real estate.
            </p>
            <Link
              to="/industries"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold underline decoration-white/30 decoration-2 underline-offset-[6px] transition-colors hover:decoration-white"
            >
              See all sectors <ArrowRight />
            </Link>
          </div>
          <ul className="grid border-t border-white/25 sm:grid-cols-2 sm:gap-x-10 lg:col-span-8">
            {industries.map((ind, i) => (
              <li key={ind.name} className="flex gap-4 border-b border-white/15 py-4">
                <span className="w-6 shrink-0 pt-0.5 text-sm tabular-nums text-white/45">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="font-medium">{ind.name}</span>
                  {ind.detail && <span className="mt-1 block text-sm leading-relaxed text-white/60">{ind.detail}</span>}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Latest from the blog */}
      {latestPost && (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="flex items-end justify-between gap-4 border-b border-line pb-3">
            <h2 className="text-sm font-semibold text-ink">From the blog</h2>
            <Link to="/blogs" className="text-sm font-semibold text-ink underline decoration-line decoration-2 underline-offset-[6px] transition-colors hover:text-accent hover:decoration-accent">
              View all posts
            </Link>
          </div>
          <Link to={`/blogs/${latestPost.slug}`} className="group grid gap-3 py-8 md:grid-cols-12 md:gap-10">
            <div className="text-sm text-ink-soft md:col-span-3">
              {latestPost.date && <time dateTime={latestPost.date} className="block">{formatDate(latestPost.date)}</time>}
              <span>{latestPost.readingTime} min read</span>
            </div>
            <div className="md:col-span-9">
              <h3 className="font-display text-2xl font-medium text-ink transition-colors duration-150 group-hover:text-accent sm:text-3xl">
                {latestPost.title}
              </h3>
              {latestPost.summary && <p className="mt-3 max-w-2xl leading-relaxed text-ink-soft">{latestPost.summary}</p>}
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-ink underline decoration-line decoration-2 underline-offset-[6px] group-hover:text-accent group-hover:decoration-accent">
                Read the post <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        </section>
      )}

      {/* How to reach us: details beside the office on the map */}
      <section className="border-t border-line bg-surface">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-8 lg:py-24">
          <div className="lg:col-span-5">
            <h2 className="font-display text-3xl font-medium text-ink sm:text-4xl">How to reach us</h2>
            <dl className="mt-8 divide-y divide-line border-t-2 border-ink">
              <div className="grid grid-cols-[104px_1fr] gap-4 py-4">
                <dt className="text-ink-soft">Office</dt>
                <dd>
                  <a href={site.mapsUrl} target="_blank" rel="noreferrer" className="leading-relaxed text-ink transition-colors hover:text-accent">
                    {site.address}
                  </a>
                </dd>
              </div>
              <div className="grid grid-cols-[104px_1fr] gap-4 py-4">
                <dt className="text-ink-soft">Telephone</dt>
                <dd><a href={site.phoneHref} className="text-ink transition-colors hover:text-accent">{site.phone}</a></dd>
              </div>
              <div className="grid grid-cols-[104px_1fr] gap-4 py-4">
                <dt className="text-ink-soft">Email</dt>
                <dd className="min-w-0 break-words"><a href={`mailto:${site.email}`} className="text-ink transition-colors hover:text-accent">{site.email}</a></dd>
              </div>
              <div className="grid grid-cols-[104px_1fr] gap-4 py-4">
                <dt className="text-ink-soft">Clients</dt>
                <dd className="text-ink-soft">
                  Existing clients can track engagements in the{" "}
                  <a href={site.crmUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-medium text-ink underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent">
                    {site.crmLabel.toLowerCase()} <ExternalIcon />
                  </a>
                </dd>
              </div>
            </dl>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link to="/contact" className="rounded bg-maroon-700 px-7 py-3.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-maroon-800">
                Contact Us
              </Link>
              <a href={site.mapsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-ink underline decoration-line decoration-2 underline-offset-[6px] transition-colors hover:text-accent hover:decoration-accent">
                Get directions <ArrowRight />
              </a>
            </div>
          </div>
          <div className="lg:col-span-7">
            <iframe
              title={`Map showing ${site.name}, Banashankari, Bengaluru`}
              src={mapSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="aspect-[4/3] h-auto w-full rounded border border-line grayscale-[60%] lg:aspect-auto lg:h-full lg:min-h-[420px]"
            />
          </div>
        </div>
      </section>
    </>
  );
}
