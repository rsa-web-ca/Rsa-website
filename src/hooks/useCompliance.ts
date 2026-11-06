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
  const items = useMemo(() => fromCrm(content, months) ?? buildCalendar(new Date(), months, file), [content, months, file]);
  return { items, reviewed: file.reviewed, ready, failed, retry };
}

const parseIso = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

/**
 * The calendar the CRM worked out from its Compliance master, when it sent
 * one: the CRM is the single source for what this page shows. Files attached
 * to an extension come from the matching override. Null for an older CRM, or
 * an empty list (an unseeded master), which leaves the built-in rules in charge
 * so the public calendar never goes blank.
 */
function fromCrm(content: CmsContent | null, months: number): DueItem[] | null {
  const list = content?.compliance.calendar;
  if (!list?.length) return null;
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const end = new Date(start.getFullYear(), start.getMonth() + months, start.getDate());
  const files = new Map(content!.compliance.overrides.map((o) => [`${o.ruleId}:${o.due}`, o.attachments.map(({ name, url }) => ({ name, url }))]));
  return list
    .filter((i) => (LAWS as string[]).includes(i.law))
    .map((i) => ({
      key: i.key,
      ruleId: i.ruleId,
      title: i.title,
      law: i.law as Law,
      who: i.who,
      period: i.period,
      date: parseIso(i.date),
      originalDate: parseIso(i.originalDate),
      extension: i.extension ? { ...i.extension, files: files.get(`${i.ruleId}:${i.originalDate}`) } : undefined,
    }))
    .filter((i) => i.date >= start && i.date <= end);
}
