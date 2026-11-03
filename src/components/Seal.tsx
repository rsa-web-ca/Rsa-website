import { useId } from "react";

/**
 * The firm's round office seal, drawn as an ink impression. Indian CA firms
 * stamp every signed document with one, so it is the site's signature detail:
 * used on the letterhead in the hero and small in the footer, nowhere else.
 * Colour comes from `currentColor`, so callers set the ink with a text class.
 */
export default function Seal({ className = "" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true" fill="none" stroke="currentColor">
      <defs>
        <path id={`${id}-top`} d="M 17 60 A 43 43 0 0 1 103 60" />
        <path id={`${id}-bottom`} d="M 23 60 A 37 37 0 0 0 97 60" />
      </defs>
      <circle cx="60" cy="60" r="56" strokeWidth="2.2" />
      <circle cx="60" cy="60" r="50" strokeWidth="0.9" />
      <circle cx="60" cy="60" r="32" strokeWidth="0.9" />
      <g fill="currentColor" stroke="none" fontFamily="var(--font-sans)" fontWeight="600">
        <text fontSize="7.2" letterSpacing="0.45">
          <textPath href={`#${id}-top`} startOffset="50%" textAnchor="middle">R SHIVAKUMAR &amp; ASSOCIATES</textPath>
        </text>
        <text fontSize="6.6" letterSpacing="0.9">
          <textPath href={`#${id}-bottom`} startOffset="50%" textAnchor="middle" dominantBaseline="hanging">CHARTERED ACCOUNTANTS</textPath>
        </text>
        <text x="60" y="59" fontSize="7" textAnchor="middle" letterSpacing="0.4">BENGALURU</text>
        <text x="60" y="69" fontSize="5.6" textAnchor="middle" letterSpacing="0.6" fontWeight="500">EST. 1997</text>
        <circle cx="16.5" cy="60" r="1.6" />
        <circle cx="103.5" cy="60" r="1.6" />
      </g>
    </svg>
  );
}
