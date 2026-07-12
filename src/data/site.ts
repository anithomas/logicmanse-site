// ----------------------------------------------------------------
// Site-wide constants. Edit this ONE file to update the business
// name, contact details, or navigation across the entire site —
// every page pulls from here instead of hard-coding text.
// ----------------------------------------------------------------

export const SITE = {
  businessName: 'Logicmanse Solutions Canada Inc.',
  shortName: 'Logicmanse Solutions',
  domain: 'www.logicmanse.ca',
  tagline: 'Get Rid of Your Weekly Paperwork Hassles.',
  subTagline:
    'We build safe, custom software tools that manage your inventory, track your store sales, and eliminate spreadsheet errors. No tech background required.',

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
  { label: 'How It Works', href: '/how-it-works/' },
  { label: 'Portfolio', href: '/portfolio/' },
  { label: 'About', href: '/about/' },
  { label: 'Security', href: '/trust-security/' },
  { label: 'Contact', href: '/contact/' },
];
