const LOGO_COLOR = `${import.meta.env.BASE_URL}images/logo-color.svg`;
const LOGO_WHITE = `${import.meta.env.BASE_URL}images/logo-white.svg`;

/**
 * The firm's wordmark. Uses the official logo artwork:
 * the all-white lockup on dark bands (footer), and the
 * full-colour maroon/slate lockup on light page surfaces.
 *
 * Scale it with a height utility on `className` (e.g. `h-11`); width follows
 * the artwork's 700×180 aspect ratio (the brand-pack "Logo 2" SVGs, cropped to the lockup).
 *
 * `tone="band"` — for dark slate backgrounds.
 * `tone="ink"`  — for light page surfaces.
 * `tone="auto"` — colour lockup in light theme, white lockup in dark theme
 *                 (for surfaces that follow the theme, like the header).
 */
export default function Logo({
  tone = "ink",
  className = "",
}: {
  tone?: "band" | "ink" | "auto";
  className?: string;
}) {
  const alt = "R Shivakumar & Associates, Chartered Accountants";
  if (tone === "auto") {
    return (
      <>
        <img src={LOGO_COLOR} alt={alt} width={700} height={180} className={`w-auto dark:hidden ${className}`} decoding="async" />
        <img src={LOGO_WHITE} alt={alt} width={700} height={180} className={`hidden w-auto dark:block ${className}`} decoding="async" />
      </>
    );
  }
  return (
    <img
      src={tone === "band" ? LOGO_WHITE : LOGO_COLOR}
      alt={alt}
      width={700}
      height={180}
      className={`w-auto ${className}`}
      decoding="async"
    />
  );
}
