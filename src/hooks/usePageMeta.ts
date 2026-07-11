import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { site } from "../data/site";

const DEFAULT_TITLE = `${site.name} | ${site.tagline}, Bengaluru`;
const DEFAULT_DESCRIPTION =
  `${site.name} — ${site.tagline} in Bengaluru since ${site.since}. ` +
  "Audit & assurance, taxation, tax litigation and consultancy services.";
const OG_IMAGE = `${site.url}/images/hero.jpg`;

/** Gets (or creates) a `<meta>` element keyed by name or property. */
function metaTag(attr: "name" | "property", key: string): HTMLMetaElement {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  return el;
}

/** Gets (or creates) a `<link rel="...">` element in the head. */
function linkTag(rel: string): HTMLLinkElement {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  return el;
}

/**
 * Per-route <head> management for the SPA: title, description/keywords,
 * canonical URL, and Open Graph / Twitter Card tags. `type` is the Open Graph
 * object type — "website" for most pages, "article" for blog posts.
 */
export function usePageMeta(
  title?: string,
  description?: string,
  keywords?: string,
  type: "website" | "article" = "website",
) {
  const { pathname } = useLocation();

  useEffect(() => {
    const fullTitle = title ? `${title} | ${site.name}` : DEFAULT_TITLE;
    const desc = description ?? DEFAULT_DESCRIPTION;
    const canonical = site.url + pathname;

    document.title = fullTitle;
    metaTag("name", "description").setAttribute("content", desc);
    // Keywords are page-specific; clear the tag when a route provides none so
    // it never leaks from a previous page.
    metaTag("name", "keywords").setAttribute("content", keywords ?? "");
    linkTag("canonical").setAttribute("href", canonical);

    metaTag("property", "og:title").setAttribute("content", fullTitle);
    metaTag("property", "og:description").setAttribute("content", desc);
    metaTag("property", "og:type").setAttribute("content", type);
    metaTag("property", "og:url").setAttribute("content", canonical);
    metaTag("property", "og:image").setAttribute("content", OG_IMAGE);
    metaTag("property", "og:site_name").setAttribute("content", site.name);

    metaTag("name", "twitter:card").setAttribute("content", "summary_large_image");
    metaTag("name", "twitter:title").setAttribute("content", fullTitle);
    metaTag("name", "twitter:description").setAttribute("content", desc);
    metaTag("name", "twitter:image").setAttribute("content", OG_IMAGE);
  }, [title, description, keywords, type, pathname]);
}
