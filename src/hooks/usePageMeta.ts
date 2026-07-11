import { useEffect } from "react";
import { site } from "../data/site";

const DEFAULT_TITLE = `${site.name} | ${site.tagline}, Bengaluru`;
const DEFAULT_DESCRIPTION =
  `${site.name} — ${site.tagline} in Bengaluru since ${site.since}. ` +
  "Audit & assurance, taxation, tax litigation and consultancy services.";

/** Sets the document title and meta description per route (SPA equivalent of per-page <head>). */
export function usePageMeta(title?: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${site.name}` : DEFAULT_TITLE;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    meta?.setAttribute("content", description ?? DEFAULT_DESCRIPTION);
  }, [title, description]);
}
