/**
 * Engagement steps as a numbered timeline: six steps along one rule, read left
 * to right on wide screens and top to bottom on phones. Static on purpose; the
 * order of the work is the content, and it should be readable at a glance
 * rather than revealed by scrolling.
 */
export default function HowWeWork({ steps }: { steps: { title: string; body: string }[] }) {
  return (
    <section className="border-t border-line bg-bg" aria-labelledby="how-title">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <p className="text-sm font-semibold text-accent">How we work</p>
        <h2 id="how-title" className="mt-4 max-w-2xl font-display text-4xl font-medium leading-[1.05] text-ink sm:text-5xl">
          From first call to final filing
        </h2>
        <ol className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-14">
          {steps.map((s, i) => (
            <li key={s.title} className="relative border-t border-ink/15 pt-6">
              <span className="absolute -top-[5px] left-0 h-[9px] w-[9px] rounded-full bg-maroon-700" aria-hidden="true" />
              <span className="font-display text-sm tabular-nums text-ink-soft">Step {String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 font-display text-2xl font-medium text-ink">{s.title}</h3>
              <p className="mt-3 max-w-sm leading-relaxed text-ink-soft">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
