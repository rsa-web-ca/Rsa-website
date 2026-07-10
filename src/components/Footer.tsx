import { Link } from "react-router-dom";
import { services } from "../data/services";
import { site } from "../data/site";

export default function Footer() {
  return (
    <footer className="bg-band-deep text-white/80">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-gold-500/40 bg-navy-800/60 font-display text-sm font-bold text-gold-400">
                RSA
              </span>
              <div className="leading-tight">
                <p className="font-display text-lg font-semibold text-white">{site.name}</p>
                <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-gold-400/90">
                  {site.tagline}
                </p>
              </div>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              Rendering audit, tax and advisory services from Bengaluru since {site.since}.
            </p>
          </div>

          <nav aria-label="Footer — pages">
            <h2 className="font-display text-base font-semibold text-white">Pages</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                ["Home", "/"],
                ["About", "/about"],
                ["Services", "/services"],
                ["Industries", "/industries"],
                ["Careers", "/careers"],
                ["Contact", "/contact"],
              ].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="transition-colors duration-200 hover:text-gold-400">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Footer — services">
            <h2 className="font-display text-base font-semibold text-white">Services</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link to={`/${s.slug}`} className="transition-colors duration-200 hover:text-gold-400">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-display text-base font-semibold text-white">Contact</h2>
            <address className="mt-4 space-y-3 text-sm not-italic leading-relaxed">
              <p>
                <a
                  href={site.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors duration-200 hover:text-gold-400"
                >
                  {site.address}
                </a>
              </p>
              <p>
                Mobile:{" "}
                <a href={site.phoneHref} className="font-medium text-white transition-colors duration-200 hover:text-gold-400">
                  {site.phone}
                </a>
              </p>
              <p>
                Email:{" "}
                <a
                  href={`mailto:${site.email}`}
                  className="font-medium text-white transition-colors duration-200 hover:text-gold-400"
                >
                  {site.email}
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-white/50">
          <p>
            &copy;{new Date().getFullYear()} by {site.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
