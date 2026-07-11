import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";
import DisclaimerModal from "./DisclaimerModal";

export default function Layout() {
  const location = useLocation();
  return (
    <div className="flex min-h-dvh flex-col">
      <DisclaimerModal />
      <ScrollToTop />
      <Header />
      <main id="main" className="flex-1">
        {/* key forces remount on route change, replaying the CSS animation */}
        <div key={location.pathname} className="page-transition">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
