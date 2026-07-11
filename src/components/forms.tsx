import type { ReactNode, SelectHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import type { SubmitStatus } from "../hooks/useFormSubmit";
import { site } from "../data/site";

const fieldClass =
  "w-full rounded-md border border-line bg-surface px-3.5 py-2.5 text-base text-ink shadow-sm " +
  "placeholder:text-ink-soft/90 transition-colors duration-200 " +
  "focus:border-maroon-600 focus:outline-none focus:ring-2 focus:ring-maroon-600/30";

export function Field({ label, htmlFor, required, children }: {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
        {required && (
          <span className="ml-0.5 text-accent" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={fieldClass} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${fieldClass} min-h-32 resize-y`} />;
}

export function Select({ children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <select {...props} className={`${fieldClass} cursor-pointer`}>
      {children}
    </select>
  );
}

/** Hidden honeypot field — bots fill it, humans never see it. */
export function Honeypot() {
  return (
    <div className="hidden" aria-hidden="true">
      <label>
        Leave this field empty
        <input type="text" name="_honey" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

export function SubmitButton({ status, children }: { status: SubmitStatus; children: ReactNode }) {
  const submitting = status === "submitting";
  return (
    <button
      type="submit"
      disabled={submitting}
      className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-maroon-700 px-8 py-3 text-sm font-semibold text-white shadow-lift transition-all duration-200 hover:bg-maroon-600 disabled:cursor-wait disabled:opacity-60"
    >
      {submitting && (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
        </svg>
      )}
      {submitting ? "Submitting…" : children}
    </button>
  );
}

export function SuccessNote({ message }: { message: string }) {
  return (
    <div
      role="status"
      className="flex items-start gap-3 rounded-xl border border-maroon-600/40 bg-maroon-50 p-5 text-maroon-900 dark:bg-maroon-700/15 dark:text-maroon-100"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <path d="m9 11 3 3L22 4" />
      </svg>
      <p className="font-medium">{message}</p>
    </div>
  );
}

export function ErrorNote() {
  return (
    <p role="alert" className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300">
      Something went wrong while submitting. Please try again, or email us directly at{" "}
      <a href={`mailto:${site.email}`} className="font-semibold underline underline-offset-2">
        {site.email}
      </a>
      .
    </p>
  );
}
