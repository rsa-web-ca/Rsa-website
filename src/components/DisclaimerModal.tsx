import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "disclaimer-agreed";

/**
 * ICAI-mandated disclaimer shown on first load of each browser session.
 * Chartered Accountants may not solicit work or advertise, so visitors must
 * affirm they reached the site independently before viewing it.
 */
export default function DisclaimerModal() {
  // Re-prompt once per browser session — sessionStorage clears when the tab
  // group closes, so returning visitors re-acknowledge on their next visit.
  const [open, setOpen] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(STORAGE_KEY) !== "true";
  });

  const agreeRef = useRef<HTMLButtonElement>(null);

  // Lock background scroll and move focus to the primary action while open.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    agreeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  function handleAgree() {
    sessionStorage.setItem(STORAGE_KEY, "true");
    setOpen(false);
  }

  function handleDisagree() {
    window.location.href = "https://www.google.com";
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="disclaimer-title"
    >
      <div className="my-8 w-full max-w-2xl rounded-xl border border-line bg-surface p-6 shadow-lift sm:p-8">
        <h2
          id="disclaimer-title"
          className="font-display text-lg font-semibold leading-snug text-ink sm:text-xl"
        >
          As per the provisions of 'The Chartered Accountants Act, 1949', we are
          not permitted to solicit work or advertise. By clicking on the 'I
          agree' below, you acknowledge the following:
        </h2>

        <ul className="mt-5 list-disc space-y-3 pl-5 text-sm text-ink-soft sm:text-base">
          <li>
            This website was created to provide general information about R
            Shivakumar &amp; Associates, Chartered Accountants.
          </li>
          <li>
            By agreeing to view this site, you affirm that you are independently
            seeking information about R Shivakumar &amp; Associates, Chartered
            Accountants.
          </li>
          <li>
            You also agree that we have not advertised or solicited (or otherwise
            influenced) you to use our services.
          </li>
          <li>
            You are solely responsible for accessing the information on this
            website and viewing or downloading materials from it.
          </li>
        </ul>

        <p className="mt-5 text-center text-sm font-medium text-ink sm:text-base">
          We disclaim all responsibility for the information or materials on this
          site.
        </p>

        <p className="mt-4 text-center text-xs text-ink-soft">
          We store your acknowledgement on this device (via cookies/local
          storage) to remember your preference.
        </p>

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={handleDisagree}
            className="rounded-md border border-line px-7 py-3 text-sm font-semibold text-ink transition-colors duration-200 hover:border-accent hover:text-accent"
          >
            I Disagree
          </button>
          <button
            ref={agreeRef}
            type="button"
            onClick={handleAgree}
            className="rounded-md bg-maroon-700 px-7 py-3 text-sm font-semibold text-white shadow-lift transition-all duration-200 hover:bg-maroon-600"
          >
            I Agree
          </button>
        </div>
      </div>
    </div>
  );
}
