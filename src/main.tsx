import { StrictMode, Suspense, lazy, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Navigate, RouterProvider, useParams } from "react-router-dom";
import "./index.css";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import { services } from "./data/services";
import { posts } from "./data/blog";

// Home is in the first download; every other page is fetched when it is
// first visited, so a visitor landing on the home page does not download the
// whole site.
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const Industries = lazy(() => import("./pages/Industries"));
const Careers = lazy(() => import("./pages/Careers"));
const Contact = lazy(() => import("./pages/Contact"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));

/** An old /blogs/<slug> address, sent on to the same post under /insights. */
function OldBlogPost() {
  const { slug = "" } = useParams();
  return <Navigate to={`/insights/${slug}`} replace />;
}
const NotFound = lazy(() => import("./pages/NotFound"));
const ComplianceCalendar = lazy(() => import("./pages/ComplianceCalendar"));

/** Holds the page's height while its code arrives, so the footer does not jump up. */
const page = (el: ReactNode) => <Suspense fallback={<div className="min-h-[70vh]" />}>{el}</Suspense>;

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: page(<About />) },
      { path: "/services", element: page(<Services />) },
      { path: "/industries", element: page(<Industries />) },
      { path: "/careers", element: page(<Careers />) },
      // The old Wix site hosted careers at /blank — keep the URL working.
      { path: "/blank", element: <Navigate to="/careers" replace /> },
      { path: "/contact", element: page(<Contact />) },
      { path: "/compliance-calendar", element: page(<ComplianceCalendar />) },
      // The Blog is now Insights. The old addresses keep working: shared links and search results point at them.
      { path: "/insights", element: page(<Blog />) },
      ...posts.map((p) => ({ path: `/insights/${p.slug}`, element: page(<BlogPost slug={p.slug} />) })),
      // Posts published from the CRM have no static route; this catches them.
      { path: "/insights/:slug", element: page(<BlogPost />) },
      { path: "/blogs", element: <Navigate to="/insights" replace /> },
      { path: "/blogs/:slug", element: <OldBlogPost /> },
      ...services.map((s) => ({ path: `/${s.slug}`, element: page(<ServiceDetail slug={s.slug} />) })),
      { path: "*", element: page(<NotFound />) },
    ],
  },
  // Unlisted internal tool: no site header/footer and no links to it from the
  // site. Loaded on demand so its palette catalogue stays out of the main bundle.
  {
    path: "/fs-palette-studio",
    lazy: () => import("./pages/fs-palette-studio/FsPaletteStudio").then((m) => ({ Component: m.default })),
  },
  { path: "/fs-pallete-studio", element: <Navigate to="/fs-palette-studio" replace /> },
], {
  // Vite's base is "/" locally and on Netlify, but GitHub Pages serves the
  // site from a subpath (e.g. /Rsa-website/ or /Rsa-website/pr-preview/pr-N/).
  basename: import.meta.env.BASE_URL.replace(/\/$/, ""),
});

// Analytics only run when enabled and a project key is baked in at build time
// (the production deploy), so local dev and PR previews don't pollute the data.
// Loaded once the page is up and idle: analytics are never worth delaying the
// first paint for, and the library is a large part of the bundle.
const posthogKey = import.meta.env.VITE_PUBLIC_POSTHOG_KEY;
if (posthogKey && import.meta.env.VITE_PUBLIC_POSTHOG_ENABLED === "true") {
  const start = () =>
    void import("posthog-js").then(({ default: posthog }) =>
  posthog.init(posthogKey, {
    api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    // Tracks $pageview on client-side route changes as well as full loads.
    defaults: "2025-05-24",
    // The PostHog project is shared with another site, so tag every event
    // (including the initial $pageview) to tell this site's data apart.
    loaded: (ph) => ph.register({ site: "rsa-website" }),
  }));
  const idle = (cb: () => void) => ("requestIdleCallback" in window ? window.requestIdleCallback(cb, { timeout: 4000 }) : setTimeout(cb, 2000));
  if (document.readyState === "complete") idle(start);
  else window.addEventListener("load", () => idle(start), { once: true });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
