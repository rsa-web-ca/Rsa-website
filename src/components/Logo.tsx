/**
 * The firm's wordmark, rendered as a vector-crisp typographic lockup that
 * mirrors the printed logo: "R Shivakumar" in maroon, "& Associates" flanked
 * by rules in slate, and a tracked "Chartered Accountants" line beneath.
 *
 * Built from live type (not a raster) so it stays sharp at any size and
 * recolours for light surfaces vs. dark bands. Scale it by setting a font
 * size on the element via `className` (e.g. `text-xl`); the internal parts
 * are sized in `em` and follow along.
 *
 * `tone="band"` — for dark slate backgrounds (header, footer, hero).
 * `tone="ink"`  — for light page surfaces.
 */
export default function Logo({
  tone = "ink",
  className = "",
}: {
  tone?: "band" | "ink";
  className?: string;
}) {
  const primary = tone === "band" ? "text-maroon-400" : "text-accent";
  const secondary = tone === "band" ? "text-white/70" : "text-ink-soft";
  const ruleColor = tone === "band" ? "bg-white/30" : "bg-line";

  return (
    <span
      className={`inline-flex flex-col items-center leading-none ${className}`}
      aria-label="R Shivakumar & Associates, Chartered Accountants"
      role="img"
    >
      <span
        className={`font-display font-semibold tracking-[0.01em] ${primary}`}
        style={{ fontSize: "1em" }}
      >
        R S<span className="text-[0.82em]">HIVAKUMAR</span>
      </span>
      <span className="mt-[0.18em] flex w-full items-center justify-center gap-[0.5em]">
        <span className={`h-px flex-1 ${ruleColor}`} aria-hidden="true" />
        <span
          className={`font-display font-medium uppercase tracking-[0.08em] ${secondary}`}
          style={{ fontSize: "0.52em" }}
        >
          &amp; Associates
        </span>
        <span className={`h-px flex-1 ${ruleColor}`} aria-hidden="true" />
      </span>
      <span
        className={`mt-[0.28em] font-sans font-semibold uppercase tracking-[0.32em] ${primary}`}
        style={{ fontSize: "0.32em" }}
      >
        Chartered Accountants
      </span>
    </span>
  );
}
