/**
 * Statutory due-date rules for the live compliance calendar.
 *
 * Dates are generated from these rules relative to today, so the calendar
 * never needs a yearly edit. When CBDT, CBIC or MCA notify an extension, the
 * change goes in public/compliance/overrides.json (fetched at runtime, so no
 * rebuild is needed); an override replaces the date of one occurrence and
 * shows its notification beside it.
 *
 * Review note: the rules reflect the standard dates under the GST, income-tax
 * and Companies/LLP provisions. GST quarterly (QRMP) dates use the Karnataka
 * group. Have a partner review this file after each Finance Act.
 */

export type Law = "GST" | "Income tax" | "TDS / TCS" | "Payroll" | "Companies & LLP";

export const LAWS: Law[] = ["GST", "Income tax", "TDS / TCS", "Payroll", "Companies & LLP"];

export interface DueItem {
  /** Stable key: rule id + the rule's own date (ISO), used to match overrides. */
  key: string;
  ruleId: string;
  title: string;
  law: Law;
  /** Who the date applies to. */
  who: string;
  /** The period or year the filing/payment is for. */
  period: string;
  /** Effective date (after any override). */
  date: Date;
  /** The rule's statutory date, kept when an override moves it. */
  originalDate: Date;
  /** Set when a notified extension applies. */
  extension?: { note: string; url?: string };
}

interface Rule {
  id: string;
  title: string;
  law: Law;
  who: string;
  /** Returns the due day for (year, month0), or null when the rule does not fall in that month. */
  day: (year: number, month0: number) => number | null;
  period: (year: number, month0: number) => string;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Financial year label for a date in (year, month0): April starts the year. */
function fy(year: number, month0: number): string {
  const start = month0 >= 3 ? year : year - 1;
  return `FY ${start}-${String((start + 1) % 100).padStart(2, "0")}`;
}

function prevMonth(year: number, month0: number): string {
  const m = (month0 + 11) % 12;
  const y = month0 === 0 ? year - 1 : year;
  return `${MONTHS[m]} ${y}`;
}

function prevQuarter(year: number, month0: number): string {
  // Quarter that ended in the month before (year, month0).
  const endMonth = (month0 + 11) % 12;
  const y = month0 === 0 ? year - 1 : year;
  const q = { 2: "Jan–Mar", 5: "Apr–Jun", 8: "Jul–Sep", 11: "Oct–Dec" }[endMonth];
  return q ? `${q} ${y}` : "";
}

const only = (months: number[], d: number) => (_y: number, m: number) => (months.includes(m) ? d : null);

/** Quarter label for a TDS return due in (year, month0). */
function tdsQuarter(year: number, month0: number): string {
  return {
    6: `Q1 (Apr–Jun) ${fy(year, 5)}`,
    9: `Q2 (Jul–Sep) ${fy(year, 8)}`,
    0: `Q3 (Oct–Dec) ${fy(year - 1, 11)}`,
    4: `Q4 (Jan–Mar) ${fy(year, 2)}`,
  }[month0] ?? "";
}

export const RULES: Rule[] = [
  // GST
  { id: "gstr1", title: "GSTR-1 (monthly)", law: "GST", who: "Regular taxpayers filing monthly", day: () => 11, period: prevMonth },
  { id: "gstr3b", title: "GSTR-3B (monthly) and tax payment", law: "GST", who: "Regular taxpayers filing monthly", day: () => 20, period: prevMonth },
  { id: "gstr1-qrmp", title: "GSTR-1 (quarterly, QRMP)", law: "GST", who: "QRMP scheme taxpayers", day: only([0, 3, 6, 9], 13), period: prevQuarter },
  { id: "gstr3b-qrmp", title: "GSTR-3B (quarterly, QRMP)", law: "GST", who: "QRMP taxpayers in Karnataka", day: only([0, 3, 6, 9], 22), period: prevQuarter },
  { id: "pmt06", title: "PMT-06 tax payment (QRMP)", law: "GST", who: "QRMP scheme taxpayers", day: only([1, 2, 4, 5, 7, 8, 10, 11], 25), period: prevMonth },
  { id: "cmp08", title: "CMP-08 statement and payment", law: "GST", who: "Composition taxpayers", day: only([0, 3, 6, 9], 18), period: prevQuarter },
  { id: "gstr4", title: "GSTR-4 annual return", law: "GST", who: "Composition taxpayers", day: only([3], 30), period: (y, m) => fy(y, m - 1) },
  { id: "gstr9", title: "GSTR-9 / 9C annual return", law: "GST", who: "Registered taxpayers above the threshold", day: only([11], 31), period: (y) => `FY ${y - 1}-${String(y % 100).padStart(2, "0")}` },

  // TDS / TCS
  {
    id: "tds-deposit",
    title: "TDS / TCS deposit",
    law: "TDS / TCS",
    who: "All deductors and collectors",
    // March deductions are due on 30 April; every other month on the 7th.
    day: (_y, m) => (m === 3 ? 30 : 7),
    period: prevMonth,
  },
  { id: "tds-return", title: "TDS / TCS quarterly returns", law: "TDS / TCS", who: "All deductors and collectors", day: (_y, m) => ({ 6: 31, 9: 31, 0: 31, 4: 31 })[m] ?? null, period: tdsQuarter },
  { id: "form16a", title: "Form 16A (TDS certificates)", law: "TDS / TCS", who: "Deductors on non-salary payments", day: only([7, 10, 1, 5], 15), period: (y, m) => ({ 7: tdsQuarter(y, 6), 10: tdsQuarter(y, 9), 1: tdsQuarter(y, 0), 5: tdsQuarter(y, 4) })[m] ?? "" },
  { id: "form16", title: "Form 16 to employees", law: "TDS / TCS", who: "Employers", day: only([5], 15), period: (y, m) => fy(y, m - 3) },

  // Income tax
  { id: "advance-tax", title: "Advance tax instalment", law: "Income tax", who: "Taxpayers with liability of ₹10,000 or more", day: only([5, 8, 11, 2], 15), period: (y, m) => `${{ 5: "15%", 8: "45%", 11: "75%", 2: "100%" }[m]} · ${fy(y, m)}` },
  { id: "itr", title: "Income-tax return (non-audit cases)", law: "Income tax", who: "Individuals, HUFs and others not liable to audit", day: only([6], 31), period: (y) => `Income of FY ${y - 1}-${String(y % 100).padStart(2, "0")}` },
  { id: "tax-audit", title: "Tax audit report", law: "Income tax", who: "Businesses and professions liable to tax audit", day: only([8], 30), period: (y) => `FY ${y - 1}-${String(y % 100).padStart(2, "0")}` },
  { id: "itr-audit", title: "Income-tax return (audit cases)", law: "Income tax", who: "Companies and assessees liable to audit", day: only([9], 31), period: (y) => `Income of FY ${y - 1}-${String(y % 100).padStart(2, "0")}` },
  { id: "tp-report", title: "Transfer pricing report", law: "Income tax", who: "Assessees with international transactions", day: only([9], 31), period: (y) => `FY ${y - 1}-${String(y % 100).padStart(2, "0")}` },
  { id: "itr-tp", title: "Income-tax return (transfer pricing cases)", law: "Income tax", who: "Assessees filing a transfer pricing report", day: only([10], 30), period: (y) => `Income of FY ${y - 1}-${String(y % 100).padStart(2, "0")}` },
  { id: "itr-belated", title: "Belated / revised income-tax return", law: "Income tax", who: "Taxpayers who missed or need to revise", day: only([11], 31), period: (y) => `Income of FY ${y - 1}-${String(y % 100).padStart(2, "0")}` },

  // Payroll
  { id: "pf-esi", title: "PF and ESI contributions", law: "Payroll", who: "Employers covered by EPF / ESI", day: () => 15, period: prevMonth },
  { id: "pt-ka", title: "Professional tax (Karnataka)", law: "Payroll", who: "Employers in Karnataka", day: () => 20, period: prevMonth },

  // Companies & LLP
  { id: "msme1", title: "MSME-1 half-yearly return", law: "Companies & LLP", who: "Companies with dues to MSE suppliers", day: (_y, m) => ({ 3: 30, 9: 31 })[m] ?? null, period: (y, m) => (m === 3 ? `Oct ${y - 1}–Mar ${y}` : `Apr–Sep ${y}`) },
  { id: "llp11", title: "LLP Form 11 (annual return)", law: "Companies & LLP", who: "LLPs", day: only([4], 30), period: (y) => `FY ${y - 1}-${String(y % 100).padStart(2, "0")}` },
  { id: "dpt3", title: "DPT-3 (return of deposits)", law: "Companies & LLP", who: "Companies", day: only([5], 30), period: (y) => `As at 31 Mar ${y}` },
  { id: "dir3", title: "DIR-3 KYC", law: "Companies & LLP", who: "Directors holding a DIN", day: only([8], 30), period: (y) => `${y}-${String((y + 1) % 100).padStart(2, "0")}` },
  { id: "adt1", title: "ADT-1 (auditor appointment)", law: "Companies & LLP", who: "Companies with AGM on 30 September", day: only([9], 14), period: (y) => `AGM ${y}` },
  { id: "aoc4", title: "AOC-4 (financial statements)", law: "Companies & LLP", who: "Companies with AGM on 30 September", day: only([9], 30), period: (y) => `FY ${y - 1}-${String(y % 100).padStart(2, "0")}` },
  { id: "llp8", title: "LLP Form 8 (accounts and solvency)", law: "Companies & LLP", who: "LLPs", day: only([9], 30), period: (y) => `FY ${y - 1}-${String(y % 100).padStart(2, "0")}` },
  { id: "mgt7", title: "MGT-7 / 7A (annual return)", law: "Companies & LLP", who: "Companies with AGM on 30 September", day: only([10], 29), period: (y) => `FY ${y - 1}-${String(y % 100).padStart(2, "0")}` },
];

export interface OverrideFile {
  /** ISO date the overrides were last reviewed against notifications. */
  reviewed?: string;
  /** Moves one occurrence: matched by rule id and the rule's own ISO date. */
  overrides?: { id: string; due: string; date: string; note: string; url?: string }[];
  /** One-off dates that no rule covers (e.g. a special filing window). */
  extra?: { title: string; law: Law; who?: string; period?: string; date: string; note?: string; url?: string }[];
}

export function isoDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function parseIso(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** All occurrences between `from` (inclusive, by day) and `months` months later, overrides applied, sorted by date. */
export function buildCalendar(from: Date, months: number, file: OverrideFile = {}): DueItem[] {
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const items: DueItem[] = [];
  // Generate from the previous month too, so an extension that moves an older date into the window still shows.
  for (let k = -1; k <= months; k++) {
    const y = start.getFullYear() + Math.floor((start.getMonth() + k) / 12);
    const m = (((start.getMonth() + k) % 12) + 12) % 12;
    for (const r of RULES) {
      const d = r.day(y, m);
      if (d === null) continue;
      const date = new Date(y, m, d);
      items.push({ key: `${r.id}:${isoDate(date)}`, ruleId: r.id, title: r.title, law: r.law, who: r.who, period: r.period(y, m), date, originalDate: date });
    }
  }

  for (const o of file.overrides ?? []) {
    const item = items.find((i) => i.ruleId === o.id && isoDate(i.originalDate) === o.due);
    if (item) {
      item.date = parseIso(o.date);
      item.extension = { note: o.note, url: o.url };
    }
  }
  for (const e of file.extra ?? []) {
    const date = parseIso(e.date);
    items.push({
      key: `extra:${e.title}:${e.date}`,
      ruleId: "extra",
      title: e.title,
      law: e.law,
      who: e.who ?? "",
      period: e.period ?? "",
      date,
      originalDate: date,
      extension: e.note ? { note: e.note, url: e.url } : undefined,
    });
  }

  const end = new Date(start.getFullYear(), start.getMonth() + months, start.getDate());
  return items.filter((i) => i.date >= start && i.date <= end).sort((a, b) => a.date.getTime() - b.date.getTime() || a.title.localeCompare(b.title));
}

/** Whole days from today to `d` (0 = today). */
export function daysUntil(d: Date, today = new Date()): number {
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((d.getTime() - t.getTime()) / 86_400_000);
}

export function countdownLabel(days: number): string {
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  return `In ${days} days`;
}

/** A one-event .ics file for "add to calendar". */
export function icsFor(item: DueItem): string {
  const d = isoDate(item.date).replace(/-/g, "");
  const next = new Date(item.date.getFullYear(), item.date.getMonth(), item.date.getDate() + 1);
  const esc = (s: string) => s.replace(/[,;\\]/g, (c) => `\\${c}`);
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//R Shivakumar & Associates//Compliance calendar//EN",
    "BEGIN:VEVENT",
    `UID:${item.key}@rsa-india.in`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`,
    `DTSTART;VALUE=DATE:${d}`,
    `DTEND;VALUE=DATE:${isoDate(next).replace(/-/g, "")}`,
    `SUMMARY:${esc(`${item.title} — ${item.period}`)}`,
    `DESCRIPTION:${esc(`${item.who}. Due date as per the R Shivakumar & Associates compliance calendar; check for notified extensions.`)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
