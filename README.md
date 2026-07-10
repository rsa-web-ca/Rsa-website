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
