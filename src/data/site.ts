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

// NOTE (pivot to publishing, Sep 2026): Services, Portfolio, and
// Trust & Security still carry copy from the pre-pivot "custom retail
// software" business and need a content rewrite before they're re-linked
// — same situation as the earlier Reelcase pivot notes. Not deleted,
// just intentionally left out of nav below.
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
