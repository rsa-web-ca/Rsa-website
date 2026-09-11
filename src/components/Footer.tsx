import { Link } from "react-router-dom";
import { services } from "../data/services";
import { site } from "../data/site";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-band-deep text-white/80">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Logo tone="band" className="h-12" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              Rendering audit, tax and advisory services from Bengaluru since {site.since}.
            </p>
          </div>

          <nav aria-label="Footer — pages">
            <h3 className="font-display text-base font-semibold text-white">Pages</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                ["Home", "/"],
                ["About", "/about"],
                ["Services", "/services"],
                ["Industries", "/industries"],
                ["Careers", "/careers"],
                ["Blog", "/blogs"],
                ["Contact", "/contact"],
              ].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="transition-colors duration-200 hover:text-maroon-400">
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={site.crmUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 transition-colors duration-200 hover:text-maroon-400"
                >
                  {site.crmLabel}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 text-white/40" aria-hidden="true">
                    <path d="M11 3a.75.75 0 0 0 0 1.5h2.44l-6.22 6.22a.75.75 0 1 0 1.06 1.06L14.5 5.56V8a.75.75 0 0 0 1.5 0V3.75A.75.75 0 0 0 15.25 3H11Z" />
                    <path d="M4.75 5A1.75 1.75 0 0 0 3 6.75v8.5C3 16.216 3.784 17 4.75 17h8.5A1.75 1.75 0 0 0 15 15.25V11.5a.75.75 0 0 0-1.5 0v3.75a.25.25 0 0 1-.25.25h-8.5a.25.25 0 0 1-.25-.25v-8.5a.25.25 0 0 1 .25-.25H8.5A.75.75 0 0 0 8.5 5H4.75Z" />
                  </svg>
                </a>
              </li>
            </ul>
          </nav>

          <nav aria-label="Footer — services">
            <h3 className="font-display text-base font-semibold text-white">Services</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link to={`/${s.slug}`} className="transition-colors duration-200 hover:text-maroon-400">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="font-display text-base font-semibold text-white">Contact</h3>
            <address className="mt-4 space-y-3 text-sm not-italic leading-relaxed">
              <p>
                <a
                  href={site.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors duration-200 hover:text-maroon-400"
                >
                  {site.address}
                </a>
              </p>
              <p>
                Mobile:{" "}
                <a href={site.phoneHref} className="font-medium text-white transition-colors duration-200 hover:text-maroon-400">
                  {site.phone}
                </a>
              </p>
              <p>
                Email:{" "}
                <a
                  href={`mailto:${site.email}`}
                  className="font-medium text-white transition-colors duration-200 hover:text-maroon-400"
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
