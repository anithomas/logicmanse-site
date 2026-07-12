// ----------------------------------------------------------------
// Site-wide constants. Edit this ONE file to update the business
// name, contact details, or navigation across the entire site —
// every page pulls from here instead of hard-coding text.
// ----------------------------------------------------------------

export const SITE = {
  businessName: 'Logicmanse Solutions Canada Inc.',
  shortName: 'Logicmanse Solutions',
  domain: 'www.logicmanse.ca',
  tagline: 'Stop Losing Your Weekends to Spreadsheets.',
  subTagline:
    "We build custom, secure tools that automate your inventory, sales tracking, and reporting — so you can focus on running your store, not managing data.",

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
  { label: 'Services', href: '/services/' },
  // Points straight at the Services page's "How It Works" section rather
  // than /how-it-works/ — that page is just a redirect stub kept alive for
  // old bookmarks/search results, no reason to bounce through it internally.
  { label: 'How It Works', href: '/services/' },
  { label: 'Portfolio', href: '/portfolio/' },
  { label: 'About', href: '/about/' },
  { label: 'Security', href: '/trust-security/' },
  { label: 'Contact', href: '/contact/' },
];

// Condensed set for the header bar only (footer still lists everything
// above). Merges "How It Works" into the Services page, so it isn't a
// separate nav item up top.
export const HEADER_NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services/' },
  { label: 'Portfolio', href: '/portfolio/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
];

// TODO (Ani): flip to false once the full site content is finalized.
// Shows a construction notice bar on every page.
export const SITE_UNDER_CONSTRUCTION = true;
