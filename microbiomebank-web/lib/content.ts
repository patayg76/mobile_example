/**
 * MicrobiomeBank — site content
 * ------------------------------------------------------------------
 * PLACEHOLDER COPY. Replace the strings below with the real text,
 * stats, and links from microbiomebank.com. Everything the site
 * renders is sourced from this single file, so a content swap never
 * requires touching component code.
 */

export const site = {
  name: "MicrobiomeBank",
  tagline: "The world's living library of the microbiome.",
  email: "info@microbiomebank.com",
};

export const nav = [
  { label: "Platform", href: "#platform" },
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Why us", href: "#why" },
  { label: "Contact", href: "#contact" },
];

export const hero = {
  eyebrow: "ISO 20387 ·  Biobanking Excellence",
  titleLead: "Bank, characterize and access the",
  titleGradient: "living microbiome",
  sub: "MicrobiomeBank securely preserves, sequences and distributes microbial strains and samples — so research teams move from discovery to breakthrough without rebuilding the cold chain.",
  ctaPrimary: { label: "Start banking", href: "#contact" },
  ctaSecondary: { label: "Explore the platform", href: "#platform" },
  chips: ["−196 °C cryopreservation", "Whole-genome sequencing", "API-first access"],
};

export const logos = [
  "BioNexus",
  "GenomaLabs",
  "CultureWorks",
  "HelixCore",
  "VivaBiotics",
  "NordHealth",
  "AxialBio",
  "StrataDx",
];

export const stats = [
  { value: 1.2, suffix: "M+", label: "Samples banked", decimals: 1 },
  { value: 48, suffix: "K", label: "Strains characterized", decimals: 0 },
  { value: 600, suffix: "+", label: "Research partners", decimals: 0 },
  { value: 99.99, suffix: "%", label: "Viability on recovery", decimals: 2 },
];

export const services = [
  {
    icon: "vault",
    title: "Sample Banking & Cryopreservation",
    body: "Redundant −196 °C vapor-phase storage with 24/7 monitoring and full chain-of-custody for every aliquot.",
  },
  {
    icon: "microscope",
    title: "Strain Isolation & Characterization",
    body: "Anaerobic culturing, purity QC and phenotyping to turn raw samples into reference-grade, citable strains.",
  },
  {
    icon: "dna",
    title: "Genomic Sequencing & Data",
    body: "Whole-genome and metagenomic sequencing, assembled, annotated and delivered as structured, queryable data.",
  },
  {
    icon: "shield",
    title: "Secure Access & Compliance",
    body: "Consent-aware governance, MTA workflows and audit trails that satisfy IRB, GDPR and HIPAA requirements.",
  },
];

export const process = [
  {
    step: "01",
    title: "Submit",
    body: "Ship samples with our pre-validated kits and cold-chain logistics, or transfer an existing collection.",
  },
  {
    step: "02",
    title: "Preserve",
    body: "We aliquot, barcode and cryopreserve under redundant monitoring within hours of intake.",
  },
  {
    step: "03",
    title: "Characterize",
    body: "Each strain is cultured, QC'd and sequenced, then enriched with phenotype and provenance metadata.",
  },
  {
    step: "04",
    title: "Access",
    body: "Search, request and release material on demand through the portal or programmatically via the API.",
  },
];

export const platform = {
  eyebrow: "The platform",
  title: "A digital twin for your living collection",
  body: "Every physical vial has a real-time record — location, viability, passage history and genomics — so your team can reason about the collection without ever opening a freezer.",
  points: [
    "Real-time inventory across every site and freezer",
    "Genomics, phenotype and provenance on one record",
    "Programmatic access with a documented REST & GraphQL API",
    "Role-based governance with complete audit history",
  ],
};

export const bento = [
  {
    title: "ISO 20387 accredited",
    body: "Independently audited biobanking quality management end to end.",
    icon: "badge",
    span: "md:col-span-2",
  },
  {
    title: "Redundant cold chain",
    body: "Dual-site −196 °C storage with backup power and live telemetry.",
    icon: "snow",
    span: "",
  },
  {
    title: "Global logistics",
    body: "Validated dry-shipper network reaching 60+ countries.",
    icon: "globe",
    span: "",
  },
  {
    title: "API-first by design",
    body: "Automate submission, search and release from your own stack.",
    icon: "code",
    span: "md:col-span-2",
  },
];

export const testimonials = [
  {
    quote:
      "MicrobiomeBank gave us a single source of truth for 12,000 isolates. What used to take a week of freezer archaeology now takes one query.",
    name: "Dr. Lena Hofstadter",
    role: "Director of Microbial Genomics, BioNexus",
  },
  {
    quote:
      "Recovery viability has been flawless across three years of draws. Their chain-of-custody documentation sailed through our audit.",
    name: "Marcus Adeyemi",
    role: "Head of Biobank Operations, HelixCore",
  },
];

export const cta = {
  title: "Ready to future-proof your collection?",
  body: "Talk to our scientific team about onboarding your samples or accessing the bank.",
  primary: { label: "Book a consult", href: "#contact" },
  secondary: { label: "Email us", href: "mailto:info@microbiomebank.com" },
};

export const footer = {
  blurb: "Preserving and mobilizing the microbiome for the next era of life science.",
  columns: [
    {
      title: "Platform",
      links: ["Inventory", "Genomics", "API", "Governance"],
    },
    {
      title: "Services",
      links: ["Banking", "Sequencing", "Characterization", "Logistics"],
    },
    {
      title: "Company",
      links: ["About", "Careers", "Press", "Contact"],
    },
  ],
};
