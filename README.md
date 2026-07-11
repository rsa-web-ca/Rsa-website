# R Shivakumar & Associates — Website

Modern rebuild of [rsa-india.in](https://www.rsa-india.in/) for R Shivakumar & Associates,
Chartered Accountants, Bengaluru (est. 1997).

## Stack

- **React 19 + TypeScript** on **Vite**
- **Tailwind CSS v4** (OKLCH design tokens, light/dark theme toggle)
- **React Router 7** — one route per original page, including the nine service pages
- **FormSubmit** for the contact and careers forms (no backend needed)
- **Netlify** for hosting (`netlify.toml` included)

## Development

```bash
npm install
npm run dev       # local dev server
npm run build     # typecheck + production build to dist/
npm run preview   # serve the production build locally
npm run lint      # oxlint
```

## Deployment (Netlify)

Connect the repository in Netlify — `netlify.toml` already configures:

- build command `npm run build`, publish directory `dist`
- SPA fallback (`/* → /index.html`)
- `301` redirect from the old Wix careers URL `/blank` to `/careers`

## Deployment (GitHub Pages)

Two workflows in `.github/workflows/` publish to the `gh-pages` branch:

- **`deploy.yml`** — every push to `master` builds the site and deploys it to
  <https://rsa-web-ca.github.io/Rsa-website/>. A copy of `index.html` is served
  as `404.html` so React Router deep links survive a page refresh.
- **`pr-preview.yml`** — every pull request gets its own preview at
  `…/Rsa-website/pr-preview/pr-<number>/`. The workflow posts the link as a
  comment on the PR, updates the preview on each push, and deletes it when the
  PR is closed or merged. (Previews only run for branches in this repo, not
  forks — fork PRs don't get a write token.)

> **One-time setup:** in the repo's **Settings → Pages**, set *Source* to
> **Deploy from a branch**, branch `gh-pages`, folder `/ (root)`. The
> `gh-pages` branch is created automatically by the first workflow run.

The site is base-path aware: the workflows pass `--base` to Vite, and the app
reads `import.meta.env.BASE_URL` for the router basename and public images, so
the same code still works at `/` on Netlify and local dev.

## Forms (FormSubmit)

Both forms POST to FormSubmit's AJAX endpoint for `admin@rsa-india.in` with a CC to
`rshivakumarca@rsa-india.in` (configured in `src/data/site.ts`).

> **One-time activation:** the first submission after deployment triggers a
> confirmation email from FormSubmit to `admin@rsa-india.in`. Click the link in
> that email once; every submission after that is delivered normally.

Spam protection: a hidden honeypot field plus FormSubmit's own filtering
(`_captcha` is disabled for a smoother UX; re-enable in
`src/hooks/useFormSubmit.ts` if spam becomes an issue).

## Content

All page copy lives in `src/data/` (`site.ts`, `services.ts`, `industries.ts`,
`careers.ts`) — edit those files to change text without touching components.

## Blog

The blog lives at `/blogs` (index) and `/blogs/<slug>` (individual posts), and
matches the site's design — no separate generator or build step.

To publish a post, drop a Markdown file into `src/content/blog/`. The filename
becomes the URL slug (`hello-world.md` → `/blogs/hello-world`). Start it with a
frontmatter block:

```markdown
---
title: Hello World
date: 2026-07-11
author: R Shivakumar & Associates
summary: A short teaser shown on the blog index.
tags: announcements, firm news
updated: 2026-07-15
draft: false
---

Your **Markdown** body here…
```

Frontmatter fields:

| Field     | Required | Notes                                                            |
| --------- | -------- | ---------------------------------------------------------------- |
| `title`   | yes      | Falls back to the filename slug if omitted.                      |
| `date`    | yes      | ISO `YYYY-MM-DD`; posts are sorted newest-first by this.         |
| `author`  | no       | Shown in the byline.                                             |
| `summary` | no       | Teaser on the index; also used as the post's meta description.   |
| `tags`    | no       | `a, b, c` or `[a, b, c]`; renders pills + the meta keywords tag. |
| `updated` | no       | ISO date; shows a "Last updated …" line on the post.            |
| `draft`   | no       | `true` hides the post from the production build (visible in dev).|

Reading time is estimated automatically from the body — no field needed.

`src/data/blog.ts` loads every file at build time (via Vite's
`import.meta.glob`), parses the frontmatter, and sorts posts newest-first — so
adding a file automatically lists it on the index and gives it a route. Post
bodies are rendered with `react-markdown` + `remark-gfm` (GitHub-flavoured
Markdown) and styled by the on-brand `.blog-prose` block in `src/index.css`.
