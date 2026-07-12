// ----------------------------------------------------------------
// Service catalog, shared between the homepage (summary cards) and
// the full Services page (detailed Problem-Agitate-Solve copy).
// Add a new service by adding a new object to this array — no need
// to touch any .astro page file.
// ----------------------------------------------------------------

export type Service = {
  slug: string;
  name: string;
  shortDescription: string;
  problem: string;
  agitate: string;
  solve: string;
  valueStat: string;
};

export const SERVICES: Service[] = [
  {
    slug: 'inventory-trackers',
    name: 'Automated Stock & Inventory Trackers',
    shortDescription: 'No more manual counting.',
    problem:
      'Right now, checking stock means walking every aisle with a clipboard, then typing it all into a spreadsheet by hand.',
    agitate:
      'That is an entire afternoon gone every week — and one mistyped number can mean ordering too much of something that will not sell, or running out of something that will.',
    solve:
      'We build a simple digital counter your staff can use on a phone or tablet. Counts update instantly, and you get an automatic phone or email alert the moment any item runs low — no more guessing, no more wasted trips to the stock room.',
    valueStat: 'Time Saved: up to 4 hours every week',
  },
  {
    slug: 'invoice-organizers',
    name: 'Smart Invoice & Receipt Organizers',
    shortDescription: 'From paper folders to secure digital lookups.',
    problem:
      'Invoices and receipts live in paper folders, shoeboxes, or a dozen different email inboxes — and finding one specific receipt at tax time takes forever.',
    agitate:
      'A missing receipt can mean a missed deduction, a stressful scramble before a filing deadline, or hours of an employee’s time spent digging through paper.',
    solve:
      'We build a secure digital filing system that organizes every invoice and receipt automatically as it comes in. Any document is a search away — no folders, no shoeboxes, no lost paperwork.',
    valueStat: 'Dollars Prevented from Waste: fewer missed deductions, less admin time billed',
  },
  {
    slug: 'weekly-reporting',
    name: 'Hands-Free Weekly Reporting',
    shortDescription: 'Profit summaries, delivered automatically.',
    problem:
      'Every Friday night (or Sunday), someone sits down and manually tallies the week’s sales and costs in Excel to figure out what the store actually made.',
    agitate:
      'One broken formula and the whole report is wrong — and you will not find out until it is too late to fix the ordering decision it was supposed to inform.',
    solve:
      'We set up a plain-English profit summary that lands in your inbox automatically every Friday. No formulas to break, no spreadsheet to maintain — just the numbers you need, on time, every time.',
    valueStat: 'Hours Reprieved: your Friday nights and Sunday afternoons back',
  },
  {
    slug: 'custom-business-tools',
    name: 'Custom Business Tools',
    shortDescription: 'A digital spreadsheet that manages itself.',
    problem:
      'Every store has its own quirks — a supplier order sheet, a staff schedule, a loyalty tracker — that nobody else’s off-the-shelf software quite fits.',
    agitate:
      'So you keep patching it together in Excel, and every patch is another place for a typo or a dropped formula to cost you money.',
    solve:
      'We build a tool designed around exactly how your business already works, so your team keeps doing things the way they know — just without the manual re-typing and the errors that come with it.',
    valueStat: 'Built around your process, not the other way around',
  },
];
