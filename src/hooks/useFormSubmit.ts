import { useState } from "react";
import { formSubmit } from "../data/site";

export type SubmitStatus = "idle" | "submitting" | "success" | "error";

const SUBMIT_TIMEOUT_MS = 20_000;

/** FormSubmit's AJAX answer says `success: "true"` (a string) when it took the submission. */
export function accepted(body: { success?: unknown } | null): boolean {
  return body?.success === true || body?.success === "true";
}

/**
 * Submits a form to FormSubmit's AJAX endpoint (no redirect), CC-ing the
 * partner address. Includes a honeypot check: if the hidden `_honey` field
 * is filled, the submission is silently dropped.
 *
 * On failure the form stays on screen with what was typed (the inputs are
 * uncontrolled and are not reset), so pressing Submit again retries.
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
    // A hung request must not leave the button spinning for ever: after this
    // long the person is told it failed, keeps what they typed, and can retry.
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), SUBMIT_TIMEOUT_MS);
    try {
      const res = await fetch(formSubmit.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`FormSubmit responded ${res.status}`);
      // FormSubmit can answer 200 and still refuse the submission
      // ({"success": "false", "message": ...}). Only its own yes counts:
      // thanking someone for an enquiry that was never delivered loses it.
      const body = (await res.json().catch(() => null)) as { success?: unknown } | null;
      if (!accepted(body)) throw new Error("FormSubmit did not accept the submission");
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      clearTimeout(timer);
    }
  }

  return { status, submit };
}
