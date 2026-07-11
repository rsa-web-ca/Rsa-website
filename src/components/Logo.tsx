const LOGO_COLOR = `${import.meta.env.BASE_URL}images/logo-color.png`;
const LOGO_WHITE = `${import.meta.env.BASE_URL}images/logo-white.png`;

/**
 * The firm's wordmark. Uses the official logo artwork:
 * the all-white lockup on dark bands (header, footer, hero), and the
 * full-colour maroon/slate lockup on light page surfaces.
 *
 * Scale it with a height utility on `className` (e.g. `h-11`); width follows
 * the intrinsic 2997×801 aspect ratio.
 *
 * `tone="band"` — for dark slate backgrounds.
 * `tone="ink"`  — for light page surfaces.
 */
export default function Logo({
  tone = "ink",
  className = "",
}: {
  tone?: "band" | "ink";
  className?: string;
}) {
  return (
    <img
      src={tone === "band" ? LOGO_WHITE : LOGO_COLOR}
      alt="R Shivakumar & Associates, Chartered Accountants"
      width={2997}
      height={801}
      className={`w-auto ${className}`}
      decoding="async"
    />
  );
}
