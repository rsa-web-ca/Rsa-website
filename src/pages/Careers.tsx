import type { FormEvent } from "react";
import PageHeader from "../components/PageHeader";
import Reveal from "../components/Reveal";
import { useFormSubmit } from "../hooks/useFormSubmit";
import {
  Field,
  TextInput,
  TextArea,
  Select,
  Honeypot,
  SubmitButton,
  SuccessNote,
  ErrorNote,
} from "../components/forms";
import { positions, genders, caCourseStatuses, attemptOptions } from "../data/careers";

export default function Careers() {
  const { status, submit } = useFormSubmit("Careers application — rsa-india.in");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    void submit(e.currentTarget);
  }

  return (
    <>
      <PageHeader
        title="Work with Us"
        lede="We have positions open for Article Trainees, Audit Assistants & Audit Managers."
      />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-semibold text-ink">Join the Team</h2>
        <p className="mt-3 text-ink-soft">
          Tell us about yourself and the position you are applying for — we review every
          application personally.
        </p>

        {status === "success" ? (
          <div className="mt-10">
            <SuccessNote message="Thanks for applying! We'll be in touch soon." />
          </div>
        ) : (
          <Reveal>
            <form onSubmit={onSubmit} className="mt-10 space-y-6" noValidate={false}>
              <Honeypot />
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Full Name" htmlFor="fullName" required>
                  <TextInput
                    id="fullName"
                    name="Full Name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Please enter your full name"
                  />
                </Field>
                <Field label="Email" htmlFor="email" required>
                  <TextInput
                    id="email"
                    name="Email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="Please enter your email"
                  />
                </Field>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Phone" htmlFor="phone" required>
                  <TextInput
                    id="phone"
                    name="Phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    placeholder="Please enter your mobile number"
                  />
                </Field>
                <Field label="Position" htmlFor="position" required>
                  <Select id="position" name="Position" required defaultValue="">
                    <option value="" disabled>
                      I'm applying for
                    </option>
                    {positions.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Gender" htmlFor="gender" required>
                  <Select id="gender" name="Gender" required defaultValue="">
                    <option value="" disabled>
                      Please Select Gender
                    </option>
                    {genders.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="CA Course Completion status" htmlFor="caStatus" required>
                  <Select id="caStatus" name="CA Course Completion status" required defaultValue="">
                    <option value="" disabled>
                      Please choose an option
                    </option>
                    {caCourseStatuses.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="CA Intermediate G1 (attempts)" htmlFor="g1">
                  <Select id="g1" name="CA Intermediate G1" defaultValue="">
                    <option value="" disabled>
                      Choose an option
                    </option>
                    {attemptOptions.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="CA Intermediate G2 (attempts)" htmlFor="g2">
                  <Select id="g2" name="CA Intermediate G2" defaultValue="">
                    <option value="" disabled>
                      Choose an option
                    </option>
                    {attemptOptions.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>

              <Field label="Work Exposure" htmlFor="workExposure" required>
                <TextArea
                  id="workExposure"
                  name="Work Exposure"
                  required
                  placeholder="Please share your work exposure, freshers may enter N/A"
                />
              </Field>

              {status === "error" && <ErrorNote />}

              <SubmitButton status={status}>Submit Application</SubmitButton>
            </form>
          </Reveal>
        )}
      </section>
    </>
  );
}
