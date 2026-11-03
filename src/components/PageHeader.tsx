import { Link } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  lede?: string;
  /** Intermediate breadcrumb between Home and this page, e.g. Services. */
  parent?: { label: string; to: string };
}

/** Slate band that opens every inner page, matching the home opening: breadcrumb, title, optional lede. */
export default function PageHeader({ title, lede, parent }: PageHeaderProps) {
  return (
    <section className="bg-band-deep text-white">
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-10 sm:px-6 lg:px-8 lg:pb-16 lg:pt-12">
        <nav aria-label="Breadcrumb" className="text-sm text-white/65">
          <ol className="flex flex-wrap items-center gap-x-2">
            <li>
              <Link to="/" className="transition-colors hover:text-white">Home</Link>
            </li>
            {parent && (
              <>
                <li aria-hidden="true">/</li>
                <li>
                  <Link to={parent.to} className="transition-colors hover:text-white">{parent.label}</Link>
                </li>
              </>
            )}
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-white">{title}</li>
          </ol>
        </nav>
        <h1 className="mt-6 max-w-4xl font-display text-4xl font-medium leading-tight sm:text-5xl">{title}</h1>
        {lede && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/75">{lede}</p>}
        <div className="mt-8 h-1 w-12 bg-maroon-400" aria-hidden="true" />
      </div>
    </section>
  );
}
