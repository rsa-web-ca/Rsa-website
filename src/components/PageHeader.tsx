import { Link } from "react-router-dom";
import LoopFilm, { type FilmName } from "./LoopFilm";

interface PageHeaderProps {
  title: string;
  lede?: string;
  /** Intermediate breadcrumb between Home and this page, e.g. Services. */
  parent?: { label: string; to: string };
  /** HyperFrames loop behind the header; each section of the site has its own motif. */
  film?: FilmName;
}

/** Dark band that opens every inner page: breadcrumb, title, optional lede, over the section's film. */
export default function PageHeader({ title, lede, parent, film }: PageHeaderProps) {
  return (
    <section className="relative isolate overflow-hidden bg-[#0e1420] text-white">
      {film && <LoopFilm name={film} className="object-[75%_50%]" controlClassName="bottom-5 right-4 sm:right-6 lg:right-8" />}
      {film && (
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#0e1420_0%,rgb(14_20_32/0.8)_45%,rgb(14_20_32/0.1)_100%)] md:bg-[linear-gradient(90deg,#0e1420_0%,rgb(14_20_32/0.75)_35%,rgb(14_20_32/0)_70%)]" aria-hidden="true" />
      )}
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pb-24 lg:pt-20">
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
        <h1 className="hero-rise mt-8 max-w-3xl font-display text-[40px] font-medium leading-[1.05] tracking-[-0.02em] sm:text-6xl lg:text-7xl">{title}</h1>
        {lede && <p className="hero-rise mt-6 max-w-2xl text-lg leading-relaxed text-white/75 [animation-delay:100ms]">{lede}</p>}
      </div>
    </section>
  );
}
