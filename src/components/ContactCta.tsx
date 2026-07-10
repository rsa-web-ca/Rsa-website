import { Link } from "react-router-dom";
import { site } from "../data/site";
import Reveal from "./Reveal";

interface ContactCtaProps {
  /** Lead-in sentence; defaults to the firm's standard closing line. */
  text?: string;
}

export default function ContactCta({ text = "For any further details, kindly contact us." }: ContactCtaProps) {
  return (
    <Reveal as="section" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="rounded-2xl bg-band px-6 py-12 text-center sm:px-12">
        <p className="mx-auto max-w-xl font-display text-2xl font-medium text-white">{text}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/contact"
            className="rounded-md bg-gold-500 px-6 py-3 text-sm font-semibold text-navy-950 shadow-lift transition-all duration-200 hover:bg-gold-400"
          >
            Contact Us
          </Link>
          <a
            href={site.phoneHref}
            className="rounded-md border border-white/25 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:border-gold-400 hover:text-gold-400"
          >
            Call {site.phone}
          </a>
        </div>
      </div>
    </Reveal>
  );
}
