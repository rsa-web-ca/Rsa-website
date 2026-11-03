import { Link } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  lede?: string;
  /** Intermediate breadcrumb between Home and this page, e.g. Services. */
  parent?: { label: string; to: string };
}

/** Plain, ruled opening for every inner page: breadcrumb, title, optional lede. */
export default function PageHeader({ title, lede, parent }: PageHeaderProps) {
  return (
    <section className="border-b border-line bg-surface-raised">
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-10 sm:px-6 lg:px-8 lg:pb-14 lg:pt-12">
        <nav aria-label="Breadcrumb" className="text-sm text-ink-soft">
          <ol className="flex flex-wrap items-center gap-x-2">
            <li>
              <Link to="/" className="transition-colors hover:text-accent">Home</Link>
            </li>
            {parent && (
              <>
                <li aria-hidden="true">/</li>
                <li>
                  <Link to={parent.to} className="transition-colors hover:text-accent">{parent.label}</Link>
                </li>
              </>
            )}
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink">{title}</li>
          </ol>
        </nav>
        <h1 className="mt-6 max-w-4xl font-display text-4xl font-medium leading-tight text-ink sm:text-5xl">{title}</h1>
        {lede && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">{lede}</p>}
      </div>
    </section>
  );
}
