import { useEffect, useRef, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Delay in ms before the reveal transition starts once visible. */
  delay?: number;
  as?: "div" | "section" | "li";
}

/**
 * Progressive-enhancement scroll reveal. Content is fully visible without JS
 * or with reduced motion; the hide class is only added right before the
 * IntersectionObserver can un-hide it.
 */
export default function Reveal({ children, className = "", delay = 0, as: Tag = "div" }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const show = () => window.setTimeout(() => el.classList.add("reveal-in"), delay);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          show();
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );

    el.classList.add("reveal-armed");
    io.observe(el);
    // Safety net: never leave content hidden if the observer misfires
    // (headless renderers, print, odd embedding contexts).
    const fallback = window.setTimeout(() => {
      el.classList.add("reveal-in");
      io.disconnect();
    }, 2500);
    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, [delay]);

  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  );
}
