import { faqs } from "../data/home";

/** Native <details> accordion: keyboard and screen-reader support for free; CSS animates the open state. */
export default function Faq() {
  return (
    <div className="divide-y divide-line border-y border-line">
      {faqs.map((f) => (
        <details key={f.q} className="faq group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left [&::-webkit-details-marker]:hidden">
            <span className="font-display text-xl text-ink transition-colors group-hover:text-accent sm:text-2xl">{f.q}</span>
            <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line transition-colors group-open:border-maroon-700 group-open:bg-maroon-700" aria-hidden="true">
              <span className="absolute h-px w-4 bg-ink transition-colors group-open:bg-white" />
              <span className="absolute h-4 w-px bg-ink transition-transform duration-300 group-open:rotate-90 group-open:bg-white" />
            </span>
          </summary>
          <div className="faq-body">
            <p className="max-w-3xl pb-6 text-lg leading-relaxed text-ink-soft">{f.a}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
