import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { services } from "../data/services";
import { site } from "../data/site";
import ThemeToggle from "./ThemeToggle";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 ${
    isActive ? "text-gold-400" : "text-white/85 hover:text-white"
  }`;

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Close menus on navigation
  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
    setMobileServicesOpen(false);
  }, [location.pathname]);

  // Close the services dropdown on outside click / Escape
  useEffect(() => {
    if (!servicesOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!servicesRef.current?.contains(e.target as Node)) setServicesOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setServicesOpen(false);
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

  return (
    <header className="sticky top-0 z-40 bg-band-deep/95 shadow-lift backdrop-blur-sm">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-gold-500 focus:px-4 focus:py-2 focus:text-navy-950"
      >
        Skip to main content
      </a>
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="group flex items-center gap-3" aria-label={`${site.name} — home`}>
          <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-gold-500/40 bg-navy-800/60 font-display text-sm font-bold tracking-wide text-gold-400 transition-colors duration-200 group-hover:border-gold-500/70">
            RSA
          </span>
          <span className="hidden flex-col leading-tight min-[420px]:flex">
            <span className="font-display text-base font-semibold text-white sm:text-lg">
              R Shivakumar &amp; Associates
            </span>
            <span className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-gold-400/90">
              Chartered Accountants
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>

          <div className="relative" ref={servicesRef}>
            <button
              type="button"
              onClick={() => setServicesOpen((o) => !o)}
              aria-expanded={servicesOpen}
              aria-haspopup="true"
              className={`flex cursor-pointer items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                onServicesRoute ? "text-gold-400" : "text-white/85 hover:text-white"
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
            {servicesOpen && (
              <div className="absolute left-1/2 top-full z-50 mt-2 w-72 -translate-x-1/2 overflow-hidden rounded-xl border border-line bg-surface py-2 shadow-float">
                <Link
                  to="/services"
                  className="block px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-surface-raised"
                >
                  All Services
                </Link>
                <div className="mx-4 my-1 border-t border-line" />
                {services.map((s) => (
                  <Link
                    key={s.slug}
                    to={`/${s.slug}`}
                    className="block px-4 py-2.5 text-sm text-ink-soft transition-colors hover:bg-surface-raised hover:text-ink"
                  >
                    {s.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <NavLink to="/industries" className={navLinkClass}>
            Industries
          </NavLink>
          <NavLink to="/careers" className={navLinkClass}>
            Careers
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>
          <Link
            to="/contact"
            className="ml-3 rounded-md bg-gold-500 px-4 py-2 text-sm font-semibold text-navy-950 shadow-lift transition-all duration-200 hover:bg-gold-400"
          >
            Get in Touch
          </Link>
          <ThemeToggle className="ml-1 text-white/85" />
        </nav>

        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle className="text-white/85" />
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-md text-white/90 transition-colors hover:bg-white/10"
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
        <nav className="border-t border-white/10 bg-band-deep lg:hidden" aria-label="Mobile">
          <div className="space-y-1 px-4 py-4">
            <NavLink to="/" end className="block rounded-md px-3 py-2.5 text-base font-medium text-white/90 hover:bg-white/10">
              Home
            </NavLink>
            <NavLink to="/about" className="block rounded-md px-3 py-2.5 text-base font-medium text-white/90 hover:bg-white/10">
              About
            </NavLink>
            <button
              type="button"
              onClick={() => setMobileServicesOpen((o) => !o)}
              aria-expanded={mobileServicesOpen}
              className="flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2.5 text-base font-medium text-white/90 hover:bg-white/10"
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
              <div className="ml-3 space-y-1 border-l border-white/15 pl-3">
                <Link to="/services" className="block rounded-md px-3 py-2 text-sm font-semibold text-white/90 hover:bg-white/10">
                  All Services
                </Link>
                {services.map((s) => (
                  <Link
                    key={s.slug}
                    to={`/${s.slug}`}
                    className="block rounded-md px-3 py-2 text-sm text-white/75 hover:bg-white/10 hover:text-white"
                  >
                    {s.title}
                  </Link>
                ))}
              </div>
            )}
            <NavLink to="/industries" className="block rounded-md px-3 py-2.5 text-base font-medium text-white/90 hover:bg-white/10">
              Industries
            </NavLink>
            <NavLink to="/careers" className="block rounded-md px-3 py-2.5 text-base font-medium text-white/90 hover:bg-white/10">
              Careers
            </NavLink>
            <NavLink to="/contact" className="block rounded-md px-3 py-2.5 text-base font-medium text-white/90 hover:bg-white/10">
              Contact
            </NavLink>
          </div>
        </nav>
      )}
    </header>
  );
}
