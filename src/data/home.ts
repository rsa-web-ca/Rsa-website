import { site } from "./site";

/**
 * Home page copy that is not on any other page.
 * DRAFT for partner approval: these restate facts already on the site
 * (services, portal, careers, address) and make no new claims.
 */
export const process = [
  { title: "Enquiry", body: "Tell us what you need by phone, email or the enquiry form." },
  { title: "Understanding", body: "We meet to understand your business, the records involved and the deadlines that apply to you." },
  { title: "Engagement letter", body: "Scope, timelines and fees are agreed in writing before any work begins." },
  { title: "Execution", body: "The work is carried out to the applicable standards, with updates on progress as it moves." },
  { title: "Reporting & filing", body: "Reports, returns and filings are completed and shared with you, with the reasoning explained." },
  { title: "Ongoing support", body: "Clients track engagements and share documents through the client portal, and the calendar keeps the next deadline in view." },
];

export const faqs = [
  {
    q: "What services does the firm offer?",
    a: "Nine service lines: audit & assurance, income tax, indirect tax (GST), documentation & reporting, NRI services, due diligence, virtual CFO, registrations under various laws, and transaction advisory.",
  },
  {
    q: "Do you work with Non Resident Indians?",
    a: "Yes. Our NRI services cover returns, lower-deduction applications and tax planning for Non Resident Indians.",
  },
  {
    q: "How do I engage the firm?",
    a: `Call ${site.phone}, write to ${site.email}, or use the enquiry form. Once we understand what you need, the scope and fees are set out in an engagement letter.`,
  },
  {
    q: "How do existing clients share documents?",
    a: "Through the client portal, where engagements can be tracked and documents shared securely.",
  },
  {
    q: "Are the dates in the compliance calendar final?",
    a: "They follow the statutory rules and are updated when CBDT, CBIC or MCA notify an extension. They are general information, not advice; your own dates may differ.",
  },
  {
    q: "Where is the office?",
    a: site.address,
  },
];
