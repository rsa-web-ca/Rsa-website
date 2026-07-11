export const site = {
  name: "R Shivakumar & Associates",
  tagline: "Chartered Accountants",
  since: 1997,
  /** Canonical production origin — used for SEO tags, the sitemap and RSS feed. */
  url: "https://www.rsa-india.in",
  address:
    "40-41, 1st floor, 6th Cross Rd, Kamakya Layout, Phase 3, Banashankari, Bengaluru, Karnataka 560085, India",
  phone: "+91 99009 11994",
  phoneHref: "tel:+919900911994",
  email: "admin@rsa-india.in",
  partnerEmail: "rshivakumarca@rsa-india.in",
  mapsUrl: "https://maps.app.goo.gl/ocviPu21w2xXqpeC8?g_st=ic",
} as const;

/** FormSubmit endpoints — submissions go to admin@ with a copy to the partner email. */
export const formSubmit = {
  endpoint: `https://formsubmit.co/ajax/${site.email}`,
  cc: site.partnerEmail,
} as const;
