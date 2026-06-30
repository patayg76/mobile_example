/**
 * MicroBiome Bank — site content (HU)
 * ------------------------------------------------------------------
 * Real copy sourced from microbiomebank.com (hu). Everything the site
 * renders comes from this single file — a content swap never requires
 * touching component code.
 */

export const site = {
  name: "MicroBiome Bank",
  tagline: "Egészség átültetése",
  email: "info@microbiomebank.com",
  phone: "+36 30 013 5000",
};

export const nav = [
  { label: "Kapszulák", href: "#services" },
  { label: "Folyamat", href: "#process" },
  { label: "Háttér", href: "#platform" },
  { label: "Miért mi", href: "#why" },
  { label: "Kapcsolat", href: "#contact" },
];

export const hero = {
  eyebrow: "Mikrobióta Transzfer Terápia · MTT",
  titleLead: "Egészséges bélflóra,",
  titleGradient: "orvosi felügyelettel",
  sub: "Kivizsgált donoroktól származó, kapszulás humán baktérium-mátrix a bélflóra egyensúlyának helyreállítására — biztonságosan, otthon vagy kórházban.",
  ctaPrimary: { label: "Alkalmazási területek", href: "#services" },
  ctaSecondary: { label: "Kapszuláink", href: "#services" },
  chips: ["Kivizsgált donorok", "Liofilizált kapszula", "Orvosi felügyelet"],
};

// Application areas (no partner logos on the brand site — repurposed marquee)
export const logos = [
  "C. difficile fertőzés",
  "IBS / IBD",
  "Diszbiózis",
  "Parkinson-kór",
  "Autizmus / ADHD",
  "Elhízás / cukorbetegség",
  "Longevity",
  "Sportteljesítmény",
];

export const stats = [
  { value: 10, suffix: "+", label: "év tudományos kutatás", decimals: 0 },
  { value: 6, suffix: "", label: "MTT kapszula-szolgáltatás", decimals: 0 },
  { value: 72, suffix: " óra", label: "európai kiszállítás", decimals: 0 },
  { value: 25, suffix: " év", label: "tárolás −15 °C-on", decimals: 0 },
];

export const services = [
  {
    icon: "shield",
    title: "DiffBiome",
    body: "Visszatérő, antibiotikum-rezisztens Clostridioides difficile fertőzés otthoni kezeléséhez. (30 kapszula)",
  },
  {
    icon: "vault",
    title: "HospBiome",
    body: "Súlyos, C. difficile okozta bakteriális fertőzés kórházi kezelése céljából. (5 kapszula)",
  },
  {
    icon: "dna",
    title: "TransferBiome",
    body: "Krónikus gyulladásos bélbetegségek és diszbiózishoz köthető állapotok kezeléséhez. (60 kapszula)",
  },
  {
    icon: "microscope",
    title: "FindBiome",
    body: "Donor–recipiens kompatibilitás tesztelése a leghatékonyabb sarzs kiválasztásához. (4×15 kapszula)",
  },
  {
    icon: "snow",
    title: "AutoBiome",
    body: "Saját mikrobióta tárolása későbbi felhasználásra — −15 °C-on akár 25 évig. (min. 600 kapszula)",
  },
  {
    icon: "spark",
    title: "UltraBiome",
    body: "Ultrasportolóktól származó humán mikrobióta a fizikai teljesítmény és állóképesség növelésére. (30 kapszula)",
  },
];

export const process = [
  {
    step: "01",
    title: "Konzultáció",
    body: "A kezelőorvos felméri az állapotot és kiválasztja a megfelelő MTT-protokollt — a besorolást mindig orvos végzi.",
  },
  {
    step: "02",
    title: "Donor-szűrés",
    body: "Többlépcsős, a lappangási idővel is számoló szűrési protokoll garantálja a páciensek maximális biztonságát.",
  },
  {
    step: "03",
    title: "Kapszula",
    body: "Liofilizált, sarzsonként egyedi humán mikrobióta-mátrix, betegazonosítóhoz rendelt készletből.",
  },
  {
    step: "04",
    title: "Kúra és követés",
    body: "Otthoni vagy kórházi kúra orvosi felügyelettel, a kezelés céljához és tartamához igazítva.",
  },
];

export const platform = {
  eyebrow: "A háttér",
  title: "Kutatás, tapasztalat és tudás minden kapszulában",
  body: "2016 óta kutatjuk és finomítjuk a mikrobióta-transzfer módszertanát. Európában egyedüliként biztosítunk liofilizált humán mikrobiótát klinikai kísérletekhez és sportegészségügyi kutatásokhoz.",
  points: [
    "Európában egyedülálló liofilizált humán mikrobióta",
    "72 órán belüli kiszállítás európai intézményekbe",
    "Dynamap-alapú humán és állati mikrobióma-meghatározás",
    "Szigorú, többlépcsős donor-szűrési protokoll",
  ],
};

export const bento = [
  {
    title: "Biztonság mindenek felett",
    body: "A számunkra előírtnál szigorúbb, a lappangási idővel is számoló, többlépcsős donor-szűrés.",
    icon: "shield",
    span: "md:col-span-2",
  },
  {
    title: "Liofilizált stabilitás",
    body: "Sarzsonként egyedi készítmény, −15 °C-on akár 25 évig stabilan tárolható.",
    icon: "snow",
    span: "",
  },
  {
    title: "Európai lefedettség",
    body: "72 órán belül bármely európai egészségügyi intézménybe eljuttatjuk.",
    icon: "globe",
    span: "",
  },
  {
    title: "Dynamap mikrobióma-meghatározás",
    body: "Humán és állati mikrobióma-profil korszerű, Dynamap-technológián alapuló módszerrel.",
    icon: "code",
    span: "md:col-span-2",
  },
];

export const testimonials = [
  {
    quote:
      "Laborvezetőként feladatom a legújabb mikrobiológiai technológiák biztonságos bevezetése, hogy az általunk ellátott intézmények a legmagasabb minőségű és legbiztonságosabb szolgáltatást nyújthassák.",
    name: "Dr. Bezzegh Attila",
    role: "Orvos igazgató, orvos-mikrobiológus",
  },
  {
    quote:
      "Elsődlegesen a mikrobióta-transzfert intézményekben végző kollégák szakmai támogatása a feladatom, valamint a kezelések alatt fellépő tünetek elkülönítése.",
    name: "Dr. Patay Gábor",
    role: "Mikrobióta-specialista, orvos",
  },
];

export const cta = {
  title: "Kérdése van a megfelelő terápiáról?",
  body: "Írjon nekünk, és együtt megtaláljuk az Ön számára legmegfelelőbb MTT-megoldást. Levelére a lehető legrövidebb időn belül válaszolunk.",
  primary: { label: "Kapcsolatfelvétel", href: "#contact" },
  secondary: { label: "info@microbiomebank.com", href: "mailto:info@microbiomebank.com" },
};

export const footer = {
  blurb:
    "Egészséges bélflóra helyreállítása orvosi felügyelettel — a mikrobióta-transzfer terápia szakértője 2016 óta.",
  columns: [
    {
      title: "Kapszulák",
      links: ["DiffBiome", "HospBiome", "TransferBiome", "FindBiome", "AutoBiome", "UltraBiome"],
    },
    {
      title: "MicroBiome Bank",
      links: ["Mikrobióta vizsgálat", "Donoroknak", "Csapatunk", "Blog"],
    },
    {
      title: "Kapcsolat",
      links: ["info@microbiomebank.com", "+36 30 013 5000", "Budapest, Ménesi út 104.", "Braintree, Essex (UK)"],
    },
  ],
};
