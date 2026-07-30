// ----------------------------------------------------------------
// Site-wide constants. Edit this ONE file to update the business
// name, contact details, or navigation across the entire site —
// every page pulls from here instead of hard-coding text.
// ----------------------------------------------------------------

export const SITE = {
  businessName: 'Reelcase',
  shortName: 'Reelcase',
  domain: 'www.logicmanse.ca',
  tagline: 'Your work, cut together.',
  subTagline:
    "Reelcase turns your best takes into a cinematic portfolio — the kind of reel that gets a creator a callback, not a scroll-past.",

  // TODO (Ani): replace with the real branded inbox once it's created
  // in your GoDaddy / email provider control panel, e.g. info@logicmanse.ca
  contactEmail: 'info@logicmanse.ca',

  // TODO (Ani): add a phone number here if you want one published.
  phone: '',

  location: 'Ontario, Canada',
  registrationLine: 'Registered Corporate Entity, Ontario, Canada',
  copyrightYear: 2026,
};

// NOTE: only Home + Contact are wired into nav right now. About, Services,
// Portfolio, and Trust & Security still carry copy from the pre-pivot
// "custom retail software" business and need a content rewrite before
// they're re-linked — see redesign notes.
export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Contact', href: '/contact/' },
];

export const HEADER_NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Contact', href: '/contact/' },
];

// TODO (Ani): flip to false once the full site content is finalized.
// Shows a construction notice bar on every page.
export const SITE_UNDER_CONSTRUCTION = true;
