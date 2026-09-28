import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import posthog from "posthog-js";
import { PostHogProvider } from "@posthog/react";
import "./index.css";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Industries from "./pages/Industries";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import NotFound from "./pages/NotFound";
import { services } from "./data/services";
import { posts } from "./data/blog";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/services", element: <Services /> },
      { path: "/industries", element: <Industries /> },
      { path: "/careers", element: <Careers /> },
      // The old Wix site hosted careers at /blank — keep the URL working.
      { path: "/blank", element: <Navigate to="/careers" replace /> },
      { path: "/contact", element: <Contact /> },
      { path: "/blogs", element: <Blog /> },
      ...posts.map((p) => ({ path: `/blogs/${p.slug}`, element: <BlogPost slug={p.slug} /> })),
      ...services.map((s) => ({ path: `/${s.slug}`, element: <ServiceDetail slug={s.slug} /> })),
      { path: "*", element: <NotFound /> },
    ],
  },
], {
  // Vite's base is "/" locally and on Netlify, but GitHub Pages serves the
  // site from a subpath (e.g. /Rsa-website/ or /Rsa-website/pr-preview/pr-N/).
  basename: import.meta.env.BASE_URL.replace(/\/$/, ""),
});

// Analytics only run when a project key is baked in at build time (the
// production deploy), so local dev and PR previews don't pollute the data.
const posthogKey = import.meta.env.VITE_PUBLIC_POSTHOG_KEY;
if (posthogKey) {
  posthog.init(posthogKey, {
    api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    // Tracks $pageview on client-side route changes as well as full loads.
    defaults: "2025-05-24",
    // The PostHog project is shared with another site, so tag every event
    // (including the initial $pageview) to tell this site's data apart.
    loaded: (ph) => ph.register({ site: "rsa-website" }),
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PostHogProvider client={posthog}>
      <RouterProvider router={router} />
    </PostHogProvider>
  </StrictMode>,
);
