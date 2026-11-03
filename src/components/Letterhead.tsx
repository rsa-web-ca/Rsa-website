import { services } from "../data/services";
import { site } from "../data/site";

const LOGO = `${import.meta.env.BASE_URL}images/logo-color.svg`;

/**
 * The home page's one rich moment: a sheet of the firm's own letterhead,
 * set in code from the brand pack's layout (logo left, particulars right,
 * address rule at the foot) with the service schedule typed on it and the
 * firm's sign-off block. It stays paper-coloured in
 * both themes, because it depicts a physical sheet, not page chrome.
 */
export default function Letterhead({ className = "" }: { className?: string }) {
  return (
    <figure
      className={`letterhead relative bg-[#fbf8f1] text-[#1f2633] shadow-[0_1px_2px_rgb(10_14_25/0.25),0_24px_48px_-12px_rgb(10_14_25/0.55)] ${className}`}
      aria-label="The firm's letterhead listing its nine services"
    >
      <div className="px-6 pb-6 pt-6 sm:px-9 sm:pt-8">
        <div className="flex items-start justify-between gap-6">
          <img src={LOGO} alt="" width={700} height={180} className="h-9 w-auto sm:h-11" />
          <p className="hidden max-w-[13rem] text-right text-[11px] leading-4 text-[#4a5262] sm:block">
            {site.address}
            <br />
            Ph. {site.phone}
          </p>
        </div>
        <div className="mt-5 h-px bg-[#708090]/60" />

        <p className="mt-6 text-[13px] text-[#4a5262]">Bengaluru</p>
        <p className="mt-4 font-display text-lg text-[#1f2633] sm:text-xl">Schedule of services</p>

        <ol className="mt-3 text-[13px] leading-5 sm:text-sm">
          {services.map((s, i) => (
            <li key={s.slug} className={`flex items-baseline gap-3 border-b border-dotted border-[#708090]/45 py-1.5 ${i > 5 ? "hidden sm:flex" : ""}`}>
              <span className="w-5 shrink-0 tabular-nums text-[#708090]">{i + 1}.</span>
              <span>{s.title}</span>
            </li>
          ))}
          <li className="py-1.5 text-[#4a5262] sm:hidden">and {services.length - 6} more</li>
        </ol>

        <div className="mt-8 text-[13px] leading-5">
          <p className="text-[#4a5262]">For</p>
          <p className="font-medium">{site.name}</p>
          <p className="text-[#4a5262]">{site.tagline}</p>
        </div>
      </div>
      <div className="h-1.5 bg-[#800020]" />
    </figure>
  );
}
