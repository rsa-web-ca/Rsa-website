import { Link, Navigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import ContactCta from "../components/ContactCta";
import Reveal from "../components/Reveal";
import { getService, services } from "../data/services";
import { usePageMeta } from "../hooks/usePageMeta";

export default function ServiceDetail({ slug }: { slug: string }) {
  const service = getService(slug);

  usePageMeta(service?.title, service?.summary);

  if (!service) return <Navigate to="/services" replace />;

  const index = services.findIndex((s) => s.slug === service.slug);
  const others = services.filter((s) => s.slug !== service.slug);
  const prev = index > 0 ? services[index - 1] : undefined;
  const next = index < services.length - 1 ? services[index + 1] : undefined;

  return (
    <>
      <PageHeader title={service.title} />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-[1fr_20rem]">
          <Reveal>
            <article className="max-w-prose">
              {service.intro.map((para) => (
                <p key={para.slice(0, 32)} className="mb-5 text-lg leading-relaxed text-ink-soft">
                  {para}
                </p>
              ))}

              {service.offerings.length > 0 && (
                <>
                  {service.listHeading && (
                    <h2 className="mb-5 mt-10 font-display text-2xl font-semibold text-ink">
                      {service.listHeading}
                    </h2>
                  )}
                  <ul className="space-y-3">
                    {service.offerings.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="mt-1 h-4.5 w-4.5 shrink-0 text-accent"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="leading-relaxed text-ink">{item}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </article>
          </Reveal>

          <Reveal as="div" delay={100}>
            <aside className="lg:sticky lg:top-24">
              <h2 className="font-display text-lg font-semibold text-ink">Other services</h2>
              <ul className="mt-4 space-y-1 border-t border-line pt-4">
                {others.map((s) => (
                  <li key={s.slug}>
                    <Link
                      to={`/${s.slug}`}
                      className="block rounded-md px-3 py-2 text-sm text-ink-soft transition-colors duration-200 hover:bg-surface-raised hover:text-ink"
                    >
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex gap-6 text-sm">
                {prev && (
                  <Link to={`/${prev.slug}`} className="group min-w-0">
                    <span className="block text-xs text-ink-soft">← Previous</span>
                    <span className="mt-0.5 block truncate font-semibold text-accent transition-colors group-hover:text-accent-strong">
                      {prev.title}
                    </span>
                  </Link>
                )}
                {next && (
                  <Link to={`/${next.slug}`} className="group ml-auto min-w-0 text-right">
                    <span className="block text-xs text-ink-soft">Next →</span>
                    <span className="mt-0.5 block truncate font-semibold text-accent transition-colors group-hover:text-accent-strong">
                      {next.title}
                    </span>
                  </Link>
                )}
              </div>
            </aside>
          </Reveal>
        </div>
      </section>
      <ContactCta text={service.outro[0]} />
    </>
  );
}
