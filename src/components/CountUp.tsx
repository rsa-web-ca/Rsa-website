import { useEffect, useRef, useState } from "react";

/**
 * A figure that counts up from zero once, when it scrolls into view. The
 * final value is rendered from the start (and kept for screen readers and
 * reduced motion), so nothing reads as "0" if the animation never runs.
 */
export default function CountUp({ value, suffix = "", from = 0 }: { value: number; suffix?: string; from?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const dur = 1400;
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - t, 4);
          setShown(Math.round(from + (value - from) * eased));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        setShown(from);
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, from]);

  return (
    <span ref={ref}>
      <span aria-hidden="true" className="tabular-nums">
        {shown}
        {suffix}
      </span>
      <span className="sr-only">
        {value}
        {suffix}
      </span>
    </span>
  );
}
