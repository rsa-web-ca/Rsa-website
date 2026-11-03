import { useEffect, useMemo, useState } from "react";
import { buildCalendar, type DueItem, type OverrideFile } from "../data/compliance";

const OVERRIDES_URL = `${import.meta.env.BASE_URL}compliance/overrides.json`;

// One fetch per page load, shared by every component that shows due dates.
let pending: Promise<OverrideFile> | null = null;
function loadOverrides(): Promise<OverrideFile> {
  pending ??= fetch(OVERRIDES_URL, { cache: "no-cache" })
    .then((r) => (r.ok ? (r.json() as Promise<OverrideFile>) : {}))
    .catch(() => ({}));
  return pending;
}

/**
 * Upcoming statutory due dates from today, with notified extensions applied.
 * Renders the rule-based dates immediately; overrides arrive a moment later.
 * If the overrides file cannot be fetched, the statutory dates still show.
 */
export function useCompliance(months = 3): { items: DueItem[]; reviewed?: string; ready: boolean } {
  const [file, setFile] = useState<OverrideFile | null>(null);

  useEffect(() => {
    let live = true;
    void loadOverrides().then((f) => live && setFile(f));
    return () => {
      live = false;
    };
  }, []);

  const items = useMemo(() => buildCalendar(new Date(), months, file ?? {}), [months, file]);
  return { items, reviewed: file?.reviewed, ready: file !== null };
}
