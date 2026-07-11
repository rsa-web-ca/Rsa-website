export const site = {
  name: "R Shivakumar & Associates",
  tagline: "Chartered Accountants",
  since: 1997,
  address:
    "40-41, 1st floor, 6th Cross Rd, Kamakya Layout, Phase 3, Banashankari, Bengaluru, Karnataka 560085, India",
  phone: "+91 99009 11994",
  phoneHref: "tel:+919900911994",
  email: "admin@rsa-india.in",
  partnerEmail: "rshivakumarca@rsa-india.in",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(
      "40-41, 1st floor, 6th Cross Rd, Kamakya Layout, Phase 3, Banashankari, Bengaluru, Karnataka 560085",
    ),
} as const;

/** FormSubmit endpoints — submissions go to admin@ with a copy to the partner email. */
export const formSubmit = {
  endpoint: `https://formsubmit.co/ajax/${site.email}`,
  cc: site.partnerEmail,
} as const;
