import { useEffect, useRef, type FormEvent } from "react";
import PageHeader from "../components/PageHeader";
import Reveal from "../components/Reveal";
import { useFormSubmit } from "../hooks/useFormSubmit";
import { usePageMeta } from "../hooks/usePageMeta";
import {
  Field,
  TextInput,
  TextArea,
  Honeypot,
  SubmitButton,
  SuccessNote,
  ErrorNote,
} from "../components/forms";
import { site } from "../data/site";

export default function Contact() {
  usePageMeta("Contact Us", "Call, write, or visit our office in Banashankari, Bengaluru — we respond promptly.");
  const { status, submit } = useFormSubmit("Contact enquiry — rsa-india.in");
  const successRef = useRef<HTMLDivElement>(null);

  // The form unmounts on success; bring the confirmation into view.
  useEffect(() => {
    if (status === "success") successRef.current?.scrollIntoView({ block: "center" });
  }, [status]);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    void submit(e.currentTarget);
  }

  return (
    <>
      <PageHeader title="Contact Us" lede="Get in touch — we respond promptly." />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <Reveal>
            <div>
              <h2 className="font-display text-2xl font-semibold text-ink">Visit or write to us</h2>
              <div className="mt-8 space-y-8">
                <div className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-surface-raised text-accent">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </span>
                  <div>
                    <h3 className="font-semibold text-ink">Address</h3>
                    <a
                      href={site.mapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 block max-w-sm text-sm leading-relaxed text-ink-soft transition-colors hover:text-accent"
                    >
                      {site.address}
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-surface-raised text-accent">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </span>
                  <div>
                    <h3 className="font-semibold text-ink">Mobile</h3>
                    <a href={site.phoneHref} className="mt-1 block text-sm text-ink-soft transition-colors hover:text-accent">
                      {site.phone}
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-surface-raised text-accent">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </span>
                  <div>
                    <h3 className="font-semibold text-ink">Email</h3>
                    <a
                      href={`mailto:${site.partnerEmail}`}
                      className="mt-1 block text-sm text-ink-soft transition-colors hover:text-accent"
                    >
                      {site.partnerEmail}
                    </a>
                    <a
                      href={`mailto:${site.email}`}
                      className="mt-0.5 block text-sm text-ink-soft transition-colors hover:text-accent"
                    >
                      {site.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="rounded-2xl border border-transparent bg-surface p-6 shadow-lift dark:border-line sm:p-10">
              <h2 className="font-display text-2xl font-semibold text-ink">Get in Touch</h2>
              {status === "success" ? (
                <div ref={successRef} className="mt-8">
                  <SuccessNote message="Thanks for submitting!" />
                </div>
              ) : (
                <form onSubmit={onSubmit} className="mt-8 space-y-6">
                  <Honeypot />
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field label="Name" htmlFor="name" required>
                      <TextInput id="name" name="Name" type="text" required autoComplete="name" />
                    </Field>
                    <Field label="Email" htmlFor="email" required>
                      <TextInput id="email" name="Email" type="email" required autoComplete="email" />
                    </Field>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field label="Phone" htmlFor="phone">
                      <TextInput id="phone" name="Phone" type="tel" autoComplete="tel" />
                    </Field>
                    <Field label="Subject" htmlFor="subject" required>
                      <TextInput id="subject" name="Subject" type="text" required />
                    </Field>
                  </div>
                  <Field label="Message" htmlFor="message" required>
                    <TextArea id="message" name="Message" required />
                  </Field>

                  {status === "error" && <ErrorNote />}

                  <SubmitButton status={status}>Submit</SubmitButton>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
