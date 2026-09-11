// ----------------------------------------------------------------
// Site-wide constants. Edit this ONE file to update the business
// name, contact details, or navigation across the entire site —
// every page pulls from here instead of hard-coding text.
// ----------------------------------------------------------------

export const SITE = {
  businessName: 'Logicmanse Solutions Canada Inc.',
  shortName: 'Logicmanse Solutions',
  domain: 'www.logicmanse.ca',
  tagline: 'Books Made to Be Used, Not Just Read.',
  subTagline:
    'Logicmanse Solutions publishes coloring books, log books, journals, and cookbooks — plain, practical, and built around how you actually use them, not just what looks good on a shelf.',

  // TODO (Ani): replace with the real branded inbox once it's created
  // in your GoDaddy / email provider control panel, e.g. info@logicmanse.ca
  contactEmail: 'info@logicmanse.ca',

  // TODO (Ani): add a phone number here if you want one published.
  phone: '',

  location: 'Ontario, Canada',
  registrationLine: 'Registered Corporate Entity, Ontario, Canada',
  copyrightYear: 2026,
};

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Books', href: '/books/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
  { label: 'Privacy Policy', href: '/privacy-policy/' },
];

export const HEADER_NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Books', href: '/books/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
];

export const SITE_UNDER_CONSTRUCTION = false;

// ----------------------------------------------------------------
// Where each book is actually sold.
//
// TODO (Ani): paste the real listing URLs here as each one goes live.
// This is the ONLY file to edit — the /books/ listing and all three
// product pages read from it.
//
//   etsy        — the digital / instant-download listing
//   amazon.com  — the Amazon KDP paperback, US store
//   amazon.ca   — the same paperback on the Canadian store
//
// Two Amazon stores because it matters to the buyer: the same paperback
// bought from amazon.com into Canada adds roughly CAD 11 of shipping,
// while amazon.ca ships it free over CAD 35. The page ships with the
// .com link in the HTML and swaps to .ca for visitors in Canada — see
// the note in src/components/BuyButtons.astro.
//
// An empty string means "not on sale there yet". A book with no store
// at all renders quiet, non-clickable "Coming soon" chips instead of
// links that go nowhere, and /books/ lists it as Coming soon. Fill one
// in and both flip on the next build — no other change needed.
// ----------------------------------------------------------------
export interface StoreLinks {
  etsy: string;
  amazon: { com: string; ca: string };
}

export const BOOK_LINKS: Record<'leia' | 'rentalLog' | 'heartHealth', StoreLinks> = {
  leia: {
    // Live 09 Sep 2026. Etsy: CA$7.99 instant-download PDF.
    // Amazon: paperback, ISBN 9798194994618, by @Antz.
    etsy: 'https://www.etsy.com/ca/listing/4569612913/super-leia-to-the-rescue-coloring',
    amazon: {
      com: 'https://www.amazon.com/dp/B0HJDBPMQ7',
      ca: 'https://www.amazon.ca/dp/B0HJDBPMQ7',
    },
  },
  rentalLog: {
    // Live 10 Sep 2026. Etsy: CA$12.49, the 111-page print-at-home PDF
    // (the 109-page interior plus its two cover pages).
    // Amazon: paperback not published yet.
    etsy: 'https://www.etsy.com/ca/listing/4570945138/rental-property-record-book-printable',
    amazon: { com: '', ca: '' },
  },
  heartHealth: {
    // Live 10 Sep 2026. Etsy: CA$14.99, the 118-page colour edition zip.
    // Amazon: paperback, CA$22.12.
    etsy: 'https://www.etsy.com/ca/listing/4571003575/heart-health-log-book-printable-blood',
    amazon: {
      com: 'https://www.amazon.com/dp/B0HJ36SSN8',
      ca: 'https://www.amazon.ca/dp/B0HJ36SSN8',
    },
  },
};

/** True once a title can be bought anywhere. */
export const isForSale = (key: keyof typeof BOOK_LINKS) => {
  const l = BOOK_LINKS[key];
  return Boolean(l.etsy || l.amazon.com || l.amazon.ca);
};
