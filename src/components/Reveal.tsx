import { useEffect, useRef, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Delay in ms before the reveal starts once visible (keep small stagger steps, ≤ 60ms). */
  delay?: number;
  as?: "div" | "section" | "li";
}

/**
 * Progressive-enhancement scroll reveal: a short fade and 12px rise as a block
 * enters the viewport. Content is fully visible without JS or with reduced
 * motion; the hide class is only added right before the observer can un-hide it.
 */
export default function Reveal({ children, className = "", delay = 0, as: Tag = "div" }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer = window.setTimeout(() => el.classList.add("reveal-in"), delay);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
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
      window.clearTimeout(timer);
      window.clearTimeout(fallback);
    };
  }, [delay]);

  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  );
}
