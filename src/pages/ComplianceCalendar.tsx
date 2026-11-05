import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import ContactCta from "../components/ContactCta";
import { LAWS, countdownLabel, daysUntil, icsFor, isoDate, type DueItem, type Law } from "../data/compliance";
import { useCompliance } from "../hooks/useCompliance";
import { usePageMeta } from "../hooks/usePageMeta";

const MONTH_FMT = new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" });
const DAY_FMT = new Intl.DateTimeFormat("en-IN", { weekday: "short" });
const FULL_FMT = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" });

function downloadIcs(item: DueItem) {
  const blob = new Blob([icsFor(item)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${item.ruleId}-${isoDate(item.date)}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

export function Countdown({ days, onDark = false }: { days: number; onDark?: boolean }) {
  const urgent = days <= 3;
  const tone = urgent
    ? "bg-maroon-700 text-white"
    : onDark
      ? "bg-white/10 text-white/85"
      : "bg-surface-raised text-ink-soft";
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums ${tone}`}>{countdownLabel(days)}</span>;
}

export default function ComplianceCalendar() {
  usePageMeta(
    "Compliance Calendar",
    "Upcoming GST, income-tax, TDS, payroll and ROC due dates, updated live with notified extensions.",
  );
  const { items, reviewed, failed, retry } = useCompliance(6);
  const [active, setActive] = useState<Set<Law>>(new Set());

  const shown = useMemo(() => (active.size ? items.filter((i) => active.has(i.law)) : items), [items, active]);
  const groups = useMemo(() => {
    const map = new Map<string, DueItem[]>();
    for (const i of shown) {
      const k = MONTH_FMT.format(i.date);
      map.set(k, [...(map.get(k) ?? []), i]);
    }
    return [...map.entries()];
  }, [shown]);

  function toggle(law: Law) {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(law)) next.delete(law);
      else next.add(law);
      return next;
    });
  }

  return (
    <>
      <PageHeader
        title="Compliance Calendar"
        lede="Upcoming statutory due dates for the next six months, worked out from today and updated when extensions are notified."
        film="compliance"
      />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-28">
              <h2 className="text-sm font-semibold text-ink">Filter by law</h2>
              <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter due dates by law">
                {LAWS.map((law) => {
                  const on = active.has(law);
                  return (
                    <button
                      key={law}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggle(law)}
                      className={`cursor-pointer rounded-full border px-3.5 py-2 text-sm font-medium transition-colors ${
                        on ? "border-maroon-700 bg-maroon-700 text-white" : "border-line text-ink-soft hover:border-ink/40 hover:text-ink"
                      }`}
                    >
                      {law}
                    </button>
                  );
                })}
              </div>
              {active.size > 0 && (
                <button type="button" onClick={() => setActive(new Set())} className="mt-3 cursor-pointer text-sm font-semibold text-accent underline underline-offset-4">
                  Show all
                </button>
              )}

              <div className="mt-10 rounded-lg border border-line bg-surface p-5 text-sm leading-relaxed text-ink-soft">
                <h2 className="font-semibold text-ink">How these dates stay current</h2>
                <p className="mt-2">
                  Dates follow the statutory rules and roll forward automatically. When CBDT, CBIC or
                  MCA notify an extension, the new date replaces the old one here, with the notification
                  noted beside it.
                </p>
                {reviewed && <p className="mt-3 text-xs">Notifications last reviewed: {FULL_FMT.format(new Date(reviewed))}</p>}
                <p className="mt-3 text-xs">
                  For general information only, not professional advice. Your own dates may differ;{" "}
                  <Link to="/contact" className="font-medium text-ink underline underline-offset-2">ask us</Link>.
                </p>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-9">
            {failed && (
              // The statutory dates below are worked out here and always show; only notified
              // extensions and one-off dates come from the firm, and those could not be loaded.
              <div role="status" className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
                <p>
                  <span className="font-semibold">Extensions could not be loaded.</span> Showing the standard statutory dates only; a notified extension may not appear.
                </p>
                <button type="button" onClick={retry} className="cursor-pointer font-semibold underline underline-offset-2">
                  Try again
                </button>
              </div>
            )}
            {groups.length === 0 && <p className="text-ink-soft">No due dates in this filter for the next six months.</p>}
            {groups.map(([month, list]) => (
              <section key={month} className="mb-14 last:mb-0" aria-labelledby={`m-${month}`}>
                <h2 id={`m-${month}`} className="sticky top-[72px] z-10 border-b-2 border-ink bg-bg/95 py-3 font-display text-2xl font-medium text-ink backdrop-blur md:top-[72px]">
                  {month}
                </h2>
                <ul>
                  {list.map((i) => {
                    const days = daysUntil(i.date);
                    return (
                      <li key={i.key} className="grid grid-cols-[64px_1fr] gap-x-5 gap-y-3 border-b border-line py-5 sm:grid-cols-[72px_1fr_auto] sm:items-center">
                        <div className="flex h-16 w-16 flex-col items-center justify-center rounded-lg border border-line bg-surface sm:h-[72px] sm:w-[72px]">
                          <span className="font-display text-2xl leading-none text-ink">{i.date.getDate()}</span>
                          <span className="mt-1 text-xs text-ink-soft">{DAY_FMT.format(i.date)}</span>
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-medium text-ink">{i.title}</h3>
                            <span className="text-xs text-ink-soft">· {i.law}</span>
                          </div>
                          <p className="mt-1 text-sm text-ink-soft">
                            {i.period}
                            {i.who && <> · {i.who}</>}
                          </p>
                          {i.date.getDay() === 0 && !i.extension && (
                            <p className="mt-1 text-xs text-ink-soft">Falls on a Sunday; check whether the next working day applies.</p>
                          )}
                          {i.extension && (
                            <p className="mt-2 text-sm text-ink">
                              <span className="mr-2 font-semibold text-accent">Extended.</span>
                              {i.extension.url ? (
                                <a href={i.extension.url} target="_blank" rel="noreferrer" className="underline underline-offset-2">{i.extension.note}</a>
                              ) : (
                                i.extension.note
                              )}
                              {isoDate(i.originalDate) !== isoDate(i.date) && (
                                <span className="text-ink-soft"> (was {FULL_FMT.format(i.originalDate)})</span>
                              )}
                            </p>
                          )}
                          {i.extension?.files && i.extension.files.length > 0 && (
                            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                              {i.extension.files.map((f) => (
                                <li key={f.url}>
                                  <a href={f.url} className="font-medium text-ink underline decoration-line underline-offset-4 hover:text-accent hover:decoration-accent">
                                    {f.name}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <div className="col-start-2 flex items-center gap-3 sm:col-start-3">
                          <Countdown days={days} />
                          <button
                            type="button"
                            onClick={() => downloadIcs(i)}
                            aria-label={`Add ${i.title} on ${FULL_FMT.format(i.date)} to your calendar`}
                            className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-line px-3 text-xs font-semibold text-ink-soft transition-colors hover:border-accent hover:text-accent"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                              <rect x="3" y="4" width="18" height="18" rx="2" />
                              <path d="M16 2v4M8 2v4M3 10h18M12 14v4M10 16h4" />
                            </svg>
                            Add
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </section>
      <ContactCta text="Need help meeting a deadline? Kindly contact us." />
    </>
  );
}
