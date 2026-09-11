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
// This is the ONLY file to edit — all three book landing pages read
// from it.
//
//   etsy   — the digital / instant-download listing
//   amazon — the Amazon KDP paperback
//
// An empty string means "not on sale yet": the landing page renders a
// quiet, non-clickable "Coming soon" chip in place of that button,
// rather than a link that goes nowhere. Fill one in and the button
// becomes live on the next build — no other change needed.
// ----------------------------------------------------------------
export const BOOK_LINKS = {
  leia: {
    // Live 09 Sep 2026. Etsy: CA$7.99 instant-download PDF.
    // Amazon: paperback, ISBN 9798194994618, by @Antz.
    etsy: 'https://www.etsy.com/ca/listing/4569612913/super-leia-to-the-rescue-coloring',
    amazon: 'https://www.amazon.com/dp/B0HJDBPMQ7',
  },
  rentalLog: {
    etsy: '',
    amazon: '',
  },
  heartHealth: {
    etsy: '',
    amazon: '',
  },
};
