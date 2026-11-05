import { useMemo } from "react";
import { buildCalendar, LAWS, type DueItem, type Law, type OverrideFile } from "../data/compliance";
import { useCms, type CmsContent } from "../lib/cms";

/** Maps the CRM's published compliance items onto the calendar's override format. */
function toOverrides(content: CmsContent | null): OverrideFile {
  if (!content) return {};
  const files = (list: { name: string; url: string }[]) => list.map(({ name, url }) => ({ name, url }));
  return {
    reviewed: content.complianceReviewedAt ? new Date(content.complianceReviewedAt * 1000).toISOString().slice(0, 10) : undefined,
    overrides: content.compliance.overrides.map((o) => ({
      id: o.ruleId,
      due: o.due,
      date: o.date,
      note: o.note,
      url: o.url,
      files: files(o.attachments),
    })),
    extra: content.compliance.extra
      .filter((e) => (LAWS as string[]).includes(e.law))
      .map((e) => ({
        title: e.title,
        law: e.law as Law,
        who: e.who,
        period: e.period,
        date: e.date,
        note: e.note,
        url: e.url,
        files: files(e.attachments),
      })),
  };
}

/**
 * Upcoming statutory due dates from today, with notified extensions applied.
 * The rule-based dates render immediately; extensions from the CRM arrive a
 * moment later. If the CRM cannot be reached, the statutory dates still show.
 */
export function useCompliance(months = 3): { items: DueItem[]; reviewed?: string; ready: boolean; failed: boolean; retry: () => void } {
  const { content, ready, failed, retry } = useCms();
  const file = useMemo(() => toOverrides(content), [content]);
  const items = useMemo(() => buildCalendar(new Date(), months, file), [months, file]);
  return { items, reviewed: file.reviewed, ready, failed, retry };
}
