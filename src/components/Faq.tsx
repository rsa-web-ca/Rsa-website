/** Native <details> accordion: keyboard and screen-reader support for free; CSS animates the open state. */
export default function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((f) => (
        <details key={f.q} className="faq group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left [&::-webkit-details-marker]:hidden">
            <span className="font-display text-xl text-ink transition-colors group-hover:text-accent sm:text-2xl">{f.q}</span>
            <span className="relative flex h-8 w-8 shrink-0 items-center justify-center text-ink-soft" aria-hidden="true">
              <span className="absolute h-px w-4 bg-current" />
              <span className="absolute h-4 w-px bg-current transition-transform duration-200 group-open:rotate-90 group-open:opacity-0" />
            </span>
          </summary>
          <div className="faq-body">
            <p className="max-w-3xl whitespace-pre-line pb-6 text-lg leading-relaxed text-ink-soft">{f.a}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
