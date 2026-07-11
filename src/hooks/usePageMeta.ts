import { useEffect } from "react";
import { site } from "../data/site";

const DEFAULT_TITLE = `${site.name} | ${site.tagline}, Bengaluru`;
const DEFAULT_DESCRIPTION =
  `${site.name} — ${site.tagline} in Bengaluru since ${site.since}. ` +
  "Audit & assurance, taxation, tax litigation and consultancy services.";

/** Gets (or creates) a `<meta name="...">` element in the document head. */
function metaTag(name: string): HTMLMetaElement {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  return el;
}

/** Sets the document title and meta description/keywords per route (SPA equivalent of per-page <head>). */
export function usePageMeta(title?: string, description?: string, keywords?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${site.name}` : DEFAULT_TITLE;
    metaTag("description").setAttribute("content", description ?? DEFAULT_DESCRIPTION);

    // Keywords are page-specific; clear the tag when a route provides none so
    // it never leaks from a previous page.
    metaTag("keywords").setAttribute("content", keywords ?? "");
  }, [title, description, keywords]);
}
