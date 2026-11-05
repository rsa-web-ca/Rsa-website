import { Link } from "react-router-dom";
import { site } from "../data/site";
import Reveal from "./Reveal";

interface ContactCtaProps {
  /** Lead-in sentence; defaults to the firm's standard closing line. */
  text?: string;
}

/** Closing block on inner pages: the firm's standard line, then the ways to reach it. */
export default function ContactCta({ text = "For any further details, kindly contact us." }: ContactCtaProps) {
  return (
    <Reveal as="section" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="grid gap-8 border-t-2 border-ink pt-10 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="max-w-xl font-display text-2xl font-medium leading-snug text-ink sm:text-3xl">{text}</p>
          <p className="mt-3 text-ink-soft">
            Telephone{" "}
            <a href={site.phoneHref} className="font-medium text-ink underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent">
              {site.phone}
            </a>{" "}
            · Email{" "}
            <a href={`mailto:${site.email}`} className="font-medium text-ink underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent">
              {site.email}
            </a>
          </p>
        </div>
        <Link
          to="/contact"
          className="justify-self-start rounded-lg bg-maroon-700 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-maroon-800"
        >
          Contact Us
        </Link>
      </div>
    </Reveal>
  );
}
