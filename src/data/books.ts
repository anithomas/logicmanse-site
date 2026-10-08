// ----------------------------------------------------------------
// One record per title, and the single source of truth for every page
// that talks about a book: the /books/ listing, the homepage featured
// cards, and each title's own product page.
//
// TWO PAGES PER BOOK, and they are not interchangeable:
//
//   productHref — /books/<slug>/ — for a visitor who has NOT bought.
//                 It sells: cover, what's inside, and the two buy
//                 buttons. Reached from the site's own navigation.
//
//   qrHref      — the short URL PRINTED INSIDE THE BOOK, next to a QR
//                 code — for a reader who HAS bought and is holding it.
//                 It gives away the free companion and never sells
//                 anything. These URLs are fixed in printed covers and
//                 must never change or be repointed.
//
// Copy below is taken from each title's blueprint and printed cover
// (Book Blueprint No. 01 = rental log, No. 02 = heart health) rather
// than written fresh, so the site and the books can't drift apart.
// ----------------------------------------------------------------

import { REACH_FORMS, SOCIAL_LINKS } from './site';

const YOUTUBE_URL = SOCIAL_LINKS.find((l) => l.label === 'YouTube')!.href;

/** One per title: pink (Leia), forest (rental log), clay (heart health log),
    earth (renovation book), spice (Family Table Favorites — its own accent
    #8A301F, straight from that book's own design system, COWORK_HANDOFF §3). */
export type BookTheme = 'pink' | 'forest' | 'clay' | 'earth' | 'spice';

// Shared by the three Reach-form companions: what the button is followed by.
const SIGNUP_NOTE = 'Takes 10 seconds. We’ll email you the link right away.';

export interface Book {
  key: 'leia' | 'rentalLog' | 'heartHealth' | 'renovationLog' | 'familyTableFavorites';
  /** True until the book is on sale and has a real cover. An unreleased
      title has a product page (so its printed URL and the site are ready)
      but stays off the homepage and the /books/ listing, and is noindex.
      Delete this line, add the cover, and it joins the shelf. */
  unreleased?: boolean;
  /** A small accent from the book's own cover — the eyebrow line, step
      numbers, pull-quote bar and a faint section tint on its product page.
      NEVER buttons, header, footer, hero or type: those stay the site's
      brand (navy and forest green) on every page. See the note in
      src/layouts/BookProductLayout.astro. */
  theme?: BookTheme;
  slug: string;
  productHref: string;
  qrHref: string;
  category: string;
  title: string;
  /** One line, for cards and the product hero. */
  tagline: string;
  /** Longer, for the /books/ listing and (under the tagline) the product
      page's own hero — most titles' description is short enough to carry
      both jobs; override with metaDescription below if a title needs
      different wording for search results specifically. */
  description: string;
  /** Overrides the product page's <title> / og:title (default: book.title).
      Use for a title whose plain name carries no search-relevant context
      on its own (e.g. a cookbook whose title doesn't say "cookbook"). */
  metaTitle?: string;
  /** Overrides the product page's meta/og description (default:
      book.tagline). The tagline is written for emotional resonance, not
      search intent, so a title that wants real search terms in its
      description — recipe count, cuisine, format — sets this instead of
      changing the tagline itself. */
  metaDescription?: string;
  specs: string;
  /** A handful of headline numbers for the hero (e.g. recipe count, page
      count) — for a title whose specs line alone doesn't make its scale
      obvious at a glance. Optional; most titles don't need it. */
  stats?: { value: string; label: string }[];
  cover: string;
  coverAlt: string;
  interior?: string;
  interiorAlt?: string;
  /** The listing video — the same silent square slideshow Etsy shows. */
  video?: string;
  /** Its first frame, and square like the video. Using a non-square
      still here makes the player box adopt the still's shape before the
      video's metadata loads, which letterboxes the whole slideshow. */
  videoPoster?: string;
  /** What is actually in the printed book. */
  inside: string[];
  /** A short, persuasive case for the collection as a whole — not another
      feature list (that's `inside`), but why 72 (or however many) items
      in one place beats having them loose. Optional; shown as its own
      section on the product page, right after "What's inside". */
  valueProps?: { heading: string; intro: string; items: string[] };
  /** The free bonus every copy comes with, delivered via qrHref. Omit for a
      title with no bonus yet — its product page then skips the "claim your
      free companion" copy and its qrHref becomes a plain "more from us"
      link instead (see BookProductLayout.astro). Also omit for a title
      whose free offer ISN'T something every copy includes — e.g. a
      pre-purchase lead-magnet sample aimed at people who haven't bought
      yet (see companionOffer.audience below): claiming "every copy
      includes this, free" would misdescribe that kind of offer. */
  companion?: { name: string; blurb: string };
  /** Overrides the Amazon button's default "Paperback · delivered" caption
      — for a title whose one Amazon link covers more than one format (KDP
      links paperback/hardcover/Kindle to the same product page once all
      three are published). */
  amazonFormatLabel?: string;
  /** For a title sold in more than two formats, each with its own real
      link (this catalog's other titles only ever have an Etsy PDF and one
      Amazon paperback, which BuyButtons already covers) — a plain list of
      every edition, shown on the product page and the printed-URL page.
      price is a display string (e.g. "US$9.99"); prices drift, so check
      the live listing before trusting an old one. kind groups the list
      into "Digital Edition" / "Print Editions" subsections when any entry
      sets it; omit kind on every entry to keep the old flat grid. */
  editions?: { label: string; format: string; price: string; href: string; kind?: 'digital' | 'print' }[];
  /** The "Claim your free companion" section on the product page, at
      #companion. It is one button with a short write-up around it. For the
      three titles whose QR code goes to a separate page, the button is the
      same Hostinger Reach sign-up form that page uses; for the Renovation
      book, whose QR lands on this page, it is a direct file download. */
  companionOffer?: {
    /** Overrides the section's default eyebrow ("Already own the book?")
        and heading ("Claim your free companion") — for an offer open to
        ANY visitor rather than only people who already bought, e.g. a
        free recipe sample meant to be a reason to buy, not a thing you
        get after buying. Pair with `companion` left unset on the book
        record (see its doc comment) so the hero and closing section don't
        also claim it's an included bonus. */
    eyebrow?: string;
    heading?: string;
    /** Overrides book.companion.blurb as this section's intro line —
        needed whenever `companion` itself is left unset. */
    blurb?: string;
    /** What the free companion contains, one line each. */
    contents: string[];
    /** How to start, in order. */
    steps: string[];
    /** The button. `download` (a filename) makes it a direct download;
        without it the href is a sign-up form. An empty href hides the
        section's button, for a form that doesn't exist yet. */
    cta: { href: string; label: string; note: string; download?: string };
  };
  /** "Cook along with us" — a modest nod to a companion YouTube channel,
      shown as its own small section. Never styled to compete with the Buy
      buttons; it's a side door, not the destination. Optional. */
  youtube?: { heading: string; blurb: string; href: string; label: string };
  /** Optional pull-quote for the product page. */
  story?: { quote: string; body: string };
}

export const BOOKS: Book[] = [
  {
    key: 'leia',
    slug: 'leia-coloring-book',
    productHref: '/books/leia-coloring-book/',
    qrHref: '/LeiaColoringBook/',
    category: 'Coloring & Activity Book',
    title: 'Super Leia to the Rescue!',
    tagline:
      'A coloring and activity book inspired by a real dog — 30 coloring pages, mazes, word searches and drawing prompts.',
    description:
      'A coloring & activity book inspired by a real dog named Leia — mazes, word searches, and 30 coloring pages, with a free bonus color pack and real photos for kids and parents.',
    specs: '8.5" × 11" · 106 pages · ages 4–8',
    cover: '/leia-coloring-book/cover-front.jpg',
    coverAlt: 'Super Leia to the Rescue! book cover',
    interior: '/leia-coloring-book/backyard-illustration.jpg',
    interiorAlt: "Leia's backyard, illustrated",
    video: '/leia-coloring-book/promo-video.mp4',
    videoPoster: '/leia-coloring-book/video-poster.jpg',
    inside: [
      '30 coloring pages — portraits, seasons, walks, naps and holiday scenes',
      'Mazes, word searches, crosswords, dot-to-dots and word scrambles, alternated so the book never feels repetitive',
      'Drawing prompts with a bordered blank box: her dream dog house, her birthday cake, you playing fetch with her',
      'Counting, letter tracing, sequencing and simple sums, worked into the activities rather than bolted on',
      'A full answer key at the back, so a parent is never the one stuck',
    ],
    companion: {
      name: "Leia's bonus color pack",
      blurb:
        'Full-colour reference images for all 30 pages, real photos of the actual dog, and every puzzle answer.',
    },
    theme: 'pink',
    companionOffer: {
      cta: { href: REACH_FORMS.leia, label: 'Send me the color pack →', note: SIGNUP_NOTE },
      contents: [
        'Full-color reference images for all 30 coloring pages, matched page-by-page to your book',
        'Real bonus photos of Leia — the actual dog who inspired the story',
        'The complete answer key for every maze, word search, and puzzle',
        'A behind-the-scenes note from the author',
      ],
      steps: [
        'Tap the button and add your email — it takes about 10 seconds.',
        'We email you the download link right away.',
        'Keep the pack beside your book: the reference pages match it page by page.',
      ],
    },
    story: {
      quote: 'Leia is a real dog.',
      body:
        'Every page in this book started from a photograph of her — the same fluffy tail, the same triangle ears, the same spot in the backyard. Kids who finish the book get to meet her properly in the bonus pack.',
    },
  },
  {
    // Published 2026-09-27 (paperback, hardcover and Kindle all confirmed
    // live via KDP's own e-mails that day, each its own ASIN/page — see
    // `editions` below) and 2026-09-30 (Etsy digital PDF). Volume One of a
    // three-volume series; copy is taken from the KDP listing itself
    // (FTF_Vol1_KDP_Publishing_Kit.md) so the site and the listing can't
    // drift apart, same rule as every other title here.
    key: 'familyTableFavorites',
    theme: 'spice',
    slug: 'family-table-favorites-vol1',
    productHref: '/books/family-table-favorites-vol1/',
    // The book's own back cover prints this exact URL next to its QR code
    // (no free bonus promised there — just "more from our kitchen, and
    // news on Volumes Two and Three"), so unlike the other titles this
    // isn't a giveaway page. See qrHref's doc comment above and the
    // fallback it triggers in BookProductLayout.astro.
    qrHref: '/familytablefavorites-vol1/',
    category: 'Cookbook',
    title: 'Family Table Favorites',
    tagline: 'Handed down, cooked often, written down at last.',
    description:
      'Kerala classics and East-West family favorites, cooked in North American kitchens and passed down at the family table — 72 heirloom recipes in 15 sections, from Sunday chicken stew and layered biriyani to baked pasta, banana bread and a caramel pudding that never lasts the night.',
    metaTitle: 'Family Table Favorites — A Kerala Family Cookbook, Vol. 1',
    metaDescription:
      'A Kerala and Malayali family cookbook: 72 heirloom recipes in 15 sections of South Indian and East-West home cooking, handed down and written down at last. 158 pages, 22 color photos — digital PDF or print.',
    specs: '8.5" × 11" · 158 pages · Volume One of Three',
    stats: [
      { value: '72', label: 'Recipes' },
      { value: '15', label: 'Sections' },
      { value: '158', label: 'Pages' },
      { value: '22', label: 'Color Photos' },
    ],
    cover: '/family-table-favorites/cover-front.jpg',
    coverAlt: 'Family Table Favorites, Volume One, book cover',
    interior: '/family-table-favorites/interior-page.jpg',
    interiorAlt: 'A sample interior page: the Snacks, Starters & Savories section opener',
    // A silent square slideshow, same spec as the other titles' listing
    // videos (PromoVideo.astro): 1080x1080, five cards, a slow zoom
    // between them. Built with Remotion from real production files — the
    // KDP cover PDF (front and back panels) and two full-bleed feature
    // photos pulled straight from the finished interior PDF (pages 22 and
    // 70) — not stock or AI-illustrated filler. Source project + render
    // script: ask before rebuilding, since the source images were cropped
    // by hand for this specific cut.
    video: '/family-table-favorites/promo-video.mp4',
    videoPoster: '/family-table-favorites/video-poster.jpg',
    inside: [
      '72 heirloom recipes in 15 sections, from breakfast to sweets',
      '22 full-page color images, and every recipe illustrated, so you know what you’re aiming for',
      'Clear measurements, servings, cook times and numbered steps written for home cooks',
      'Cook’s notes and tips throughout: what to watch for, what to swap, and how each dish should look and taste',
      'A glossary of ingredients and a measurements guide',
      'Keepsake pages to record your own family’s recipes and notes, ready to hand down',
      'A large 8.5 × 11 in format with easy-to-read type',
    ],
    valueProps: {
      heading: 'Why this cookbook',
      intro:
        'You’re not just paying for access to individual recipes — you’re getting the whole collection, cooked, tested and written down once, so it’s ready whenever you need it.',
      items: [
        'All 72 recipes in one place, not scattered across handwritten cards and screenshots',
        'Consistent measurements, servings and cook times — no guessing at “a handful” or “cook until done”',
        'Cook’s notes and tips: what to watch for, what to swap, and how each dish should look and taste',
        'The family and food background behind each recipe, not just the method',
        'A glossary of ingredients, so an unfamiliar name never stops you mid-recipe',
        'Full-page recipe presentation with color food photography throughout',
        'A keepsake collection built to stay on the counter and get used for years, not a printout',
      ],
    },
    // Every copy does NOT include a free companion (unlike this book's
    // sibling titles) — see `companion`'s doc comment in the Book
    // interface above. What this title has instead is a pre-purchase
    // lead-magnet sample (companionOffer below, framed for any visitor,
    // not "already own it"), plus the Etsy PDF's bundled 8-page keepsake
    // bonus, which is part of that paid purchase rather than a standalone
    // free giveaway. "Buy on Amazon" defaults to the paperback — the same
    // channel every other title's Amazon button goes to — with the other
    // formats listed separately below.
    amazonFormatLabel: 'Paperback',
    // Every real, live purchase link, exactly as confirmed 2026-09-29 (KDP
    // "published" e-mails for print/Kindle; the Etsy listing itself for
    // the PDF — see FTF_Vol1_Etsy_Listing.md). Prices drift; re-check the
    // live listing before trusting an old figure here.
    editions: [
      {
        label: 'Kindle eBook',
        format: 'Reflowable ebook · 158 pp',
        price: 'US$9.99',
        href: 'https://www.amazon.com/dp/B0HL75YFLS',
        kind: 'digital',
      },
      {
        label: 'Digital PDF',
        format: 'Instant download · 158 pp + an 8-page keepsake bonus',
        price: 'CA$9.99',
        href: 'https://www.etsy.com/ca/listing/4584613661/kerala-cookbook-pdf-dig',
        kind: 'digital',
      },
      {
        label: 'Paperback',
        format: '8.5 × 11 in · standard colour · 158 pp',
        price: 'US$14.99',
        href: 'https://www.amazon.com/dp/B0HL5WYX45',
        kind: 'print',
      },
      {
        label: 'Premium Gift Edition',
        format: 'Hardcover · 8.25 × 11 in · premium colour · 158 pp',
        price: 'US$39.99',
        href: 'https://www.amazon.com/dp/B0HL74CFY8',
        kind: 'print',
      },
    ],
    youtube: {
      heading: 'Cook along with us',
      blurb:
        'We’re building a hands-only cooking channel, cooking these family recipes step by step straight from the book. Come watch them in action.',
      href: YOUTUBE_URL,
      label: 'Watch on YouTube →',
    },
    companionOffer: {
      // Open to ANY visitor, not just owners — see the doc comment on
      // `companion` above for why that field stays unset for this title.
      eyebrow: 'Try it before you buy',
      heading: 'Get 5 Family Favourite Recipes — Free',
      blurb:
        'Want to try a few recipes before getting the complete collection? Download five hand-picked recipes from Family Table Favorites, Volume One — absolutely free.',
      cta: { href: REACH_FORMS.familyTableFavorites, label: 'Get the 5 Free Recipes →', note: SIGNUP_NOTE },
      contents: [
        'Five hand-picked recipes from Family Table Favorites, Volume One',
        'The same presentation as the printed book: full recipe, measurements, servings and cook’s notes',
        'News on Volumes Two and Three, and more recipes from our kitchen',
      ],
      steps: [
        'Tap the button and add your email — it takes about 10 seconds.',
        'We email you the 5 recipes right away.',
        'Like what you taste? The complete 72-recipe collection is above, in digital or print.',
      ],
    },
    story: {
      quote: 'The dishes that taste like home, finally written down.',
      body:
        '@Antz grew up between fast-paced North American life and the spice-filled kitchens of Kerala, cooking beside the aunties who knew every recipe by heart. For years these recipes lived in memory, measured in pinches and handfuls — now every one has been cooked, checked and clarified for your kitchen.',
    },
  },
  {
    key: 'rentalLog',
    slug: 'rental-property-record-book',
    productHref: '/books/rental-property-record-book/',
    qrHref: '/RentalManagementLog/',
    category: 'Log Book',
    title: 'Rental Property Record Book',
    tagline:
      'Built for a landlord managing 1–6 properties, not a property-management firm — 109 undated pages for a full year of real use.',
    description:
      'A record book for a landlord with 1–6 properties, not a property-management firm — rent tracking, tenant & lease logs, maintenance, a mileage log, a vendor directory, and a portfolio-wide annual summary built for tax time.',
    // 109 is the interior; the Etsy print-at-home PDF is 111 because it
    // adds the two cover pages, and its listing title says so. Spell out
    // both here so a buyer clicking through doesn't meet a new number.
    specs: '8.5" × 11" · 109-page interior (111-page printable) · undated',
    cover: '/rental-management-log/cover-front.jpg',
    coverAlt: 'Rental Property Record Book cover',
    interior: '/rental-management-log/interior-page.jpg',
    interiorAlt: 'A sample interior page: the monthly income & expense tracker',
    video: '/rental-management-log/promo-video.mp4',
    videoPoster: '/rental-management-log/video-poster.jpg',
    inside: [
      'A 12-month rent payment tracker, with two units per property across up to 6 properties',
      'Tenant & lease logs, and a key-dates page that puts every renewal and expiry in one place',
      'Maintenance & repair logs, move-in / move-out condition checklists, and a security deposit record',
      'A mileage & travel log for tax-deductible property visits — the thing reviewers of other books kept asking for',
      'A vendor & contractor directory organised by trade, so you are not searching your texts at 9pm',
      'Monthly income & expense trackers and a portfolio-wide annual summary built for tax time',
    ],
    companion: {
      name: 'the digital rental tracker',
      blurb:
        'A 17-tab spreadsheet mirroring every section of the book, with a year-end ROI dashboard that totals itself.',
    },
    theme: 'forest',
    companionOffer: {
      cta: { href: REACH_FORMS.rentalLog, label: 'Send me the tracker →', note: SIGNUP_NOTE },
      contents: [
        'A 12-month rent payment tracker, ready to use for up to 6 properties',
        'A tenant & lease log with every renewal date in one place, so nothing sneaks up on you',
        'A monthly income & expense tracker built with tax time in mind',
        'A vendor & contractor directory template, organized by trade',
      ],
      steps: [
        'Tap the button and add your email — it takes about 10 seconds.',
        'We email you the download link right away.',
        'Open the spreadsheet in Excel, Google Sheets or Numbers and keep it alongside the book.',
      ],
    },
    story: {
      quote: 'Generic expense categories, on purpose.',
      body:
        'No IRS Schedule E line numbers anywhere in it. One competing title got called out in a UK review for being "too American" — this one stays usable for a landlord in any country.',
    },
  },
  {
    key: 'heartHealth',
    slug: 'heart-health-log-book',
    productHref: '/books/heart-health-log-book/',
    qrHref: '/HeartHealthLog/',
    category: 'Log Book',
    title: 'The Complete Heart Health Log Book',
    tagline:
      'One book instead of four, for someone living with a heart condition that is managed rather than cured.',
    description:
      'One book instead of four, for someone living with a heart condition that is managed rather than cured — blood pressure, medicines from morning to bedtime, a blood thinner schedule that changes with the day of the week, test results, and the surgical history every new clinic asks for.',
    specs: '8.5" × 11" · 118 pages · undated · large print',
    cover: '/heart-health-log/cover-front.jpg',
    coverAlt: 'The Complete Heart Health Log Book cover',
    interior: '/heart-health-log/interior-page.jpg',
    interiorAlt: 'A sample interior page: the blood thinner prescribed-schedule log',
    video: '/heart-health-log/promo-video.mp4',
    videoPoster: '/heart-health-log/video-poster.jpg',
    // Verbatim from the printed back cover, under "INSIDE".
    inside: [
      '52 weekly pages — a whole week visible at a glance, in large, easy-to-read print',
      '12 monthly reviews, with a daily weight chart and room for the questions you forget',
      'Blood pressure, heart rate, weight, and morning-noon-evening-bedtime medicines',
      'A blood thinner schedule built for a dose that changes with the day of the week',
      'Surgery history, valve and device records, procedures, dental visits, blood work',
      'A plain-English glossary of 78 terms, and conversion tables for kg, litres and salt',
      'Space for the results nobody ever hands you a copy of',
      'A page for whoever is helping you, so they can pick it up on a bad day',
    ],
    companion: {
      name: 'the companion spreadsheet',
      blurb: 'The same logs as the printed book, for the weeks you would rather type than write.',
    },
    theme: 'clay',
    companionOffer: {
      cta: { href: REACH_FORMS.heartHealth, label: 'Send me the spreadsheet →', note: SIGNUP_NOTE },
      contents: [
        'A weekly tracking sheet that mirrors the printed weekly page — blood pressure, pulse, weight, the four medicine times, and the blood thinner dose actually taken',
        'A monthly review sheet, with the daily weight chart drawn for you as you type',
        'Your medicine list and daily schedule, in one place you can reprint whenever the schedule changes',
        'A test-results log for blood tests, other blood work, scans and heart tests',
        'Your care team, and the one-page summary card — the sheet to fill in once and photograph',
      ],
      steps: [
        'Tap the button and add your email — it takes about 10 seconds.',
        'We email you the download link right away.',
        'Open the spreadsheet on your computer and use it for the weeks you would rather type than write.',
      ],
    },
    story: {
      quote: 'Not one number in here is ours.',
      body:
        'There is no target range, no dosage and no warning sign printed anywhere in this book. Every one of them is a blank line — because they are set for you personally, by the people looking after you. This is simply where yours go.',
    },
  },
  {
    // Built (interior, cover, companion workbook — see
    // Renovation_Repair_Log_Blueprint.md) but not yet on sale, hence
    // `unreleased`. UNLIKE the other three, this title's printed QR code
    // points at its own product page (blueprint §06, changed 2026-09-26),
    // so qrHref is this page's #companion section rather than a separate
    // reader-only page. That URL is printed on the cover: never change it.
    key: 'renovationLog',
    unreleased: true,
    theme: 'earth',
    slug: 'renovation-repair-record-book',
    productHref: '/books/renovation-repair-record-book/',
    qrHref: '/books/renovation-repair-record-book/#companion',
    category: 'Log Book',
    title: 'The Renovation & Repair Record Book',
    tagline:
      'Track every contractor quote, permit, budget and repair across every rental property you own — one book, not a stack of notes per house.',
    description:
      'A record book for a landlord or small-scale investor who runs renovation and repair jobs across more than one property — contractor quotes, permits, budgets and materials, kept separate for each property.',
    specs: '8.5" × 11" · 108 pages · undated · up to 4 properties',
    cover: '/renovation-repair-log/cover-front.jpg',
    coverAlt: 'The Renovation & Repair Record Book cover',
    inside: [
      'A portfolio summary for every property — year built, roof, heating, panel and water-heater age — repeated for four years, so you can see at a glance what needs attention',
      'A 15-page block for each of up to 4 properties: five projects each, with scope, dates and status',
      'A side-by-side contractor quote comparison, so the cheapest quote is never the only thing you looked at',
      'A permit and inspection tracker, and a budget-versus-actual table with a column for why it moved',
      'A materials and fixtures reference — the paint colour and part number you will want in two years — plus a before-and-after photo log',
      'Seasonal maintenance checklists, emergency shut-off details and a contractor performance review, so the next hiring decision has a paper trail',
      'A vendor and contractor directory across 24 trades, a capital improvements log and an annual budget planner',
      'A four-page guide to renovating a rental property — repair or capital improvement, renovating while tenanted, vetting a contractor, protecting your return',
    ],
    companion: {
      name: 'the digital renovation tracker',
      blurb:
        'An 18-tab spreadsheet that mirrors the tables in the book, with a live dashboard and the budget sums done for you.',
    },
    companionOffer: {
      cta: {
        href: '/renovation-repair-log/Renovation_Repair_Digital_Companion.xlsx',
        label: 'Download the workbook (.xlsx) ↓',
        note: 'Renovation_Repair_Digital_Companion.xlsx',
        download: 'Renovation_Repair_Digital_Companion.xlsx',
      },
      contents: [
        'A portfolio summary and at-a-glance dashboard, with live totals',
        'A project tracker that links every log sheet to a property and project',
        'Contractor and quote comparison, permits, budget vs. actual, materials and photo log — per project',
        'Property systems and appliances, emergency contacts, and a seasonal maintenance checklist',
        'A vendor and contractor directory, spend-by-property rollups and an annual budget planner',
        'A capital improvements log and a repair-vs-capital reference page to fill in with your own accountant',
      ],
      steps: [
        'Download the workbook and open it in Excel, Google Sheets or Numbers.',
        'Start on the Portfolio Summary tab and add your properties, then log each job on the Project Tracker tab.',
        'Every other tab picks up your property and project names from a dropdown — fill in the rest as you go, on paper or on screen.',
      ],
    },
    story: {
      quote: 'Organised by property, not by room.',
      body:
        'Homeowner planners ask which colour you picked for the guest room. A landlord asks which contractor quoted the roof at the North Bay unit, and whether that permit was ever closed out. This book is built for the second question.',
    },
  },
];

/** The titles shown on the homepage and /books/ — everything but the
    ones still being written. */
export const SHELF = BOOKS.filter((b) => !b.unreleased);

export const bookBySlug = (slug: string) => BOOKS.find((b) => b.slug === slug)!;
