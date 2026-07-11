import PageHeader from "../components/PageHeader";
import ContactCta from "../components/ContactCta";
import Reveal from "../components/Reveal";
import { site } from "../data/site";
import { usePageMeta } from "../hooks/usePageMeta";

const OFFICE_IMG = `${import.meta.env.BASE_URL}images/office.jpg`;

export default function About() {
  usePageMeta(
    "About Us",
    `A firm of chartered accountants in Bengaluru rendering audit & assurance, taxation, tax litigation and consultancy services since ${site.since}.`,
  );
  return (
    <>
      <PageHeader title="About Us" />
      <Reveal as="section" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-lg leading-relaxed text-ink-soft">
              M/s R Shivakumar &amp; Associates is a firm of chartered accountants, in Bangalore.
              Since {site.since}, we have been rendering services, especially in areas such as
              audit &amp; assurance, taxation, tax litigation and consultancy services.
            </p>
            <dl className="mt-10 grid grid-cols-2 gap-8 border-t border-line pt-8">
              <div>
                <dt className="text-sm text-ink-soft">Established</dt>
                <dd className="mt-1 font-display text-3xl font-semibold text-accent">
                  {site.since}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-ink-soft">Based in</dt>
                <dd className="mt-1 font-display text-3xl font-semibold text-accent">
                  Bengaluru
                </dd>
              </div>
            </dl>
          </div>
          <img
            src={OFFICE_IMG}
            alt="A calm, well-lit professional office"
            className="aspect-[4/3] w-full rounded-2xl object-cover shadow-float"
            loading="lazy"
          />
        </div>
      </Reveal>
      <ContactCta />
    </>
  );
}
