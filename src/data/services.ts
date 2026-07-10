export interface Service {
  slug: string;
  title: string;
  /** One-line summary used on cards and the services index. */
  summary: string;
  /** Introductory paragraphs, verbatim from the original site. */
  intro: string[];
  /** Heading shown above the offerings list, when the page has one. */
  listHeading?: string;
  /** Specific offerings under this service. */
  offerings: string[];
  /** Closing paragraphs shown after the list. */
  outro: string[];
}

export const services: Service[] = [
  {
    slug: "audit-assurance",
    title: "Audit & Assurance",
    summary:
      "Statutory, internal and special audits performed to the Standards on Auditing issued by ICAI.",
    intro: [
      "Auditing is a sophisticated process, and the value of auditors as a crucial link in the financial reporting process has grown significantly in recent years.",
      "As per Standard of Audit 200 issued by ICAI, the objectives of an auditor are to obtain reasonable assurance about whether the financial statements as a whole are free from material misstatement, and to report on the financial statements in accordance with the Standards on Auditing.",
    ],
    listHeading: "We provide the following audit services",
    offerings: [
      "Audit under The Companies Act, 2013",
      "Audit under The Income Tax Act, 1961",
      "Internal & Concurrent Audits",
      "Agreed Upon Procedures",
      "Management Audit",
      "Special Audits",
      "Bank & Government Audits",
    ],
    outro: ["For any further details, kindly contact us."],
  },
  {
    slug: "income-tax-related-services",
    title: "Income Tax Related Services",
    summary:
      "Tailored solutions for filings, advisory, litigation and transfer pricing under the Income Tax Act.",
    intro: [
      "Managing complex tax concerns and reacting to continuing tax reforms and changes can consume a lot of resources, time, and money. For our clients' business needs, we provide tailored solutions.",
    ],
    listHeading: "Our income tax services include",
    offerings: [
      "Filing of Income Tax returns",
      "Tax Advisory",
      "Corporate Income Tax",
      "Tax Litigation – Assessments, Commissioner Appeals, Income Tax Tribunal, assessment of Search Cases",
      "Transfer Pricing Study & Litigation",
      "Tax Optimisation",
      "E TDS Filing",
      "Tax Residency Certificate",
      "Certifications under Income Tax Act",
    ],
    outro: ["For any further details, kindly contact us."],
  },
  {
    slug: "indirect-tax-services",
    title: "Indirect Tax Services",
    summary:
      "GST consultancy — returns, refunds, advisory and representation before the department.",
    intro: [
      "We offer GST-related consultancy services. Though the introduction of GST merged several tax laws into one, revisions and changes have been made on a regular basis to solve many of the hardships that have developed as a result of GST's implementation.",
    ],
    listHeading: "Our indirect tax services include",
    offerings: [
      "Representation before GST department. Appeal at Tribunals.",
      "Preparation and filing of Returns.",
      "Advise on GST Matters.",
      "Updation on changes in law.",
      "Filing for GST refund.",
    ],
    outro: ["For any further details, kindly contact us."],
  },
  {
    slug: "documentation-reporting",
    title: "Documentation & Reporting",
    summary:
      "Book keeping, payroll, and drafting — so the accounting complexities stay ours, not yours.",
    intro: [
      "We stay up-to-date on all the regulatory and legislative developments so you don't waste time and energy trying to make sense of all the accounting complexities.",
    ],
    listHeading: "We assist with",
    offerings: [
      "Book Keeping & Accounting",
      "Fixed Asset Register",
      "Special Accounting",
      "Payroll Maintenance",
      "Drafting Wills",
      "Drafting Contracts & Agreements",
    ],
    outro: ["For any further details, kindly contact us."],
  },
  {
    slug: "nri-services",
    title: "NRI Services",
    summary:
      "Returns, lower-deduction applications and tax planning for Non Resident Indians.",
    intro: [
      "We have been providing Non Resident Indian (NRI) services for many years. Based on our experience, Non Resident Indians frequently require the following services, particularly tax concerns relating to property sales.",
    ],
    listHeading: "Services for NRI clients",
    offerings: [
      "Filing of Return of Income",
      "Application for lower tax deduction",
      "TDS & Tax planning for sale of Capital Assets",
    ],
    outro: ["For any further details, kindly contact us."],
  },
  {
    slug: "due-diligence",
    title: "Due Diligence",
    summary:
      "Financial due diligence that gives decision makers accurate information on costs, benefits and risks.",
    intro: [
      "Due diligence is the process of performing an audit or inquiry into an entity's operations before a purchase, public listing, restructuring, refinancing, disposal, or other comparable transaction.",
      "This analytical approach helps decision makers make better decisions by providing them with accurate information about costs, benefits, and risks.",
      "Our aim in performing Financial Due Diligence assignments has been to assist with valuations while also providing reliable support for the client to form an opinion on the transaction.",
    ],
    offerings: [],
    outro: ["For any further details, kindly contact us."],
  },
  {
    slug: "virtual-cfo",
    title: "Virtual CFO",
    summary:
      "An affordable interim, part-time or virtual CFO so you can concentrate on running the business.",
    intro: [
      "Maintaining a CFO service and engaging an affordable interim CFO, part-time CFO, or virtual CFO — we will relieve you of financial burden, allowing you to concentrate on running and expanding your business.",
    ],
    listHeading: "We can handle",
    offerings: [
      "Statutory requirements",
      "Monitoring internal business controls",
      "Sensitivity analysis, budgeting, and forecasting",
      "Management of costs and profit maximisation",
      "Business Strategy Planning",
      "Improvement of Business Processes",
    ],
    outro: ["For any further details, kindly contact us."],
  },
  {
    slug: "registration-under-various-laws",
    title: "Registration under Various Laws",
    summary:
      "From incorporation to GST, MSME, EPF and beyond — registrations handled end to end.",
    intro: [
      "The first step in starting a business in India is to incorporate the company or firm. After the entity is formed, it must register under several statutes such as GST, Shops and Establishments, Profession Tax, and so on.",
      "We provide assistance in registrations such as:",
    ],
    offerings: [
      "GST Registration",
      "Company Formation",
      "LLP Formation",
      "Sole Proprietor & HUF formation",
      "Shops & Establishments Act Registration",
      "MSME Registration",
      "Employee State Insurance",
      "Employee Provident Fund",
      "Professional Tax",
      "STPI & Non STPI Registration",
      "Trade Licence",
      "Import Export Code",
      "Factories Act Registration",
      "Start Up Registration",
    ],
    outro: ["For any further details, kindly contact us."],
  },
  {
    slug: "transaction-advisory-services",
    title: "Transaction Advisory Services",
    summary:
      "End-to-end transaction support with independence, objectivity and confidentiality.",
    intro: [
      "With the goal of increasing enterprise value, we provide useful insights on structural and strategic possibilities.",
      "The supply of such services is made easier by our significant experience with numerous corporations and industries. We preserve independence, objectivity, and secrecy while being focused and relationship-driven.",
      "We can assist you in handling all aspects of your transactions from beginning to end, acting as your business's support system and meeting expansion requirements.",
    ],
    offerings: [],
    outro: [],
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
