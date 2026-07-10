import { useState } from "react";
import { formSubmit } from "../data/site";

export type SubmitStatus = "idle" | "submitting" | "success" | "error";

/**
 * Submits a form to FormSubmit's AJAX endpoint (no redirect), CC-ing the
 * partner address. Includes a honeypot check: if the hidden `_honey` field
 * is filled, the submission is silently dropped.
 */
export function useFormSubmit(subject: string) {
  const [status, setStatus] = useState<SubmitStatus>("idle");

  async function submit(form: HTMLFormElement): Promise<void> {
    const data = new FormData(form);

    if (data.get("_honey")) {
      // Bot filled the honeypot — pretend success without sending.
      setStatus("success");
      return;
    }
    data.delete("_honey");

    const payload: Record<string, string> = {
      _subject: subject,
      _cc: formSubmit.cc,
      _template: "table",
      _captcha: "false",
    };
    data.forEach((value, key) => {
      payload[key] = String(value);
    });

    setStatus("submitting");
    try {
      const res = await fetch(formSubmit.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`FormSubmit responded ${res.status}`);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return { status, submit };
}
