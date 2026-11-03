import { useEffect, useState } from "react";

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
export interface CmsPost extends CmsBase { title: string; slug: string; summary?: string; body: string; date: string; author?: string; tags?: string[] }
export interface CmsFaq extends CmsBase { q: string; a: string }
export interface CmsStep extends CmsBase { title: string; body: string }
export interface CmsCareer extends CmsBase { title: string; summary?: string; open: boolean }

export interface CmsContent {
  /** Unix seconds; when an admin last checked the calendar against notifications. */
  complianceReviewedAt: number | null;
  compliance: { overrides: CmsOverride[]; extra: CmsExtra[] };
  posts: CmsPost[];
  faqs: CmsFaq[];
  process: CmsStep[];
  careers: CmsCareer[];
}

// One request per page load, shared by every component that reads content.
let pending: Promise<CmsContent | null> | null = null;

export function loadCms(): Promise<CmsContent | null> {
  pending ??= fetch(`${CMS_URL}/api/public/website/content`, { credentials: "omit" })
    .then((r) => (r.ok ? (r.json() as Promise<CmsContent>) : null))
    .catch(() => null);
  return pending;
}

/** `content` is null until the CRM answers, and stays null if it cannot be reached. */
export function useCms(): { content: CmsContent | null; ready: boolean } {
  const [state, setState] = useState<{ content: CmsContent | null; ready: boolean }>({ content: null, ready: false });
  useEffect(() => {
    let live = true;
    void loadCms().then((content) => live && setState({ content, ready: true }));
    return () => {
      live = false;
    };
  }, []);
  return state;
}

/** "182 KB", "1.4 MB" — for download links. */
export function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
