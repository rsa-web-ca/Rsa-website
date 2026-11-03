import PageHeader from "../components/PageHeader";
import ContactCta from "../components/ContactCta";
import { site } from "../data/site";
import { services } from "../data/services";
import { usePageMeta } from "../hooks/usePageMeta";

export default function About() {
  usePageMeta(
    "About Us",
    `A firm of chartered accountants in Bengaluru rendering audit & assurance, taxation, tax litigation and consultancy services since ${site.since}.`,
  );
  // No photograph here on purpose: the stock office image that used to sit
  // here was not the firm's office. A real photo of the office or partners
  // can go back in this column once one exists.
  return (
    <>
      <PageHeader title="About Us" />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <p className="font-display text-2xl leading-snug text-ink sm:text-3xl lg:col-span-7">
            M/s R Shivakumar &amp; Associates is a firm of chartered accountants, in Bangalore.
            Since {site.since}, we have been rendering services, especially in areas such as
            audit &amp; assurance, taxation, tax litigation and consultancy services.
          </p>
          <dl className="divide-y divide-line border-t-2 border-ink text-[15px] lg:col-span-4 lg:col-start-9">
            <div className="grid grid-cols-[104px_1fr] gap-4 py-4">
              <dt className="text-ink-soft">Established</dt>
              <dd className="font-display text-xl text-ink figures-oldstyle">{site.since}</dd>
            </div>
            <div className="grid grid-cols-[104px_1fr] gap-4 py-4">
              <dt className="text-ink-soft">Based in</dt>
              <dd className="text-ink">Banashankari, Bengaluru</dd>
            </div>
            <div className="grid grid-cols-[104px_1fr] gap-4 py-4">
              <dt className="text-ink-soft">Practice</dt>
              <dd className="text-ink">{services.length} service lines across audit, tax and advisory</dd>
            </div>
          </dl>
        </div>
      </section>
      <ContactCta />
    </>
  );
}
