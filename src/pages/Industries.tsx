import PageHeader from "../components/PageHeader";
import ContactCta from "../components/ContactCta";
import Reveal from "../components/Reveal";
import { industries } from "../data/industries";
import { usePageMeta } from "../hooks/usePageMeta";

export default function Industries() {
  usePageMeta(
    "Industries / Sectors",
    "Sector experience spanning manufacturing, healthcare, technology, real estate and more.",
  );
  return (
    <>
      <PageHeader
        title="Industries / Sectors"
        lede="We serve clients across the following sectors."
      />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <ul className="grid gap-x-12 gap-y-6 sm:auto-rows-fr sm:grid-cols-2">
          {industries.map((ind, i) => (
            <Reveal as="li" key={ind.name} delay={Math.min(i * 40, 240)} className="border-t border-line pt-5">
              <h2 className="font-display text-xl font-semibold text-ink">{ind.name}</h2>
              {ind.detail && <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{ind.detail}</p>}
            </Reveal>
          ))}
        </ul>
      </section>
      <ContactCta />
    </>
  );
}
