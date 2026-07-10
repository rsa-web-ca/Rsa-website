import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import "./index.css";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Industries from "./pages/Industries";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import { services } from "./data/services";

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
      ...services.map((s) => ({ path: `/${s.slug}`, element: <ServiceDetail slug={s.slug} /> })),
      { path: "*", element: <NotFound /> },
    ],
  },
], {
  // Vite's base is "/" locally and on Netlify, but GitHub Pages serves the
  // site from a subpath (e.g. /Rsa-website/ or /Rsa-website/pr-preview/pr-N/).
  basename: import.meta.env.BASE_URL.replace(/\/$/, ""),
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
