import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import ContactCta from "../components/ContactCta";
import Reveal from "../components/Reveal";
import { services } from "../data/services";
import { usePageMeta } from "../hooks/usePageMeta";

export default function Services() {
  usePageMeta(
    "Our Services",
    "Nine service lines covering audit, taxation, advisory and compliance.",
  );
  return (
    <>
      <PageHeader
        title="Our Services"
        lede="Nine service lines covering audit, taxation, advisory and compliance."
      />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <ul className="divide-y divide-line">
          {services.map((s, i) => (
            <Reveal as="li" key={s.slug} delay={Math.min(i * 50, 250)}>
              <Link
                to={`/${s.slug}`}
                className="group grid gap-2 py-8 transition-colors duration-200 sm:grid-cols-[minmax(0,20rem)_1fr_auto] sm:items-center sm:gap-8"
              >
                <h2 className="font-display text-2xl font-semibold text-ink transition-colors duration-200 group-hover:text-accent">
                  {s.title}
                </h2>
                <p className="max-w-prose text-sm leading-relaxed text-ink-soft sm:text-base">{s.intro[0]}</p>
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
      </section>
      <ContactCta />
    </>
  );
}
