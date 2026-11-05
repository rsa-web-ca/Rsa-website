import { useEffect, useRef, useState } from "react";

export type FilmName = "hero-ledger" | "services" | "industries" | "about" | "careers" | "contact" | "compliance";

const BASE = `${import.meta.env.BASE_URL}media/`;

/**
 * A silent background loop rendered with HyperFrames (sources under video/).
 * Decorative, so hidden from assistive tech, but it moves for more than five
 * seconds: it gets a visible pause control (WCAG 2.2.2) and never autoplays
 * under reduced motion, where the poster frame stands in.
 */
export default function LoopFilm({
  name,
  className = "",
  controlClassName = "bottom-4 right-4",
}: {
  name: FilmName;
  className?: string;
  controlClassName?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const src = name === "hero-ledger" ? `${BASE}hero-ledger` : `${BASE}films/${name}`;

  useEffect(() => {
    const v = ref.current;
    if (!v || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    v.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, [name]);

  function toggle() {
    const v = ref.current;
    if (!v) return;
    if (v.paused) void v.play().then(() => setPlaying(true));
    else {
      v.pause();
      setPlaying(false);
    }
  }

  return (
    <>
      <video
        ref={ref}
        key={name}
        className={`absolute inset-0 -z-10 h-full w-full object-cover ${className}`}
        poster={`${src}.jpg`}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src={`${src}.webm`} type="video/webm" />
        <source src={`${src}.mp4`} type="video/mp4" />
      </video>
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause background film" : "Play background film"}
        className={`absolute z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-black/20 text-white/80 backdrop-blur-sm transition-colors hover:border-white/60 hover:text-white ${controlClassName}`}
      >
        {playing ? (
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true"><path d="M5.75 3a.75.75 0 0 0-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75V3.75A.75.75 0 0 0 7.25 3h-1.5ZM12.75 3a.75.75 0 0 0-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75V3.75a.75.75 0 0 0-.75-.75h-1.5Z" /></svg>
        ) : (
          <svg viewBox="0 0 20 20" fill="currentColor" className="ml-0.5 h-4 w-4" aria-hidden="true"><path d="M6.3 2.84A1.5 1.5 0 0 0 4 4.11v11.78a1.5 1.5 0 0 0 2.3 1.27l9.344-5.891a1.5 1.5 0 0 0 0-2.538L6.3 2.841Z" /></svg>
        )}
      </button>
    </>
  );
}
