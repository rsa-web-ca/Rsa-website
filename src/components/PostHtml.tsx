import DOMPurify from "dompurify";
import { useMemo } from "react";
import { cmsFileUrl, formatSize, type CmsFile } from "../lib/cms";

/**
 * A post body written in the CRM's editor. The CRM cleans it on every save;
 * this cleans it again before it reaches the page, because the site must not
 * depend on the CRM having done its job.
 *
 * Only a short list of tags is allowed, with no scripts, no event handlers
 * and no styles, and links may only be web, mail or phone. Pictures and
 * embedded files are then resolved from the file id they name, so the address
 * a viewer loads is built here from the CRM's address, never taken from the
 * post text.
 */

const ALLOWED_TAGS = [
  "p", "br", "hr", "h1", "h2", "h3", "h4", "h5", "h6",
  "strong", "b", "em", "i", "u", "s", "del", "ins", "sub", "sup", "mark", "code", "pre", "blockquote",
  "ul", "ol", "li", "a", "img", "figure", "figcaption",
  "table", "thead", "tbody", "tfoot", "tr", "th", "td", "caption", "colgroup", "col", "div",
];
const ALLOWED_ATTR = [
  "href", "title", "rel", "src", "alt", "width", "height", "colspan", "rowspan", "span", "start",
  "data-embed", "data-file-id", "data-title",
];
const FILE_ID = /^[a-f0-9-]{8,64}$/i;

function el(doc: Document, tag: string, attrs: Record<string, string> = {}, text?: string): HTMLElement {
  const node = doc.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  if (text !== undefined) node.textContent = text;
  return node;
}

export function renderPostHtml(html: string, files: CmsFile[]): string {
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    // Web, mail and phone links only; DOMPurify's default also allows a few others.
    ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|tel:|#)/i,
  });
  const doc = new DOMParser().parseFromString(`<body>${clean}</body>`, "text/html");
  const byId = new Map(files.map((f) => [f.id, f]));

  for (const img of Array.from(doc.querySelectorAll("img"))) {
    const id = img.getAttribute("data-file-id");
    if (id && FILE_ID.test(id)) img.setAttribute("src", cmsFileUrl(id));
    else if (!/^https:\/\//i.test(img.getAttribute("src") ?? "")) {
      img.remove();
      continue;
    }
    img.setAttribute("loading", "lazy");
    img.setAttribute("decoding", "async");
    img.removeAttribute("data-file-id");
  }

  for (const a of Array.from(doc.querySelectorAll("a[href^='http']"))) {
    a.setAttribute("rel", "noopener noreferrer");
  }

  for (const embed of Array.from(doc.querySelectorAll("div[data-embed]"))) {
    const id = embed.getAttribute("data-file-id") ?? "";
    if (!FILE_ID.test(id)) {
      embed.remove();
      continue;
    }
    const file = byId.get(id);
    const name = embed.getAttribute("data-title") || file?.name || "Download";
    const url = cmsFileUrl(id);
    const size = file ? ` (${formatSize(file.sizeBytes)})` : "";
    let replacement: HTMLElement;
    if (embed.getAttribute("data-embed") === "pdf") {
      replacement = el(doc, "figure", { class: "post-pdf" });
      const cap = el(doc, "figcaption", { class: "post-pdf-caption" });
      cap.append(el(doc, "a", { href: url }, `Download ${name}${size}`));
      replacement.append(el(doc, "iframe", { src: url, title: name, loading: "lazy" }), cap);
    } else {
      replacement = el(doc, "div", { class: "post-filecard" });
      replacement.append(el(doc, "span", {}, `${name}${size}`), el(doc, "a", { href: url }, "Download"));
      // A slide deck can also be read in the browser through Office's viewer.
      if (/\.pptx?$/i.test(file?.name ?? "")) {
        replacement.append(
          el(doc, "a", { href: `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url)}`, rel: "noopener noreferrer" }, "View online"),
        );
      }
    }
    embed.replaceWith(replacement);
  }
  return doc.body.innerHTML;
}

export default function PostHtml({ html, files }: { html: string; files: CmsFile[] }) {
  const safe = useMemo(() => renderPostHtml(html, files), [html, files]);
  return <div dangerouslySetInnerHTML={{ __html: safe }} />;
}
