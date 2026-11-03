import { useEffect, useRef } from "react";
import { process } from "../data/home";

/**
 * Engagement steps. On large screens the section pins and the steps travel
 * sideways as the page scrolls; on small screens or with reduced motion it is
 * a plain vertical list, so the content never depends on the effect.
 */
export default function HowWeWork() {
  const outer = useRef<HTMLElement>(null);
  const track = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const o = outer.current;
    const t = track.current;
    if (!o || !t) return;
    const wide = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    let raf = 0;
    const update = () => {
      if (!wide.matches) {
        t.style.transform = "";
        return;
      }
      const rect = o.getBoundingClientRect();
      const total = o.offsetHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, -rect.top / Math.max(1, total)));
      const distance = t.scrollWidth - t.parentElement!.clientWidth;
      t.style.transform = `translate3d(${-p * distance}px,0,0)`;
      o.style.setProperty("--progress", String(p));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    wide.addEventListener("change", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      wide.removeEventListener("change", onScroll);
    };
  }, []);

  return (
    <section ref={outer} className="how-we-work relative bg-bg lg:h-[260vh]" aria-labelledby="how-title">
      <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:overflow-hidden">
        <div className="mx-auto w-full max-w-7xl px-4 pt-24 sm:px-6 lg:px-8 lg:pt-16">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-sm font-semibold text-accent">How we work</p>
              <h2 id="how-title" className="mt-4 max-w-2xl font-display text-4xl font-medium leading-[1.05] text-ink sm:text-6xl">
                From first call to final filing
              </h2>
            </div>
            <div className="hidden h-1 w-56 overflow-hidden rounded-full bg-line lg:block" aria-hidden="true">
              <div className="h-full origin-left bg-maroon-700" style={{ transform: "scaleX(var(--progress, 0))" }} />
            </div>
          </div>
        </div>
        <div className="mx-auto mt-12 w-full max-w-7xl px-4 pb-24 sm:px-6 lg:overflow-visible lg:px-8 lg:pb-0">
          <ol ref={track} className="grid gap-4 will-change-transform lg:flex lg:w-max lg:gap-6">
            {process.map((s, i) => (
              <li
                key={s.title}
                className="group relative flex flex-col rounded-2xl border border-line bg-surface p-7 lg:h-[380px] lg:w-[400px] lg:p-10"
              >
                <span className="font-display text-6xl leading-none text-accent/25 transition-colors duration-300 group-hover:text-accent lg:text-8xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="mt-6 lg:mt-auto">
                  <h3 className="font-display text-2xl font-medium text-ink lg:text-3xl">{s.title}</h3>
                  <p className="mt-3 leading-relaxed text-ink-soft lg:min-h-[104px]">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
