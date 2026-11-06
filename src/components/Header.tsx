import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { services } from "../data/services";
import { site } from "../data/site";
import Logo from "./Logo";
import ServiceIcon from "./ServiceIcon";
import ThemeToggle from "./ThemeToggle";

function ExternalIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
      <path d="M11 3a.75.75 0 0 0 0 1.5h2.44l-6.22 6.22a.75.75 0 1 0 1.06 1.06L14.5 5.56V8a.75.75 0 0 0 1.5 0V3.75A.75.75 0 0 0 15.25 3H11Z" />
      <path d="M4.75 5A1.75 1.75 0 0 0 3 6.75v8.5C3 16.216 3.784 17 4.75 17h8.5A1.75 1.75 0 0 0 15 15.25V11.5a.75.75 0 0 0-1.5 0v3.75a.25.25 0 0 1-.25.25h-8.5a.25.25 0 0 1-.25-.25v-8.5a.25.25 0 0 1 .25-.25H8.5A.75.75 0 0 0 8.5 5H4.75Z" />
    </svg>
  );
}

const NAV = [
  { label: "About", to: "/about" },
  { label: "Industries", to: "/industries" },
  { label: "Calendar", to: "/compliance-calendar" },
  { label: "Careers", to: "/careers" },
  { label: "Insights", to: "/insights" },
  { label: "Contact", to: "/contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const servicesButtonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const isHome = location.pathname === "/";

  // Close menus on navigation
  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
    setMobileServicesOpen(false);
  }, [location.pathname]);

  // On the home page the bar sits transparent over the hero film and turns
  // solid once the visitor scrolls past the first few pixels.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the services mega menu on outside click / Escape
  useEffect(() => {
    if (!servicesOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!servicesRef.current?.contains(e.target as Node)) setServicesOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setServicesOpen(false);
        servicesButtonRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [servicesOpen]);

  const onServicesRoute =
    location.pathname === "/services" || services.some((s) => `/${s.slug}` === location.pathname);

  const solid = !isHome || scrolled || mobileOpen || servicesOpen;
  const linkTone = solid ? "text-ink-soft hover:text-ink" : "text-white/80 hover:text-white";
  const activeTone = solid ? "border-accent text-ink" : "border-white text-white";
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex h-full items-center border-b-2 px-2 pt-0.5 text-sm font-medium transition-colors duration-200 xl:px-3 ${
      isActive ? activeTone : `border-transparent ${linkTone}`
    }`;

  // Negative top on md+ lets the utility bar scroll away while the main bar stays pinned.
  return (
    <header className="sticky top-0 z-40 md:-top-9">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-maroon-700 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to main content
      </a>

      {/* Utility bar — the firm's particulars, as on its letterhead */}
      <div className="hidden bg-band-deep text-xs text-white/75 md:block">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <p>Chartered Accountants · Banashankari, Bengaluru · Est. {site.since}</p>
          <div className="flex items-center gap-5">
            <a href={site.phoneHref} className="transition-colors hover:text-white">{site.phone}</a>
            <a href={`mailto:${site.email}`} className="transition-colors hover:text-white">{site.email}</a>
            <a
              href={site.crmUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 border-l border-white/20 pl-5 font-medium text-white transition-colors hover:text-maroon-300"
            >
              {site.crmLabel}
              <ExternalIcon />
            </a>
          </div>
        </div>
      </div>

      <div
        className={`border-b transition-colors duration-300 ${
          solid ? "border-line bg-surface/95 backdrop-blur-md" : "border-white/10 bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="flex shrink-0 items-center transition-opacity duration-200 hover:opacity-85"
            aria-label={`${site.name} — home`}
          >
            <Logo tone={solid ? "auto" : "band"} className="h-9 sm:h-10 lg:h-8 xl:h-10" />
          </Link>

          <nav className="hidden h-full items-center lg:flex" aria-label="Primary">
            <div className="flex h-full items-center" ref={servicesRef}>
              <button
                ref={servicesButtonRef}
                type="button"
                onClick={() => setServicesOpen((o) => !o)}
                aria-expanded={servicesOpen}
                aria-controls="services-menu"
                className={`flex h-full cursor-pointer items-center gap-1 border-b-2 px-2 pt-0.5 text-sm font-medium transition-colors duration-200 xl:px-3 ${
                  onServicesRoute || servicesOpen ? activeTone : `border-transparent ${linkTone}`
                }`}
              >
                Services
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className={`h-4 w-4 transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Mega menu: spans the bar's full width (the bar's backdrop-filter makes it the containing block) */}
              {servicesOpen && (
                <div id="services-menu" className="mega-menu absolute inset-x-0 top-full border-b border-line bg-surface shadow-float">
                  <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-12 lg:px-8">
                    <div className="lg:col-span-3">
                      <p className="text-sm font-semibold text-accent">Our Services</p>
                      <p className="mt-3 font-display text-2xl leading-snug text-ink">
                        Nine service lines covering audit, taxation, advisory and compliance
                      </p>
                      <Link
                        to="/services"
                        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-maroon-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-maroon-800"
                      >
                        All services
                      </Link>
                    </div>
                    <ul className="grid gap-x-6 gap-y-1 lg:col-span-9 lg:grid-cols-3">
                      {services.map((s) => (
                        <li key={s.slug}>
                          <Link
                            to={`/${s.slug}`}
                            className="group flex gap-4 rounded p-3 transition-colors hover:bg-surface-raised"
                          >
                            <ServiceIcon slug={s.slug} className="mt-0.5 h-5 w-5 shrink-0 text-ink-soft transition-colors group-hover:text-accent" />
                            <span>
                              <span className="block text-[15px] font-medium text-ink">{s.title}</span>
                              <span className="mt-1 line-clamp-2 block text-sm leading-snug text-ink-soft">{s.summary}</span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} className={navLinkClass}>
                {n.label}
              </NavLink>
            ))}
            <Link
              to="/contact"
              className={`ml-3 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors duration-200 xl:ml-4 ${
                solid ? "bg-maroon-700 text-white hover:bg-maroon-800" : "bg-white text-[#1f2633] hover:bg-white/90"
              }`}
            >
              Get in Touch
            </Link>
            <ThemeToggle className={`ml-1 ${solid ? "text-ink-soft" : "text-white/85 hover:bg-white/10"}`} />
          </nav>

          <div className="flex items-center gap-1 lg:hidden">
            <ThemeToggle className={solid ? "text-ink-soft" : "text-white/85"} />
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded transition-colors ${
                solid ? "text-ink hover:bg-ink/5" : "text-white hover:bg-white/10"
              }`}
            >
              {mobileOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-6 w-6" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-6 w-6" aria-hidden="true">
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav id="mobile-nav" className="max-h-[calc(100dvh-72px)] overflow-y-auto border-t border-line bg-surface lg:hidden" aria-label="Mobile">
            <div className="space-y-1 px-4 py-4">
              <NavLink to="/" end className="block rounded px-3 py-3 text-base font-medium text-ink hover:bg-surface-raised">
                Home
              </NavLink>
              <button
                type="button"
                onClick={() => setMobileServicesOpen((o) => !o)}
                aria-expanded={mobileServicesOpen}
                className="flex w-full cursor-pointer items-center justify-between rounded px-3 py-3 text-base font-medium text-ink hover:bg-surface-raised"
              >
                Services
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className={`h-5 w-5 transition-transform duration-200 ${mobileServicesOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {mobileServicesOpen && (
                <div className="ml-3 space-y-1 border-l border-line pl-3">
                  <Link to="/services" className="block rounded px-3 py-2.5 text-sm font-semibold text-ink hover:bg-surface-raised">
                    All Services
                  </Link>
                  {services.map((s) => (
                    <Link
                      key={s.slug}
                      to={`/${s.slug}`}
                      className="flex items-center gap-3 rounded px-3 py-2.5 text-sm text-ink-soft hover:bg-surface-raised hover:text-ink"
                    >
                      <ServiceIcon slug={s.slug} className="h-4 w-4 shrink-0" />
                      {s.title}
                    </Link>
                  ))}
                </div>
              )}
              {NAV.map((n) => (
                <NavLink key={n.to} to={n.to} className="block rounded px-3 py-3 text-base font-medium text-ink hover:bg-surface-raised">
                  {n.label}
                </NavLink>
              ))}
              <a
                href={site.crmUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded px-3 py-3 text-base font-medium text-ink hover:bg-surface-raised"
              >
                {site.crmLabel}
                <ExternalIcon className="h-4 w-4 text-ink-soft" />
              </a>
              <div className="flex flex-wrap items-center gap-3 border-t border-line px-3 pb-1 pt-4">
                <Link
                  to="/contact"
                  className="rounded-lg bg-maroon-700 px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-maroon-800"
                >
                  Get in Touch
                </Link>
                <a
                  href={site.phoneHref}
                  className="rounded-lg border border-line px-5 py-3 text-sm font-semibold text-ink transition-colors duration-200 hover:border-accent hover:text-accent"
                >
                  Call {site.phone}
                </a>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
