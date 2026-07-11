import { Link } from "react-router-dom";
import { usePageMeta } from "../hooks/usePageMeta";

export default function NotFound() {
  usePageMeta("Page not found");
  return (
    <section className="mx-auto flex max-w-7xl flex-col items-center px-4 py-32 text-center sm:px-6 lg:px-8">
      <p className="font-display text-7xl font-semibold text-navy-800 dark:text-gold-400">404</p>
      <h1 className="mt-4 font-display text-2xl font-semibold text-ink">Page not found</h1>
      <p className="mt-2 max-w-md text-ink-soft">
        The page you are looking for doesn't exist or may have moved.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          to="/"
          className="rounded-md bg-gold-500 px-6 py-3 text-sm font-semibold text-navy-950 shadow-lift transition-all duration-200 hover:bg-gold-400"
        >
          Back to Home
        </Link>
        <Link
          to="/services"
          className="rounded-md border border-line px-6 py-3 text-sm font-semibold text-ink transition-colors duration-200 hover:border-gold-500 hover:text-accent"
        >
          Browse Services
        </Link>
        <Link
          to="/contact"
          className="rounded-md border border-line px-6 py-3 text-sm font-semibold text-ink transition-colors duration-200 hover:border-gold-500 hover:text-accent"
        >
          Contact Us
        </Link>
      </div>
    </section>
  );
}
