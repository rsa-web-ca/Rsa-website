/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** CRM origin serving published website content; defaults to https://crm.rsa-india.in. */
  readonly VITE_CMS_URL?: string;
  readonly VITE_PUBLIC_POSTHOG_KEY?: string;
  readonly VITE_PUBLIC_POSTHOG_HOST?: string;
  readonly VITE_PUBLIC_POSTHOG_ENABLED?: string;
}
