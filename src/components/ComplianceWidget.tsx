import { Link } from "react-router-dom";
import { countdownLabel, daysUntil } from "../data/compliance";
import { useCompliance } from "../hooks/useCompliance";

const FMT = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" });

/** Glass panel of the next few statutory due dates, live from today. */
export default function ComplianceWidget({ count = 4 }: { count?: number }) {
  const { items, failed } = useCompliance(2);
  const next = items.slice(0, count);
  return (
    <aside className="rounded-xl border border-white/12 bg-[#121a28] p-6 text-white sm:p-7" aria-labelledby="next-due">
      <div className="flex items-center justify-between gap-4">
        <h2 id="next-due" className="flex items-center gap-2.5 text-sm font-semibold">
          <span className="live-dot" aria-hidden="true" />
          Next due dates
        </h2>
        <span className="text-xs text-white/55">{failed ? "Standard dates; extensions unavailable" : "Worked out from today"}</span>
      </div>
      <ul className="mt-5 divide-y divide-white/10">
        {next.map((i) => {
          const days = daysUntil(i.date);
          return (
            <li key={i.key} className="flex items-center gap-4 py-3.5">
              <span className="w-14 shrink-0 text-sm tabular-nums text-white/60">{FMT.format(i.date)}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-medium">{i.title}</span>
                <span className="block truncate text-xs text-white/55">{i.period}{i.extension ? " · Extended" : ""}</span>
              </span>
              <span className={`shrink-0 text-sm tabular-nums ${days <= 3 ? "font-semibold text-maroon-300" : "text-white/70"}`}>
                {countdownLabel(days).replace("In ", "")}
              </span>
            </li>
          );
        })}
      </ul>
      <Link to="/compliance-calendar" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white">
        Full compliance calendar
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true"><path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" /></svg>
      </Link>
    </aside>
  );
}
