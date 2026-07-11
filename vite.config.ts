import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { parsePost, byNewest } from './src/data/frontmatter.ts'
import { services } from './src/data/services.ts'
import { site } from './src/data/site.ts'

// Escape the five XML predefined entities.
function xml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

/** Read and parse every published (non-draft) blog post from disk. */
function loadPosts() {
  const dir = fileURLToPath(new URL("./src/content/blog/", import.meta.url))
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => parsePost(f.replace(/\.md$/, ""), readFileSync(join(dir, f), "utf8")))
    .filter((p) => !p.draft)
    .sort(byNewest)
}

/** Emit feed.xml, sitemap.xml and robots.txt into the build output. */
function seoFiles(): Plugin {
  return {
    name: "rsa-seo-files",
    apply: "build",
    generateBundle() {
      const posts = loadPosts()

      // --- RSS 2.0 feed ---
      const items = posts
        .map((p) => {
          const url = `${site.url}/blogs/${p.slug}`
          const pubDate = p.date ? new Date(p.date).toUTCString() : ""
          return [
            "    <item>",
            `      <title>${xml(p.title)}</title>`,
            `      <link>${url}</link>`,
            `      <guid isPermaLink="true">${url}</guid>`,
            pubDate ? `      <pubDate>${pubDate}</pubDate>` : "",
            p.summary ? `      <description>${xml(p.summary)}</description>` : "",
            ...p.tags.map((t) => `      <category>${xml(t)}</category>`),
            "    </item>",
          ]
            .filter(Boolean)
            .join("\n")
        })
        .join("\n")
      const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xml(site.name)} — Blog</title>
    <link>${site.url}/blogs</link>
    <description>Notes on audit, taxation and compliance from ${xml(site.name)}.</description>
    <language>en</language>
    <atom:link href="${site.url}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`
      this.emitFile({ type: "asset", fileName: "feed.xml", source: feed })

      // --- Sitemap ---
      const staticPaths = ["/", "/about", "/services", "/industries", "/careers", "/contact", "/blogs"]
      const servicePaths = services.map((s) => `/${s.slug}`)
      const urls: string[] = [...staticPaths, ...servicePaths].map(
        (path) => `  <url>\n    <loc>${site.url}${path === "/" ? "/" : path}</loc>\n  </url>`,
      )
      for (const p of posts) {
        const lastmod = p.updated || p.date
        urls.push(
          `  <url>\n    <loc>${site.url}/blogs/${p.slug}</loc>${
            lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""
          }\n  </url>`,
        )
      }
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`
      this.emitFile({ type: "asset", fileName: "sitemap.xml", source: sitemap })

      // --- robots.txt ---
      const robots = `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`
      this.emitFile({ type: "asset", fileName: "robots.txt", source: robots })
    },
  }
}

// https://vite.dev/config/
// The base path defaults to "/"; CI overrides it with --base for GitHub Pages.
export default defineConfig({
  plugins: [react(), tailwindcss(), seoFiles()],
})
