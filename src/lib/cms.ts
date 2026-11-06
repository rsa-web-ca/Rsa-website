import { useEffect, useSyncExternalStore } from "react";

/**
 * Content the firm edits in its CRM (crm.rsa-india.in → Website): compliance
 * extensions, posts, FAQs, process steps and careers openings. Only published
 * items are returned, so nothing here is a draft.
 *
 * The site is static and must never depend on the CRM being up: every caller
 * has built-in content to fall back to, and a failed or slow fetch simply
 * leaves that in place.
 */

const CMS_URL = (import.meta.env.VITE_CMS_URL || "https://crm.rsa-india.in").replace(/\/$/, "");

export interface CmsFile {
  id: string;
  name: string;
  url: string;
  sizeBytes: number;
  mimeType: string | null;
}

interface CmsBase {
  id: string;
  attachments: CmsFile[];
  cover: CmsFile | null;
  publishedAt: number | null;
}

export interface CmsOverride extends CmsBase { ruleId: string; due: string; date: string; note: string; url?: string }
export interface CmsExtra extends CmsBase { title: string; law: string; who?: string; period?: string; date: string; note?: string; url?: string }
/** `format: "html"` bodies come from the CRM's rich editor; without it the body is Markdown. `inline` lists the pictures and files used inside an HTML body. */
export interface CmsPost extends CmsBase { title: string; slug: string; summary?: string; body: string; format?: "html"; inline?: CmsFile[]; date: string; author?: string; tags?: string[]; category?: string }
export interface CmsCalendarItem { key: string; ruleId: string; title: string; law: string; who: string; period: string; date: string; originalDate: string; extension?: { note: string; url?: string } }
export interface CmsFaq extends CmsBase { q: string; a: string }
export interface CmsStep extends CmsBase { title: string; body: string }
export interface CmsCareer extends CmsBase { title: string; summary?: string; open: boolean }

export interface CmsContent {
  /** Unix seconds; when an admin last checked the calendar against notifications. */
  complianceReviewedAt: number | null;
  /**
   * `calendar` is the calendar worked out by the CRM from its Compliance master
   * (dates as YYYY-MM-DD, extensions applied). When present it is the calendar;
   * the rules in src/data/compliance.ts are only the fallback for an older CRM.
   */
  compliance: { overrides: CmsOverride[]; extra: CmsExtra[]; calendar?: CmsCalendarItem[] };
  posts: CmsPost[];
  faqs: CmsFaq[];
  process: CmsStep[];
  careers: CmsCareer[];
}

/** How long the site waits for the CRM before showing its built-in content and a Retry. */
const CMS_TIMEOUT_MS = 8_000;

type CmsState = { content: CmsContent | null; ready: boolean; failed: boolean };

/**
 * One request shared by every component on the page, held in a tiny store so
 * a Retry pressed in one place updates them all.
 *
 * A failure is not kept: the next component that mounts (moving to another
 * page, say) or a Retry asks again. It used to be cached for the life of the
 * tab, so after one blip every page kept the built-in content and a CRM-only
 * post read "Page not found" until a full reload.
 */
let state: CmsState = { content: null, ready: false, failed: false };
let pending: Promise<void> | null = null;
const listeners = new Set<() => void>();

function set(next: CmsState) {
  state = next;
  for (const l of listeners) l();
}

/** Where a post's uploaded file is served from; built from the id, never taken from the post text. */
export function cmsFileUrl(id: string): string {
  return `${CMS_URL}/api/public/website/files/${encodeURIComponent(id)}`;
}

/** Fetches the content unless it is already here or on its way. */
export function loadCms(): Promise<void> {
  if (state.content || pending) return pending ?? Promise.resolve();
  if (state.failed) set({ ...state, ready: false, failed: false });
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CMS_TIMEOUT_MS);
  pending = fetch(`${CMS_URL}/api/public/website/content`, { credentials: "omit", signal: controller.signal })
    .then((r) => (r.ok ? (r.json() as Promise<CmsContent>) : Promise.reject(new Error(`CMS ${r.status}`))))
    .then(
      (content) => set({ content, ready: true, failed: false }),
      () => set({ content: null, ready: true, failed: true }),
    )
    .finally(() => {
      clearTimeout(timer);
      pending = null;
    });
  return pending;
}

/**
 * `content` is null until the CRM answers. `failed` means it could not be
 * reached (or took too long): callers show their built-in content, and say so
 * where it matters, with `retry`.
 */
export function useCms(): CmsState & { retry: () => void } {
  const snapshot = useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => state,
    () => state,
  );
  useEffect(() => {
    void loadCms();
  }, []);
  return { ...snapshot, retry: () => void loadCms() };
}

/** "182 KB", "1.4 MB" — for download links. */
export function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
